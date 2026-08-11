import * as fitsjs from 'fitsjs';

/**
 * Header handling for Radio Cartographer FITS maps.
 *
 * RC has emitted at least three header dialects over the years, and the tool
 * has to read all of them:
 *
 *  1. Oldest  - CTYPE1 = 'RA' (no projection code), plus the RC-private cards
 *               RCCORDS / CENTERRA / CENTERDE / RCMINFQ / RCMAXFQ.
 *  2. Middle  - CTYPE1 = 'RA---TAN', still with the RC-private cards.
 *  3. Newest  - CTYPE1 = 'RA---SFL', full standard WCS (WCSAXES, CUNIT,
 *               LONPOLE, LATPOLE, RADESYS) and *none* of the RC-private cards.
 *               Frequency is a single OBSFREQ instead of a min/max pair.
 *
 * `normalizeRadioHeader` collapses all three onto one shape so the rest of the
 * tool never has to branch on dialect.
 */

export type CoordSystem = 'equatorial' | 'galactic';

export interface WcsInfo {
  crpix1: number;
  crpix2: number;
  crval1: number;
  crval2: number;
  cdelt1: number;
  cdelt2: number;
}

export interface RadioMapHeader {
  naxis1: number;
  naxis2: number;
  bitpix: number;
  bscale: number;
  bzero: number;
  /** Which sky frame crval1/crval2 and the catalogue columns are expressed in. */
  coordSystem: CoordSystem;
  /** WCS projection code from CTYPE1: 'TAN', 'SFL', 'CAR', ... or '' when absent. */
  projection: string;
  /** Map centre longitude (RA, or galactic longitude when coordSystem is galactic), degrees in [0, 360). */
  centerLon: number;
  /** Map centre latitude (Dec, or galactic latitude), degrees. */
  centerLat: number;
  lowerFreq: number;
  upperFreq: number;
  /** Midpoint of the band - what the flux interpolation targets. */
  targetFreq: number;
  /** Beam FWHM in degrees. */
  beamWidth: number;
  wcs: WcsInfo;
}

const CARD_SIZE = 80;
const BLOCK_SIZE = 2880;

/**
 * Byte offset at which the primary HDU's data begins.
 *
 * Must scan card-by-card rather than searching for the text 'END': every RC
 * file contains an `EXTEND = T` card near the top, and a naive
 * `indexOf('END')` matches the tail of *that* keyword at byte 403. The old
 * code compensated with a fixed `+ 2880`, which silently assumed every header
 * was exactly two blocks long - true for older files, false for the newer
 * three-block ones, whose pixel data then got read 2880 bytes too early.
 */
export function findDataOffset(buffer: ArrayBuffer): number {
  const text = new TextDecoder('latin1').decode(buffer);

  for (let offset = 0; offset + CARD_SIZE <= text.length; offset += CARD_SIZE) {
    const card = text.slice(offset, offset + CARD_SIZE);
    // A real END card is the keyword followed by nothing but padding.
    if (card.startsWith('END') && card.slice(3).trim() === '') {
      return Math.ceil((offset + CARD_SIZE) / BLOCK_SIZE) * BLOCK_SIZE;
    }
  }

  throw new Error('Invalid FITS header: no END card found at a card boundary.');
}

/** Decode the primary header as text, one character per byte. */
export function decodeHeaderText(buffer: ArrayBuffer): string {
  return new TextDecoder('latin1').decode(buffer.slice(0, findDataOffset(buffer)));
}

/**
 * Encode header text back to bytes, one byte per character.
 *
 * Not TextEncoder: that emits UTF-8, so any character above 0x7F would silently
 * become two bytes and shift every card after it. FITS headers are ASCII, so a
 * direct char-code copy is both exact and length-preserving.
 */
export function encodeHeaderText(text: string): Uint8Array {
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) {
    bytes[i] = text.charCodeAt(i) & 0xff;
  }
  return bytes;
}

/**
 * Render a number as a FITS fixed-format value: exactly 20 characters,
 * right-justified, so it occupies columns 11-30 of the card.
 *
 * Sheds precision rather than overflowing. The previous code used
 * `String(value).padStart(20)`, which does not truncate - a value needing more
 * than 20 characters lengthened the card and shifted every byte after it,
 * corrupting the file.
 */
export function formatFitsNumber(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error(`Cannot write non-finite value to a FITS header: ${value}`);
  }

  let text = String(value);

  // 15 significant digits is still far more than the astrometry justifies.
  for (let digits = 17; text.length > 20 && digits >= 9; digits--) {
    text = value.toPrecision(digits);
  }

  if (text.length > 20) {
    text = value.toExponential(12);
  }

  if (text.length > 20) {
    throw new Error(`Cannot fit value in a FITS card: ${value}`);
  }

  return text.padStart(20);
}

/**
 * Replace the value of a numeric keyword, rewriting the whole 80-character card.
 *
 * Rewriting the entire card - rather than regex-replacing the keyword-plus-value
 * span - is what guarantees the header length is preserved, regardless of how
 * the original card was formatted. Any existing comment is carried over.
 *
 * Returns the header unchanged if the keyword is absent, which is the correct
 * outcome for cards the newer RC dialect no longer emits (CENTERRA, CENTERDE).
 */
export function rewriteHeaderCard(header: string, keyword: string, value: number): string {
  for (let offset = 0; offset + CARD_SIZE <= header.length; offset += CARD_SIZE) {
    const card = header.slice(offset, offset + CARD_SIZE);

    if (card.slice(0, 8).trim() !== keyword) {
      continue;
    }

    // The value field ends at column 30, so any '/' at or beyond that index is
    // the comment separator rather than part of the value.
    const commentIndex = card.indexOf('/', 30);
    const comment = commentIndex >= 0 ? card.slice(commentIndex) : '';

    let rebuilt = `${keyword.padEnd(8)}= ${formatFitsNumber(value)}`;
    if (comment) {
      rebuilt = `${rebuilt} ${comment}`;
    }
    rebuilt = rebuilt.slice(0, CARD_SIZE).padEnd(CARD_SIZE);

    return header.slice(0, offset) + rebuilt + header.slice(offset + CARD_SIZE);
  }

  return header;
}

/**
 * Decode exactly the primary header, however many blocks it occupies.
 *
 * The old code decoded a fixed 5760 bytes (two blocks); a three-block header
 * had its final cards - including END - truncated away.
 */
export function decodePrimaryHeader(buffer: ArrayBuffer): fitsjs.astro.FITS.Header {
  const headerLength = findDataOffset(buffer);
  const block = new TextDecoder('latin1').decode(buffer.slice(0, headerLength));
  return new fitsjs.astro.FITS.Header(block);
}

/** Read a card as a number, tolerating RC's habit of quoting numeric values. */
function num(header: fitsjs.astro.FITS.Header, key: string): number | undefined {
  if (!header.contains(key)) {
    return undefined;
  }
  const raw = header.get(key);
  if (raw === undefined || raw === null || raw === '') {
    return undefined;
  }
  const value = typeof raw === 'number' ? raw : Number(String(raw).trim());
  return Number.isFinite(value) ? value : undefined;
}

function str(header: fitsjs.astro.FITS.Header, key: string): string | undefined {
  if (!header.contains(key)) {
    return undefined;
  }
  const raw = header.get(key);
  return raw === undefined || raw === null ? undefined : String(raw).trim();
}

/** Extract the projection code from a CTYPE value: 'RA---SFL' -> 'SFL', 'RA' -> ''. */
export function parseProjection(ctype: string | undefined): string {
  if (!ctype) {
    return '';
  }
  const match = ctype.trim().match(/-{1,}([A-Z]{3})$/);
  return match ? match[1] : '';
}

/**
 * Which frame the coordinates are in.
 *
 * Prefers the RC-private RCCORDS card, because on galactic maps RC stores
 * galactic longitude/latitude in cards *named* CENTERRA/CENTERDE with
 * CTYPE still claiming 'RA'/'DEC' - so CTYPE alone would mislead. Newer files
 * drop RCCORDS entirely, and there CTYPE is trustworthy.
 */
export function parseCoordSystem(header: fitsjs.astro.FITS.Header): CoordSystem {
  const rccords = str(header, 'RCCORDS')?.toLowerCase();
  if (rccords === 'equatorial' || rccords === 'galactic') {
    return rccords;
  }

  const ctype1 = str(header, 'CTYPE1')?.toUpperCase() ?? '';
  return ctype1.startsWith('GLON') ? 'galactic' : 'equatorial';
}

/** Normalize longitude into [0, 360). */
function wrapLongitude(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Convert a header frequency to MHz, which is what the rest of the tool works
 * in (the catalogue columns are 38 ... 8400 MHz).
 *
 * Headers carrying RCVERS state frequency in Hz. Older ones used MHz for
 * RCMINFQ/RCMAXFQ/OBSFREQ - so OBSFREQ alone is ambiguous across generations.
 * The magnitude guard covers a header that switched to Hz without declaring
 * RCVERS: no Skynet map is anywhere near 100 GHz, so a larger value must be Hz.
 */
function toMHz(value: number, declaredHz: boolean): number {
  if (declaredHz) {
    return value / 1e6;
  }
  return value > 1e5 ? value / 1e6 : value;
}

/**
 * Collapse any RC header dialect onto {@link RadioMapHeader}.
 *
 * @throws if the cards required to render an image at all are missing.
 */
export function normalizeRadioHeader(header: fitsjs.astro.FITS.Header): RadioMapHeader {
  const naxis1 = num(header, 'NAXIS1');
  const naxis2 = num(header, 'NAXIS2');
  const bitpix = num(header, 'BITPIX');

  if (!naxis1 || !naxis2 || !bitpix) {
    throw new Error('Invalid or missing header values (NAXIS1, NAXIS2, BITPIX).');
  }

  const wcs: WcsInfo = {
    crpix1: num(header, 'CRPIX1') ?? 0,
    crpix2: num(header, 'CRPIX2') ?? 0,
    crval1: num(header, 'CRVAL1') ?? 0,
    crval2: num(header, 'CRVAL2') ?? 0,
    cdelt1: num(header, 'CDELT1') ?? 1,
    cdelt2: num(header, 'CDELT2') ?? 1,
  };

  // Older files carry an explicit map centre; newer ones only have the WCS
  // reference point. On every file seen so far the two are identical anyway.
  const centerLon = wrapLongitude(num(header, 'CENTERRA') ?? wcs.crval1);
  const centerLat = num(header, 'CENTERDE') ?? wcs.crval2;

  // Frequency has been expressed three ways across RC generations:
  //   - RCMINFQ / RCMAXFQ  (MHz)         band edges, oldest
  //   - OBSFREQ            (MHz)         centre only, band unrecoverable
  //   - OBSFREQ + BANDWID  (Hz, RCVERS)  centre + width, current
  // FREQ (GHz) appears on some older files as a secondary.
  const declaredHz = header.contains('RCVERS');

  let lowerFreq: number | undefined;
  let upperFreq: number | undefined;

  const rcMinFreq = num(header, 'RCMINFQ');
  const rcMaxFreq = num(header, 'RCMAXFQ');

  if (rcMinFreq !== undefined && rcMaxFreq !== undefined) {
    lowerFreq = toMHz(rcMinFreq, declaredHz);
    upperFreq = toMHz(rcMaxFreq, declaredHz);
  } else {
    const obsFreq = num(header, 'OBSFREQ');
    const freqGHz = num(header, 'FREQ');
    const centre = obsFreq !== undefined
      ? toMHz(obsFreq, declaredHz)
      : (freqGHz !== undefined ? freqGHz * 1000 : undefined);

    if (centre !== undefined) {
      const bandwidth = num(header, 'BANDWID');
      // Without BANDWID the band width is simply not in the file; treat it as
      // zero-width rather than inventing one.
      const halfBand = bandwidth !== undefined ? toMHz(bandwidth, declaredHz) / 2 : 0;
      lowerFreq = centre - halfBand;
      upperFreq = centre + halfBand;
    }
  }

  if (lowerFreq === undefined || upperFreq === undefined) {
    throw new Error('Missing frequency information (RCMINFQ/RCMAXFQ, or OBSFREQ).');
  }

  return {
    naxis1,
    naxis2,
    bitpix,
    bscale: num(header, 'BSCALE') ?? 1,
    bzero: num(header, 'BZERO') ?? 0,
    coordSystem: parseCoordSystem(header),
    projection: parseProjection(str(header, 'CTYPE1')),
    centerLon,
    centerLat,
    lowerFreq,
    upperFreq,
    targetFreq: (lowerFreq + upperFreq) / 2,
    beamWidth: num(header, 'BEAM') ?? 0,
    wcs,
  };
}
