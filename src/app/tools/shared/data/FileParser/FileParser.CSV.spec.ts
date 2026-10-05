import {MyFileParserCSV} from "./FileParser.CSV";

describe('MyFileParserCSV', () => {
  const parser = new MyFileParserCSV();

  it('should split quoted values containing commas', () => {
    expect(MyFileParserCSV.splitLine('a, "b, c" ,"d ""e"""'))
      .toEqual(['a', 'b, c', 'd "e"']);
  });

  it('should find plain keys', () => {
    expect(parser.getFieldsIndices('id,mjd,mag\n', ['mag', 'id']))
      .toEqual({mag: 2, id: 0});
  });

  it('should fail when a required key is missing', () => {
    expect(parser.getFieldsIndices('id,mjd\n', ['id', 'mag'])).toBeUndefined();
  });

  it('should resolve the first alias present', () => {
    expect(parser.getFieldsIndices('id,source_id\n', [['source_id', 'id']]))
      .toEqual({source_id: 1});
    expect(parser.getFieldsIndices('x,id\n', [['source_id', 'id']]))
      .toEqual({id: 1});
  });

  it('should skip missing optional keys', () => {
    expect(parser.getFieldsIndices('id,excluded\n', ['id'], ['excluded'])).toEqual({id: 0, excluded: 1});
    expect(parser.getFieldsIndices('id\n', ['id'], ['excluded'])).toEqual({id: 0});
  });

  it('should read rows, skipping blank lines and CRLF', () => {
    const text = 'id,name,mag\r\n1,"a, b",10.5\r\n\r\n2,c,11\r\n';
    const indices = parser.getFieldsIndices(text, ['id', 'mag'])!;
    expect(parser.getData(text, Object.keys(indices), indices))
      .toEqual([{id: '1', mag: '10.5'}, {id: '2', mag: '11'}]);
  });
});
