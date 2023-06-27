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
                                            'data-bs-target="#components-links-module-CurveModule-024eace1333d50af470454238318784e895deb60c02effbb5ecac9d882618bd88ae6f5feb1d537104b6d5e616cef3a2680b252b6f8545372c0140dc8f30a635a"' : 'data-bs-target="#xs-components-links-module-CurveModule-024eace1333d50af470454238318784e895deb60c02effbb5ecac9d882618bd88ae6f5feb1d537104b6d5e616cef3a2680b252b6f8545372c0140dc8f30a635a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CurveModule-024eace1333d50af470454238318784e895deb60c02effbb5ecac9d882618bd88ae6f5feb1d537104b6d5e616cef3a2680b252b6f8545372c0140dc8f30a635a"' :
                                            'id="xs-components-links-module-CurveModule-024eace1333d50af470454238318784e895deb60c02effbb5ecac9d882618bd88ae6f5feb1d537104b6d5e616cef3a2680b252b6f8545372c0140dc8f30a635a"' }>
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
                                        'data-bs-target="#injectables-links-module-CurveModule-024eace1333d50af470454238318784e895deb60c02effbb5ecac9d882618bd88ae6f5feb1d537104b6d5e616cef3a2680b252b6f8545372c0140dc8f30a635a"' : 'data-bs-target="#xs-injectables-links-module-CurveModule-024eace1333d50af470454238318784e895deb60c02effbb5ecac9d882618bd88ae6f5feb1d537104b6d5e616cef3a2680b252b6f8545372c0140dc8f30a635a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CurveModule-024eace1333d50af470454238318784e895deb60c02effbb5ecac9d882618bd88ae6f5feb1d537104b6d5e616cef3a2680b252b6f8545372c0140dc8f30a635a"' :
                                        'id="xs-injectables-links-module-CurveModule-024eace1333d50af470454238318784e895deb60c02effbb5ecac9d882618bd88ae6f5feb1d537104b6d5e616cef3a2680b252b6f8545372c0140dc8f30a635a"' }>
                                        <li class="link">
                                            <a href="injectables/CurveService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CurveService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/HonorCodePopupService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HonorCodePopupService</a>
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
                                <a href="modules/InterfaceUtilModule.html" data-type="entity-link" >InterfaceUtilModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-InterfaceUtilModule-1fee4bff69b17cfe8fed9a8f2c0a771844b4e6febab73004455015b2b320063171a87c94272baa57f4e787828de8ce9988fd8f115c3cfe54be019be78ac137af"' : 'data-bs-target="#xs-components-links-module-InterfaceUtilModule-1fee4bff69b17cfe8fed9a8f2c0a771844b4e6febab73004455015b2b320063171a87c94272baa57f4e787828de8ce9988fd8f115c3cfe54be019be78ac137af"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-InterfaceUtilModule-1fee4bff69b17cfe8fed9a8f2c0a771844b4e6febab73004455015b2b320063171a87c94272baa57f4e787828de8ce9988fd8f115c3cfe54be019be78ac137af"' :
                                            'id="xs-components-links-module-InterfaceUtilModule-1fee4bff69b17cfe8fed9a8f2c0a771844b4e6febab73004455015b2b320063171a87c94272baa57f4e787828de8ce9988fd8f115c3cfe54be019be78ac137af"' }>
                                            <li class="link">
                                                <a href="components/InputSliderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InputSliderComponent</a>
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
                                <a href="modules/MoonModule.html" data-type="entity-link" >MoonModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-MoonModule-a007dc1d522c397191c90e199aa96fb2e0c999086c45a9d931dfaf604b68b3a1ff030e1ec0a4163df479dbf7b0b0d00bda7add9223294ecd5f38d8a7fb0dceef"' : 'data-bs-target="#xs-components-links-module-MoonModule-a007dc1d522c397191c90e199aa96fb2e0c999086c45a9d931dfaf604b68b3a1ff030e1ec0a4163df479dbf7b0b0d00bda7add9223294ecd5f38d8a7fb0dceef"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MoonModule-a007dc1d522c397191c90e199aa96fb2e0c999086c45a9d931dfaf604b68b3a1ff030e1ec0a4163df479dbf7b0b0d00bda7add9223294ecd5f38d8a7fb0dceef"' :
                                            'id="xs-components-links-module-MoonModule-a007dc1d522c397191c90e199aa96fb2e0c999086c45a9d931dfaf604b68b3a1ff030e1ec0a4163df479dbf7b0b0d00bda7add9223294ecd5f38d8a7fb0dceef"' }>
                                            <li class="link">
                                                <a href="components/MoonChartFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MoonChartFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MoonComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MoonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MoonFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MoonFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MoonHighchartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MoonHighchartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MoonTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MoonTableComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MoonModule-a007dc1d522c397191c90e199aa96fb2e0c999086c45a9d931dfaf604b68b3a1ff030e1ec0a4163df479dbf7b0b0d00bda7add9223294ecd5f38d8a7fb0dceef"' : 'data-bs-target="#xs-injectables-links-module-MoonModule-a007dc1d522c397191c90e199aa96fb2e0c999086c45a9d931dfaf604b68b3a1ff030e1ec0a4163df479dbf7b0b0d00bda7add9223294ecd5f38d8a7fb0dceef"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MoonModule-a007dc1d522c397191c90e199aa96fb2e0c999086c45a9d931dfaf604b68b3a1ff030e1ec0a4163df479dbf7b0b0d00bda7add9223294ecd5f38d8a7fb0dceef"' :
                                        'id="xs-injectables-links-module-MoonModule-a007dc1d522c397191c90e199aa96fb2e0c999086c45a9d931dfaf604b68b3a1ff030e1ec0a4163df479dbf7b0b0d00bda7add9223294ecd5f38d8a7fb0dceef"' }>
                                        <li class="link">
                                            <a href="injectables/HonorCodePopupService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HonorCodePopupService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MoonService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MoonService</a>
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
                                            'data-bs-target="#components-links-module-SimpleDataButtonModule-02b276d7965af22632e0c4fbf50dc09575d03d9a3f92f1458a617a6ef293deb3ecfb16ef42ae0e65a43ccbd39e9fa7d42dc7be9a49ae96c7cebefbefdb67f7c6"' : 'data-bs-target="#xs-components-links-module-SimpleDataButtonModule-02b276d7965af22632e0c4fbf50dc09575d03d9a3f92f1458a617a6ef293deb3ecfb16ef42ae0e65a43ccbd39e9fa7d42dc7be9a49ae96c7cebefbefdb67f7c6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SimpleDataButtonModule-02b276d7965af22632e0c4fbf50dc09575d03d9a3f92f1458a617a6ef293deb3ecfb16ef42ae0e65a43ccbd39e9fa7d42dc7be9a49ae96c7cebefbefdb67f7c6"' :
                                            'id="xs-components-links-module-SimpleDataButtonModule-02b276d7965af22632e0c4fbf50dc09575d03d9a3f92f1458a617a6ef293deb3ecfb16ef42ae0e65a43ccbd39e9fa7d42dc7be9a49ae96c7cebefbefdb67f7c6"' }>
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
                                            'data-bs-target="#components-links-module-ToolsNavbarModule-86e2f3a9c071c4a32efe8a7c70687176713e1de9212ed2b1705e87d62af6999da638734c526c6dc93f1796159db2a106222b47a116aa300bfd36420af7327168"' : 'data-bs-target="#xs-components-links-module-ToolsNavbarModule-86e2f3a9c071c4a32efe8a7c70687176713e1de9212ed2b1705e87d62af6999da638734c526c6dc93f1796159db2a106222b47a116aa300bfd36420af7327168"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ToolsNavbarModule-86e2f3a9c071c4a32efe8a7c70687176713e1de9212ed2b1705e87d62af6999da638734c526c6dc93f1796159db2a106222b47a116aa300bfd36420af7327168"' :
                                            'id="xs-components-links-module-ToolsNavbarModule-86e2f3a9c071c4a32efe8a7c70687176713e1de9212ed2b1705e87d62af6999da638734c526c6dc93f1796159db2a106222b47a116aa300bfd36420af7327168"' }>
                                            <li class="link">
                                                <a href="components/ToolsNavbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToolsNavbarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VenusModule.html" data-type="entity-link" >VenusModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VenusModule-c4851535311850b75fc710ad96e54731fb69b2a755a39e2fa3bfb1cae75eb3d3a0797fd0dc6c9b72108d8954f8dfe401b05a1881c528f69e15e992afccf7c83c"' : 'data-bs-target="#xs-components-links-module-VenusModule-c4851535311850b75fc710ad96e54731fb69b2a755a39e2fa3bfb1cae75eb3d3a0797fd0dc6c9b72108d8954f8dfe401b05a1881c528f69e15e992afccf7c83c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VenusModule-c4851535311850b75fc710ad96e54731fb69b2a755a39e2fa3bfb1cae75eb3d3a0797fd0dc6c9b72108d8954f8dfe401b05a1881c528f69e15e992afccf7c83c"' :
                                            'id="xs-components-links-module-VenusModule-c4851535311850b75fc710ad96e54731fb69b2a755a39e2fa3bfb1cae75eb3d3a0797fd0dc6c9b72108d8954f8dfe401b05a1881c528f69e15e992afccf7c83c"' }>
                                            <li class="link">
                                                <a href="components/VenusChartFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VenusChartFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VenusComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VenusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VenusHighchartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VenusHighchartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VenusTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VenusTableComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-VenusModule-c4851535311850b75fc710ad96e54731fb69b2a755a39e2fa3bfb1cae75eb3d3a0797fd0dc6c9b72108d8954f8dfe401b05a1881c528f69e15e992afccf7c83c"' : 'data-bs-target="#xs-injectables-links-module-VenusModule-c4851535311850b75fc710ad96e54731fb69b2a755a39e2fa3bfb1cae75eb3d3a0797fd0dc6c9b72108d8954f8dfe401b05a1881c528f69e15e992afccf7c83c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VenusModule-c4851535311850b75fc710ad96e54731fb69b2a755a39e2fa3bfb1cae75eb3d3a0797fd0dc6c9b72108d8954f8dfe401b05a1881c528f69e15e992afccf7c83c"' :
                                        'id="xs-injectables-links-module-VenusModule-c4851535311850b75fc710ad96e54731fb69b2a755a39e2fa3bfb1cae75eb3d3a0797fd0dc6c9b72108d8954f8dfe401b05a1881c528f69e15e992afccf7c83c"' }>
                                        <li class="link">
                                            <a href="injectables/VenusService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VenusService</a>
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
                            <li class="link">
                                <a href="classes/MoonChartInfo.html" data-type="entity-link" >MoonChartInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/MoonData.html" data-type="entity-link" >MoonData</a>
                            </li>
                            <li class="link">
                                <a href="classes/MoonInterfaceImpl.html" data-type="entity-link" >MoonInterfaceImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/MoonStorage.html" data-type="entity-link" >MoonStorage</a>
                            </li>
                            <li class="link">
                                <a href="classes/MoonTable.html" data-type="entity-link" >MoonTable</a>
                            </li>
                            <li class="link">
                                <a href="classes/SliderUtil.html" data-type="entity-link" >SliderUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/VenusChartInfo.html" data-type="entity-link" >VenusChartInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/VenusData.html" data-type="entity-link" >VenusData</a>
                            </li>
                            <li class="link">
                                <a href="classes/VenusModels.html" data-type="entity-link" >VenusModels</a>
                            </li>
                            <li class="link">
                                <a href="classes/VenusStorage.html" data-type="entity-link" >VenusStorage</a>
                            </li>
                            <li class="link">
                                <a href="classes/VenusTable.html" data-type="entity-link" >VenusTable</a>
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
                                <a href="interfaces/InputSliderValue.html" data-type="entity-link" >InputSliderValue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MoonChartInfoStorageObject.html" data-type="entity-link" >MoonChartInfoStorageObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MoonDataDict.html" data-type="entity-link" >MoonDataDict</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MoonInterface.html" data-type="entity-link" >MoonInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MoonInterfaceStorageObject.html" data-type="entity-link" >MoonInterfaceStorageObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MoonModel.html" data-type="entity-link" >MoonModel</a>
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
                            <li class="link">
                                <a href="interfaces/VenusChartInfoStorageObject.html" data-type="entity-link" >VenusChartInfoStorageObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VenusDataDict.html" data-type="entity-link" >VenusDataDict</a>
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