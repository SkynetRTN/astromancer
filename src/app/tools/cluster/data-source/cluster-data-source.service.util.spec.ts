import {MyFileParserCSV} from "../../shared/data/FileParser/FileParser.CSV";
import {
  CLUSTER_CSV_DATA_KEYS,
  CLUSTER_CSV_OPTIONAL_DATA_KEYS,
  ClusterRawData,
  toClusterRawData,
  toClusterSources
} from "./cluster-data-source.service.util";

function parse(text: string): ClusterRawData[] {
  const parser = new MyFileParserCSV();
  const indices = parser.getFieldsIndices(text, CLUSTER_CSV_DATA_KEYS, CLUSTER_CSV_OPTIONAL_DATA_KEYS)!;
  expect(indices).toBeDefined();
  return parser.getData(text, Object.keys(indices), indices)!
    .map(toClusterRawData)
    .filter((entry): entry is ClusterRawData => entry !== null);
}

describe('ClusterDataSourceServiceUtil', () => {
  const legacyCsv = [
    'id,filter,calibrated_mag,mag_error,ra_hours,dec_degs',
    's1,V,12.0,0.01,1.0,10.0',
    's1,B,12.5,0.02,1.2,10.2',
    's2,V,13.0,0.03,2.0,20.0',
    's3,X,14.0,0.04,3.0,30.0',
    '',
  ].join('\n');

  const afterglowCsv = [
    'source_id,source_name,source_kind,source_plane_id,file_asset_id,pixel_x,pixel_y,sky_ra,sky_dec,'
    + 'observation_time,centroid_method,flux,flux_error,instrumental_mag,instrumental_mag_error,snr,background,'
    + 'profile_hash,measured_at,observation_id,filter,zero_point,zero_point_error,calibrated_mag,'
    + 'calibrated_mag_error,excluded',
    's1,"Star, one",star,p,f,1,2,15.0,10.0,t,c,1,1,1,1,1,1,h,m,o,V,25,0.1,12.0,0.01,false',
    's1,"Star, one",star,p,f,1,2,18.0,10.2,t,c,1,1,1,1,1,1,h,m,o,B,25,0.1,12.5,0.02,False',
    's2,Star two,star,p,f,1,2,30.0,20.0,t,c,1,1,1,1,1,1,h,m,o,V,25,0.1,13.0,0.03,',
    's2,Star two,star,p,f,1,2,99.0,99.0,t,c,1,1,1,1,1,1,h,m,o,R,25,0.1,9.0,0.03,true',
    's3,Star three,star,p,f,1,2,45.0,30.0,t,c,1,1,1,1,1,1,h,m,o,X,25,0.1,14.0,0.04,0',
  ].join('\n');

  it('should read legacy and Afterglow 2 files into the same sources', () => {
    const legacy = toClusterSources(parse(legacyCsv));
    const afterglow = toClusterSources(parse(afterglowCsv));
    expect(afterglow).toEqual(legacy);
    expect(legacy.filters).toEqual(['V', 'B'] as any);
    expect(legacy.sources.map(source => source.id)).toEqual(['s1', 's2']);
    expect(legacy.sources[0].astrometry.ra).toBeCloseTo(16.5);
    expect(legacy.sources[0].astrometry.dec).toBeCloseTo(10.1);
  });

  it('should drop excluded rows', () => {
    expect(toClusterRawData({source_id: 's', filter: 'V', calibrated_mag: '1', calibrated_mag_error: '0.1',
      sky_ra: '1', sky_dec: '1', excluded: 'TRUE'})).toBeNull();
    expect(toClusterRawData({source_id: 's', filter: 'V', calibrated_mag: '1', calibrated_mag_error: '0.1',
      sky_ra: '1', sky_dec: '1', excluded: '1'})).toBeNull();
  });

  it('should return no sources for empty data', () => {
    expect(toClusterSources([])).toEqual({sources: [], filters: []});
  });
});
