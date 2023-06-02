import {Component, OnInit} from '@angular/core';
import {
  ColorThemeSettings,
  DefaultAppearanceSettings,
  MyColorTheme,
  MyFontSize,
  MyFontStyle
} from "./service/appearance.utils";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppearanceService} from "./service/appearance.service";

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent implements OnInit {

  protected readonly ColorThemesList: MyColorTheme[] = ColorThemeSettings.getThemeLists();
  protected readonly FontStylesList: MyFontStyle[] = ColorThemeSettings.getFontStyleLists();
  protected readonly FontSizesList: MyFontSize[] = ColorThemeSettings.getFontSizeLists();

  protected formGroup!: FormGroup;

  constructor(private appearanceService: AppearanceService) {
    this.getFormGroup(appearanceService.getColorTheme(),
      appearanceService.getFontStyle(),
      appearanceService.getFontSize());
  }

  ngOnInit(): void {
  }

  protected resetDefault(): void {
    this.appearanceService.setColorTheme(DefaultAppearanceSettings.theme);
    this.appearanceService.setFontStyle(DefaultAppearanceSettings.fontStyle);
    this.appearanceService.setFontSize(DefaultAppearanceSettings.fontSize);
    this.getFormGroup(DefaultAppearanceSettings.theme,
      DefaultAppearanceSettings.fontStyle,
      DefaultAppearanceSettings.fontSize);
  }

  private getFormGroup(colorTheme: string,
                       fontStyle: string,
                       fontSize: string): void {
    this.formGroup = new FormGroup({
      colorTheme: new FormControl(colorTheme, [Validators.required]),
      fontStyle: new FormControl(fontStyle, [Validators.required],
      ),
      fontSize: new FormControl(fontSize, [Validators.required])
    });
    this.formGroup.get("colorTheme")?.valueChanges.subscribe(value => {
      this.appearanceService.setColorTheme(value);
    });
    this.formGroup.get("fontStyle")?.valueChanges.subscribe(value => {
      this.appearanceService.setFontStyle(value);
    });
    this.formGroup.get("fontSize")?.valueChanges.subscribe(value => {
      this.appearanceService.setFontSize(value);
    });
  }
}
