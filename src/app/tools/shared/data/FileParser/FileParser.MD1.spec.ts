import {MyFileParserMD1} from "./FileParser.MD1";

describe("MyFileParserMD1", () => {
  const parser = new MyFileParserMD1();
  const triplets = (count: number, power: (index: number) => number): string[] =>
    Array.from({length: count}, (_, index) => [
      (100 + index / 99.8).toString(),
      "54",
      power(index).toString(),
    ]).flat();

  it("removes calibration segments and parses the observation triplets", () => {
    const fileText = [
      "1", "54", "1.6",
      "*",
      ...triplets(30, () => 1.4),
      "*",
      "5", "55", "1.6",
      "TELESCOPE: The Mighty Forty",
      "LOCAL START TIME: 05:31:56 PM",
    ].join("\n");
    const fields = ["time", "power"];
    const indices = parser.getFieldsIndices(fileText, fields)!;

    const data = parser.getData(fileText, fields, indices)!;

    expect(data.length).toBe(3);
    data.forEach(row => expect(row.power).toBeCloseTo(1.4, 10));
    expect(data[1].time - data[0].time).toBeCloseTo(10 / 99.8, 10);
  });

  it("enforces positive output power", () => {
    const fileText = [
      ...triplets(10, index => index === 0 ? 0 : 1.5),
    ].join("\n");
    const fields = ["time", "power"];
    const indices = parser.getFieldsIndices(fileText, fields)!;

    const data = parser.getData(fileText, fields, indices)!;

    expect(data.length).toBe(1);
    expect(data[0].power).toBeGreaterThan(0);
  });

  it("low-pass filters at 5 Hz and decimates by ten", () => {
    const sampleCount = 1000;
    const lowFrequencyFile = triplets(sampleCount, index =>
      2 + 0.2 * Math.sin(2 * Math.PI * 2 * index / 99.8)).join("\n");
    const highFrequencyFile = triplets(sampleCount, index =>
      2 + 0.2 * Math.sin(2 * Math.PI * 20 * index / 99.8)).join("\n");
    const fields = ["time", "power"];
    const indices = parser.getFieldsIndices(lowFrequencyFile, fields)!;
    const lowFrequencyData = parser.getData(lowFrequencyFile, fields, indices)!;
    const highFrequencyData = parser.getData(highFrequencyFile, fields, indices)!;
    const range = (data: any[]) => {
      const interior = data.slice(5, -5).map(row => row.power);
      return Math.max(...interior) - Math.min(...interior);
    };

    expect(lowFrequencyData.length).toBe(100);
    expect(range(lowFrequencyData)).toBeGreaterThan(0.3);
    expect(range(highFrequencyData)).toBeLessThan(0.02);
  });

  it("extracts trailing metadata without truncating values containing colons", () => {
    const headers = parser.getHeaders(
      "*\nTELESCOPE: The Mighty Forty\nLOCAL START TIME: 05:31:56 PM",
      [{key: "TELESCOPE", value: "The Mighty Forty"}]
    );

    expect(headers?.["LOCAL START TIME"]).toBe("05:31:56 PM");
  });

  it("rejects incomplete triplets", () => {
    const fields = ["time", "power"];
    const indices = parser.getFieldsIndices("", fields)!;

    expect(parser.getData("12613.2917\n54.7740", fields, indices)).toBeUndefined();
  });

  it("validates the md1 file extension case-insensitively", () => {
    expect(parser.validateFormat(new File([], "observation.MD1"))).toBeTrue();
    expect(parser.validateFormat(new File([], "observation.txt"))).toBeFalse();
  });
});
