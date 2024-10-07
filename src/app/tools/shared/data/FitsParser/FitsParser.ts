export class FITSHeaderParser {
  private dataView: DataView;
  private headerSize: number;
  private cardLength: number;
  private header: Record<string, string> = {};

  constructor(private arrayBuffer: ArrayBuffer) {
    this.dataView = new DataView(arrayBuffer);
    this.headerSize = 2880; // FITS headers are multiples of 2880 bytes
    this.cardLength = 80;   // Each card in the FITS header is 80 characters long
  }

  // Method to parse the FITS header
  public parseHeader(): Record<string, string> {
    const header: Record<string, string> = {};
    let offset = 0;

    // Loop through the header cards (80-character blocks)
    while (offset < this.headerSize) {
      const card = this.getAsciiString(offset, this.cardLength);
      offset += this.cardLength;

      // Stop if we encounter the 'END' keyword, which marks the end of the header
      if (card.startsWith('END')) {
        break;
      }

      // Extract the keyword and value
      const keyword = card.slice(0, 8).trim(); // The first 8 characters are the keyword
      const value = card.slice(10).trim();     // The value starts from the 10th character

      if (keyword) {
        header[keyword] = value;
      }
    }

    this.header = header; // Store the header in the instance for later use
    return header;
  }

  // Method to get the data portion of the FITS file
  public getData(): ArrayBuffer {
    if (Object.keys(this.header).length === 0) {
      throw new Error("Header must be parsed before extracting data.");
    }

    // Calculate the number of 2880-byte blocks in the header
    const numHeaderBlocks = Math.ceil(this.headerSize / 2880);

    // Calculate the start position of the data after the header blocks
    const dataStart = numHeaderBlocks * 2880;

    // Calculate the length of the data based on header values
    const bitpix = parseInt(this.header["BITPIX"] || "0", 10); // Bits per pixel
    const naxis = parseInt(this.header["NAXIS"] || "0", 10);   // Number of axes
    let dataLength = 1;

    // Calculate the total length of the data by multiplying the sizes of all axes
    for (let i = 1; i <= naxis; i++) {
      dataLength *= parseInt(this.header[`NAXIS${i}`] || "1", 10);
    }

    // Calculate the total byte length based on BITPIX
    const bytesPerPixel = Math.abs(bitpix) / 8;
    const totalDataLength = dataLength * bytesPerPixel;

    // Extract the data portion from the ArrayBuffer
    return this.arrayBuffer.slice(dataStart, dataStart + totalDataLength);
  }

  // Helper function to convert the DataView bytes to an ASCII string
  private getAsciiString(offset: number, length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += String.fromCharCode(this.dataView.getUint8(offset + i));
    }
    return result;
  }
}
