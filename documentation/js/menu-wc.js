'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">skynet-plotting-neo documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-510a51185584a8be1380895aaa0b1a5e1889f31a64adf458a5cc7ea59d32a406ed542213fe9887fd9420f9a3853448d47f82374b0fa830a239701341608d4034"' : 'data-bs-target="#xs-components-links-module-AppModule-510a51185584a8be1380895aaa0b1a5e1889f31a64adf458a5cc7ea59d32a406ed542213fe9887fd9420f9a3853448d47f82374b0fa830a239701341608d4034"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-510a51185584a8be1380895aaa0b1a5e1889f31a64adf458a5cc7ea59d32a406ed542213fe9887fd9420f9a3853448d47f82374b0fa830a239701341608d4034"' :
                                            'id="xs-components-links-module-AppModule-510a51185584a8be1380895aaa0b1a5e1889f31a64adf458a5cc7ea59d32a406ed542213fe9887fd9420f9a3853448d47f82374b0fa830a239701341608d4034"' }>
                                            <li class="link">
                                                <a href="components/AboutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AboutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppearanceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppearanceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageNotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageNotFoundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-510a51185584a8be1380895aaa0b1a5e1889f31a64adf458a5cc7ea59d32a406ed542213fe9887fd9420f9a3853448d47f82374b0fa830a239701341608d4034"' : 'data-bs-target="#xs-injectables-links-module-AppModule-510a51185584a8be1380895aaa0b1a5e1889f31a64adf458a5cc7ea59d32a406ed542213fe9887fd9420f9a3853448d47f82374b0fa830a239701341608d4034"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-510a51185584a8be1380895aaa0b1a5e1889f31a64adf458a5cc7ea59d32a406ed542213fe9887fd9420f9a3853448d47f82374b0fa830a239701341608d4034"' :
                                        'id="xs-injectables-links-module-AppModule-510a51185584a8be1380895aaa0b1a5e1889f31a64adf458a5cc7ea59d32a406ed542213fe9887fd9420f9a3853448d47f82374b0fa830a239701341608d4034"' }>
                                        <li class="link">
                                            <a href="injectables/AppearanceService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppearanceService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AppearanceStorageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppearanceStorageService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CurveModule.html" data-type="entity-link" >CurveModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-CurveModule-d0e621b5ba20e96d064751e474ef0a0773d89427f30188d7a1523f661c6cf9769310f641f78cd1a4a5de124814fdf24d05f1d4e41b41928936314820216d89ba"' : 'data-bs-target="#xs-components-links-module-CurveModule-d0e621b5ba20e96d064751e474ef0a0773d89427f30188d7a1523f661c6cf9769310f641f78cd1a4a5de124814fdf24d05f1d4e41b41928936314820216d89ba"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CurveModule-d0e621b5ba20e96d064751e474ef0a0773d89427f30188d7a1523f661c6cf9769310f641f78cd1a4a5de124814fdf24d05f1d4e41b41928936314820216d89ba"' :
                                            'id="xs-components-links-module-CurveModule-d0e621b5ba20e96d064751e474ef0a0773d89427f30188d7a1523f661c6cf9769310f641f78cd1a4a5de124814fdf24d05f1d4e41b41928936314820216d89ba"' }>
                                            <li class="link">
                                                <a href="components/CurveChartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CurveChartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CurveChartFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CurveChartFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CurveComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CurveComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CurveHighChartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CurveHighChartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CurveTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CurveTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LineFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LineFormComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CurveModule-d0e621b5ba20e96d064751e474ef0a0773d89427f30188d7a1523f661c6cf9769310f641f78cd1a4a5de124814fdf24d05f1d4e41b41928936314820216d89ba"' : 'data-bs-target="#xs-injectables-links-module-CurveModule-d0e621b5ba20e96d064751e474ef0a0773d89427f30188d7a1523f661c6cf9769310f641f78cd1a4a5de124814fdf24d05f1d4e41b41928936314820216d89ba"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CurveModule-d0e621b5ba20e96d064751e474ef0a0773d89427f30188d7a1523f661c6cf9769310f641f78cd1a4a5de124814fdf24d05f1d4e41b41928936314820216d89ba"' :
                                        'id="xs-injectables-links-module-CurveModule-d0e621b5ba20e96d064751e474ef0a0773d89427f30188d7a1523f661c6cf9769310f641f78cd1a4a5de124814fdf24d05f1d4e41b41928936314820216d89ba"' }>
                                        <li class="link">
                                            <a href="injectables/CurveService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CurveService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HonorCodePopupModule.html" data-type="entity-link" >HonorCodePopupModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-HonorCodePopupModule-559811edb22763186c443da0186e9781dffa2a8ded0754520e6e35d98568f11c18fbd6bb45db1ff2d31cc72a7856b0e442754e1b0e24ba04e23b152691485fcd"' : 'data-bs-target="#xs-components-links-module-HonorCodePopupModule-559811edb22763186c443da0186e9781dffa2a8ded0754520e6e35d98568f11c18fbd6bb45db1ff2d31cc72a7856b0e442754e1b0e24ba04e23b152691485fcd"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HonorCodePopupModule-559811edb22763186c443da0186e9781dffa2a8ded0754520e6e35d98568f11c18fbd6bb45db1ff2d31cc72a7856b0e442754e1b0e24ba04e23b152691485fcd"' :
                                            'id="xs-components-links-module-HonorCodePopupModule-559811edb22763186c443da0186e9781dffa2a8ded0754520e6e35d98568f11c18fbd6bb45db1ff2d31cc72a7856b0e442754e1b0e24ba04e23b152691485fcd"' }>
                                            <li class="link">
                                                <a href="components/HonorCodePopupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HonorCodePopupComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MenubarModule.html" data-type="entity-link" >MenubarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-MenubarModule-bff4feaa5435a126e89b2966495ca1732bd03a0425154ad0143f6293016b70fd28fd9f73a698aea00858a5070ade68c8af551ae7a312fa664f6e6c35e8b9015a"' : 'data-bs-target="#xs-components-links-module-MenubarModule-bff4feaa5435a126e89b2966495ca1732bd03a0425154ad0143f6293016b70fd28fd9f73a698aea00858a5070ade68c8af551ae7a312fa664f6e6c35e8b9015a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MenubarModule-bff4feaa5435a126e89b2966495ca1732bd03a0425154ad0143f6293016b70fd28fd9f73a698aea00858a5070ade68c8af551ae7a312fa664f6e6c35e8b9015a"' :
                                            'id="xs-components-links-module-MenubarModule-bff4feaa5435a126e89b2966495ca1732bd03a0425154ad0143f6293016b70fd28fd9f73a698aea00858a5070ade68c8af551ae7a312fa664f6e6c35e8b9015a"' }>
                                            <li class="link">
                                                <a href="components/MenubarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MenubarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SettingsModule.html" data-type="entity-link" >SettingsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SettingsModule-014c60c9cd81dd427bf346ad7bc1bca5512a6380f591f29c6f25c335dc313b2928e0468e8041ee62b81bebf0df7604594ccfe8fedb5d00e15d2983f59faec1c1"' : 'data-bs-target="#xs-components-links-module-SettingsModule-014c60c9cd81dd427bf346ad7bc1bca5512a6380f591f29c6f25c335dc313b2928e0468e8041ee62b81bebf0df7604594ccfe8fedb5d00e15d2983f59faec1c1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SettingsModule-014c60c9cd81dd427bf346ad7bc1bca5512a6380f591f29c6f25c335dc313b2928e0468e8041ee62b81bebf0df7604594ccfe8fedb5d00e15d2983f59faec1c1"' :
                                            'id="xs-components-links-module-SettingsModule-014c60c9cd81dd427bf346ad7bc1bca5512a6380f591f29c6f25c335dc313b2928e0468e8041ee62b81bebf0df7604594ccfe8fedb5d00e15d2983f59faec1c1"' }>
                                            <li class="link">
                                                <a href="components/SettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SimpleDataButtonModule.html" data-type="entity-link" >SimpleDataButtonModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SimpleDataButtonModule-dda4594f337cc8016b1a63bb5447674328aba59b86cf7129a8f6e6b0c6f501ff65b36867a240a9389a603e159de493830599220871e8914e7252867374631815"' : 'data-bs-target="#xs-components-links-module-SimpleDataButtonModule-dda4594f337cc8016b1a63bb5447674328aba59b86cf7129a8f6e6b0c6f501ff65b36867a240a9389a603e159de493830599220871e8914e7252867374631815"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SimpleDataButtonModule-dda4594f337cc8016b1a63bb5447674328aba59b86cf7129a8f6e6b0c6f501ff65b36867a240a9389a603e159de493830599220871e8914e7252867374631815"' :
                                            'id="xs-components-links-module-SimpleDataButtonModule-dda4594f337cc8016b1a63bb5447674328aba59b86cf7129a8f6e6b0c6f501ff65b36867a240a9389a603e159de493830599220871e8914e7252867374631815"' }>
                                            <li class="link">
                                                <a href="components/SimpleDataButtonComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SimpleDataButtonComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SimpleGraphButtonModule.html" data-type="entity-link" >SimpleGraphButtonModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SimpleGraphButtonModule-5fddc2764dbd8ab54b5759d6777e0fc9e5a0887093fc1d91a64d8e9e869cf7ba9a305da188076467ec35358faa908a52599c2a7edfc989ad7cb3223580e798fa"' : 'data-bs-target="#xs-components-links-module-SimpleGraphButtonModule-5fddc2764dbd8ab54b5759d6777e0fc9e5a0887093fc1d91a64d8e9e869cf7ba9a305da188076467ec35358faa908a52599c2a7edfc989ad7cb3223580e798fa"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SimpleGraphButtonModule-5fddc2764dbd8ab54b5759d6777e0fc9e5a0887093fc1d91a64d8e9e869cf7ba9a305da188076467ec35358faa908a52599c2a7edfc989ad7cb3223580e798fa"' :
                                            'id="xs-components-links-module-SimpleGraphButtonModule-5fddc2764dbd8ab54b5759d6777e0fc9e5a0887093fc1d91a64d8e9e869cf7ba9a305da188076467ec35358faa908a52599c2a7edfc989ad7cb3223580e798fa"' }>
                                            <li class="link">
                                                <a href="components/SimpleGraphButtonComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SimpleGraphButtonComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ToolsNavbarModule.html" data-type="entity-link" >ToolsNavbarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ToolsNavbarModule-f3583d5d7f14939ca09de2cd2d4a67b8068882bb324c6d50d35ea747b91cb5a4804c61a676cfd464ffac600381fe133a6525d18eccaf073f432c5c57dc938dd2"' : 'data-bs-target="#xs-components-links-module-ToolsNavbarModule-f3583d5d7f14939ca09de2cd2d4a67b8068882bb324c6d50d35ea747b91cb5a4804c61a676cfd464ffac600381fe133a6525d18eccaf073f432c5c57dc938dd2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ToolsNavbarModule-f3583d5d7f14939ca09de2cd2d4a67b8068882bb324c6d50d35ea747b91cb5a4804c61a676cfd464ffac600381fe133a6525d18eccaf073f432c5c57dc938dd2"' :
                                            'id="xs-components-links-module-ToolsNavbarModule-f3583d5d7f14939ca09de2cd2d4a67b8068882bb324c6d50d35ea747b91cb5a4804c61a676cfd464ffac600381fe133a6525d18eccaf073f432c5c57dc938dd2"' }>
                                            <li class="link">
                                                <a href="components/ToolsNavbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToolsNavbarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ChartColor.html" data-type="entity-link" >ChartColor</a>
                            </li>
                            <li class="link">
                                <a href="classes/ColorThemeSettings.html" data-type="entity-link" >ColorThemeSettings</a>
                            </li>
                            <li class="link">
                                <a href="classes/CurveChart.html" data-type="entity-link" >CurveChart</a>
                            </li>
                            <li class="link">
                                <a href="classes/CurveChartInfo.html" data-type="entity-link" >CurveChartInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/CurveData.html" data-type="entity-link" >CurveData</a>
                            </li>
                            <li class="link">
                                <a href="classes/CurveImpl.html" data-type="entity-link" >CurveImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/CurveStorage.html" data-type="entity-link" >CurveStorage</a>
                            </li>
                            <li class="link">
                                <a href="classes/CurveTable.html" data-type="entity-link" >CurveTable</a>
                            </li>
                            <li class="link">
                                <a href="classes/DefaultAppearanceSettings.html" data-type="entity-link" >DefaultAppearanceSettings</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/HonorCodeChartService.html" data-type="entity-link" >HonorCodeChartService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HonorCodePopupService.html" data-type="entity-link" >HonorCodePopupService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ChartInfo.html" data-type="entity-link" >ChartInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CurveChartInfoStorageObject.html" data-type="entity-link" >CurveChartInfoStorageObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CurveDataDict.html" data-type="entity-link" >CurveDataDict</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CurveInterface.html" data-type="entity-link" >CurveInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CurveInterfaceStorageObject.html" data-type="entity-link" >CurveInterfaceStorageObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MyChart.html" data-type="entity-link" >MyChart</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MyColorTheme.html" data-type="entity-link" >MyColorTheme</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MyData.html" data-type="entity-link" >MyData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MyFontFamily.html" data-type="entity-link" >MyFontFamily</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MyFontSize.html" data-type="entity-link" >MyFontSize</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MyFontStyle.html" data-type="entity-link" >MyFontStyle</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MyStorage.html" data-type="entity-link" >MyStorage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MyTable.html" data-type="entity-link" >MyTable</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});