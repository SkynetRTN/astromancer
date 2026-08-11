import * as fitsjs from 'fitsjs';
import { RadioMapHeader } from './fitsHeader';

/**
 * Primary-HDU pixel reading.
 *
 * Replaces five near-identical nested loops, one per supported BITPIX, that
 * differed only in element width and the DataView accessor used.
 */

type PixelReader = (view: DataView, byteOffset: number) => number;

/**
 * Accessor for one BITPIX value.
 *
 * Note the integer cases byte-swap the result of an already big-endian read.
 * That looks redundant, but every Radio Cartographer map observed is
 * BITPIX = -64, so these branches have never actually run and the original
 * behaviour is preserved verbatim rather than "corrected" blind.
 */
function pixelReader(bitpix: number): PixelReader {
  const swapEndian = fitsjs.astro.FITS.DataUnit.swapEndian;

  switch (bitpix) {
    case 8:
      return (view, offset) => view.getUint8(offset);
    case 16:
      return (view, offset) => swapEndian.I(view.getInt16(offset, false));
    case 32:
      return (view, offset) => swapEndian.J(view.getInt32(offset, false));
    case -32:
      return (view, offset) => view.getFloat32(offset, false);
    case -64:
      return (view, offset) => view.getFloat64(offset, false);
    default:
      throw new Error(`Unsupported BITPIX value: ${bitpix}`);
  }
}

/**
 * Read the primary image and apply BSCALE/BZERO.
 *
 * NaN pixels become 0, matching the original; the renderer separately paints
 * both NaN and exact-zero pixels white, so blanked regions still read as blank.
 */
export function readScaledPixels(
  buffer: ArrayBuffer,
  meta: RadioMapHeader,
  dataOffset: number,
): Float64Array {
  const { naxis1, naxis2, bitpix, bscale, bzero } = meta;

  const bytesPerPixel = Math.abs(bitpix) / 8;
  const rowLength = naxis1 * bytesPerPixel;
  const read = pixelReader(bitpix);

  const view = new DataView(buffer, dataOffset);
  const pixels = new Float64Array(naxis1 * naxis2);

  for (let y = 0; y < naxis2; y++) {
    const rowOffset = y * rowLength;
    const rowStart = y * naxis1;
    for (let x = 0; x < naxis1; x++) {
      const raw = read(view, rowOffset + x * bytesPerPixel);
      pixels[rowStart + x] = isNaN(raw) ? 0 : bscale * raw + bzero;
    }
  }

  return pixels;
}
