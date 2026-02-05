import { Component, OnInit } from '@angular/core';
import {
  ColorThemeSettings,
  DefaultAppearanceSettings,
  MyChartType,
  MyColorTheme,
  MyFontFamily,
  MyFontSize,
  MyFontStyle
} from "./service/appearance.utils";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AppearanceService } from "./service/appearance.service";

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent implements OnInit {

  protected readonly ColorThemesList: MyColorTheme[] = ColorThemeSettings.getThemeLists();
  protected readonly FontStylesList: MyFontStyle[] = ColorThemeSettings.getFontStyleLists();
  protected readonly FontSizesList: MyFontSize[] = ColorThemeSettings.getFontSizeLists();
  protected readonly FontList: MyFontFamily[] = ColorThemeSettings.getFontFamilyLists();
  protected readonly ChartTypeList: MyChartType[] = ColorThemeSettings.getChartTypeLists();

  protected formGroup!: FormGroup;

  constructor(private appearanceService: AppearanceService) {
    this.getFormGroup(appearanceService.getColorTheme(),
      appearanceService.getFontFamily(),
      appearanceService.getFontStyle(),
      appearanceService.getFontSize(),
      appearanceService.getChartType());
  }

  ngOnInit(): void {
  }

  protected resetDefault(): void {
    this.appearanceService.setColorTheme(DefaultAppearanceSettings.theme);
    this.appearanceService.setFontStyle(DefaultAppearanceSettings.fontStyle);
    this.appearanceService.setFontSize(DefaultAppearanceSettings.fontSize);
    this.appearanceService.setFontFamily(DefaultAppearanceSettings.fontFamily);
    this.appearanceService.setChartType(DefaultAppearanceSettings.chartType);
    this.getFormGroup(DefaultAppearanceSettings.theme,
      DefaultAppearanceSettings.fontFamily,
      DefaultAppearanceSettings.fontStyle,
      DefaultAppearanceSettings.fontSize,
      DefaultAppearanceSettings.chartType);
  }

  private getFormGroup(colorTheme: string,
    fontFamily: string,
    fontStyle: string,
    fontSize: string,
    chartType: string): void {
    this.formGroup = new FormGroup({
      colorTheme: new FormControl(colorTheme, [Validators.required]),
      fontFamily: new FormControl(fontFamily, [Validators.required]),
      fontStyle: new FormControl(fontStyle, [Validators.required],
      ),
      fontSize: new FormControl(fontSize, [Validators.required]),
      chartType: new FormControl(chartType, [Validators.required])
    });
    this.formGroup.get("colorTheme")?.valueChanges.subscribe(value => {
      this.appearanceService.setColorTheme(value);
    });
    this.formGroup.get("fontFamily")?.valueChanges.subscribe(value => {
      this.appearanceService.setFontFamily(value);
    });
    this.formGroup.get("fontStyle")?.valueChanges.subscribe(value => {
      this.appearanceService.setFontStyle(value);
    });
    this.formGroup.get("fontSize")?.valueChanges.subscribe(value => {
      this.appearanceService.setFontSize(value);
    });
    this.formGroup.get("chartType")?.valueChanges.subscribe(value => {
      this.appearanceService.setChartType(value);
    });
  }
}
