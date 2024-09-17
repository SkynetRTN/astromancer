export class FITSHeaderParser {
    private dataView: DataView;
    private headerSize: number;
    private cardLength: number;
  
    constructor(arrayBuffer: ArrayBuffer) {
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
  
      return header;
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
  