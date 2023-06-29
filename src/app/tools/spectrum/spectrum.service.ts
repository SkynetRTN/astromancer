import {Injectable} from '@angular/core';
import {
  SpectrumData,
  SpectrumDataDict,
  SpectrumInterface,
  SpectrumInterfaceImpl,
  SpectrumOptions,
  SpectrumStorage
} from "./spectrum.service.util";
import {BehaviorSubject} from "rxjs";
import {MyData} from "../shared/data/data.interface";

@Injectable()
export class SpectrumService implements MyData, SpectrumInterface {
  private spectrumData: SpectrumData = new SpectrumData();
  private spectrumInterface: SpectrumInterfaceImpl = new SpectrumInterfaceImpl();

  private spectrumStorage: SpectrumStorage = new SpectrumStorage();

  private dataSubject: BehaviorSubject<SpectrumData> = new BehaviorSubject<SpectrumData>(this.spectrumData);
  public data$ = this.dataSubject.asObservable();
  private interfaceSubject: BehaviorSubject<SpectrumOptions> = new BehaviorSubject<SpectrumOptions>(this.spectrumInterface.getChannel());
  public interface$ = this.interfaceSubject.asObservable();

  constructor() {
    this.spectrumData.setData(this.spectrumStorage.getData());
    this.spectrumInterface.setChannel(this.spectrumStorage.getInterface());
  }

  /** SpectrumInterface Methods **/

  getChannel(): SpectrumOptions {
    return this.spectrumInterface.getChannel();
  }

  setChannel(channel: SpectrumOptions): void {
    this.spectrumInterface.setChannel(channel);
    this.spectrumStorage.saveInterface(this.spectrumInterface.getChannel());
    this.interfaceSubject.next(this.spectrumInterface.getChannel());
  }


  /** MyData Methods**/


  addRow(index: number, amount: number): void {
    this.spectrumData.addRow(index, amount);
    this.spectrumStorage.saveData(this.spectrumData.getData());
    this.dataSubject.next(this.spectrumData);
  }

  getData(): SpectrumDataDict[] {
    return this.spectrumData.getData();
  }

  getDataArray(): number[][][] {
    return this.spectrumData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.spectrumData.removeRow(index, amount);
    this.spectrumStorage.saveData(this.spectrumData.getData());
    this.dataSubject.next(this.spectrumData);
  }

  setData(data: SpectrumDataDict[]): void {
    this.spectrumData.setData(data);
    this.spectrumStorage.saveData(this.spectrumData.getData());
    this.dataSubject.next(this.spectrumData);
  }

  resetData(): void {
    this.spectrumData.setData(SpectrumData.getDefaultData());
    this.spectrumStorage.saveData(this.spectrumData.getData());
    this.dataSubject.next(this.spectrumData);
  }
}
