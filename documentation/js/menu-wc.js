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
                                <a href="modules/DualModule.html" data-type="entity-link" >DualModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-DualModule-92b339f98518dd39bfce9f0cd91e719477069142ff21bc93a8ef1cd3e265f01dbfc84007b0b8998bed908877e1d5c9176942d8b4660727c93b9388acf0e85e2a"' : 'data-bs-target="#xs-components-links-module-DualModule-92b339f98518dd39bfce9f0cd91e719477069142ff21bc93a8ef1cd3e265f01dbfc84007b0b8998bed908877e1d5c9176942d8b4660727c93b9388acf0e85e2a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DualModule-92b339f98518dd39bfce9f0cd91e719477069142ff21bc93a8ef1cd3e265f01dbfc84007b0b8998bed908877e1d5c9176942d8b4660727c93b9388acf0e85e2a"' :
                                            'id="xs-components-links-module-DualModule-92b339f98518dd39bfce9f0cd91e719477069142ff21bc93a8ef1cd3e265f01dbfc84007b0b8998bed908877e1d5c9176942d8b4660727c93b9388acf0e85e2a"' }>
                                            <li class="link">
                                                <a href="components/DualChartFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DualChartFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DualComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DualComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DualHighchartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DualHighchartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DualTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DualTableComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DualModule-92b339f98518dd39bfce9f0cd91e719477069142ff21bc93a8ef1cd3e265f01dbfc84007b0b8998bed908877e1d5c9176942d8b4660727c93b9388acf0e85e2a"' : 'data-bs-target="#xs-injectables-links-module-DualModule-92b339f98518dd39bfce9f0cd91e719477069142ff21bc93a8ef1cd3e265f01dbfc84007b0b8998bed908877e1d5c9176942d8b4660727c93b9388acf0e85e2a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DualModule-92b339f98518dd39bfce9f0cd91e719477069142ff21bc93a8ef1cd3e265f01dbfc84007b0b8998bed908877e1d5c9176942d8b4660727c93b9388acf0e85e2a"' :
                                        'id="xs-injectables-links-module-DualModule-92b339f98518dd39bfce9f0cd91e719477069142ff21bc93a8ef1cd3e265f01dbfc84007b0b8998bed908877e1d5c9176942d8b4660727c93b9388acf0e85e2a"' }>
                                        <li class="link">
                                            <a href="injectables/DualService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DualService</a>
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
                                <a href="modules/ScatterModule.html" data-type="entity-link" >ScatterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ScatterModule-b3625fa8bf6707937435a6f021caf717ff9b4d7fb07a2a41ccd89af652b19871242666e4ddc1d23cab6daa7353050f41dd4e5ce8be2d996f73aaed6b99eb0592"' : 'data-bs-target="#xs-components-links-module-ScatterModule-b3625fa8bf6707937435a6f021caf717ff9b4d7fb07a2a41ccd89af652b19871242666e4ddc1d23cab6daa7353050f41dd4e5ce8be2d996f73aaed6b99eb0592"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ScatterModule-b3625fa8bf6707937435a6f021caf717ff9b4d7fb07a2a41ccd89af652b19871242666e4ddc1d23cab6daa7353050f41dd4e5ce8be2d996f73aaed6b99eb0592"' :
                                            'id="xs-components-links-module-ScatterModule-b3625fa8bf6707937435a6f021caf717ff9b4d7fb07a2a41ccd89af652b19871242666e4ddc1d23cab6daa7353050f41dd4e5ce8be2d996f73aaed6b99eb0592"' }>
                                            <li class="link">
                                                <a href="components/ScatterChartFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScatterChartFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScatterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScatterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScatterFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScatterFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScatterHighchartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScatterHighchartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScatterTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScatterTableComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ScatterModule-b3625fa8bf6707937435a6f021caf717ff9b4d7fb07a2a41ccd89af652b19871242666e4ddc1d23cab6daa7353050f41dd4e5ce8be2d996f73aaed6b99eb0592"' : 'data-bs-target="#xs-injectables-links-module-ScatterModule-b3625fa8bf6707937435a6f021caf717ff9b4d7fb07a2a41ccd89af652b19871242666e4ddc1d23cab6daa7353050f41dd4e5ce8be2d996f73aaed6b99eb0592"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ScatterModule-b3625fa8bf6707937435a6f021caf717ff9b4d7fb07a2a41ccd89af652b19871242666e4ddc1d23cab6daa7353050f41dd4e5ce8be2d996f73aaed6b99eb0592"' :
                                        'id="xs-injectables-links-module-ScatterModule-b3625fa8bf6707937435a6f021caf717ff9b4d7fb07a2a41ccd89af652b19871242666e4ddc1d23cab6daa7353050f41dd4e5ce8be2d996f73aaed6b99eb0592"' }>
                                        <li class="link">
                                            <a href="injectables/ScatterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScatterService</a>
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
                                            'data-bs-target="#components-links-module-SimpleDataButtonModule-929d350aa9e8b3a97c045c7cb9ca10a5d5a5d657a5ef50fe0ec8280795b785ebba1507cd2944734c8acfdc4b3097b2b0cf58c9162ae15e505b2be64ffbf942ee"' : 'data-bs-target="#xs-components-links-module-SimpleDataButtonModule-929d350aa9e8b3a97c045c7cb9ca10a5d5a5d657a5ef50fe0ec8280795b785ebba1507cd2944734c8acfdc4b3097b2b0cf58c9162ae15e505b2be64ffbf942ee"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SimpleDataButtonModule-929d350aa9e8b3a97c045c7cb9ca10a5d5a5d657a5ef50fe0ec8280795b785ebba1507cd2944734c8acfdc4b3097b2b0cf58c9162ae15e505b2be64ffbf942ee"' :
                                            'id="xs-components-links-module-SimpleDataButtonModule-929d350aa9e8b3a97c045c7cb9ca10a5d5a5d657a5ef50fe0ec8280795b785ebba1507cd2944734c8acfdc4b3097b2b0cf58c9162ae15e505b2be64ffbf942ee"' }>
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
                                <a href="modules/SpectrumModule.html" data-type="entity-link" >SpectrumModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SpectrumModule-a2a4553f6684f720b156a598901fe2caed8623bbd2007cf8991c9633158e95445be2769192ea526de936fc41f7e1624d71ca02c808cfb72e5c8ad2e124e71bf0"' : 'data-bs-target="#xs-components-links-module-SpectrumModule-a2a4553f6684f720b156a598901fe2caed8623bbd2007cf8991c9633158e95445be2769192ea526de936fc41f7e1624d71ca02c808cfb72e5c8ad2e124e71bf0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SpectrumModule-a2a4553f6684f720b156a598901fe2caed8623bbd2007cf8991c9633158e95445be2769192ea526de936fc41f7e1624d71ca02c808cfb72e5c8ad2e124e71bf0"' :
                                            'id="xs-components-links-module-SpectrumModule-a2a4553f6684f720b156a598901fe2caed8623bbd2007cf8991c9633158e95445be2769192ea526de936fc41f7e1624d71ca02c808cfb72e5c8ad2e124e71bf0"' }>
                                            <li class="link">
                                                <a href="components/SpectrumChartFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SpectrumChartFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SpectrumComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SpectrumComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SpectrumFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SpectrumFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SpectrumHighchartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SpectrumHighchartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SpectrumTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SpectrumTableComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SpectrumModule-a2a4553f6684f720b156a598901fe2caed8623bbd2007cf8991c9633158e95445be2769192ea526de936fc41f7e1624d71ca02c808cfb72e5c8ad2e124e71bf0"' : 'data-bs-target="#xs-injectables-links-module-SpectrumModule-a2a4553f6684f720b156a598901fe2caed8623bbd2007cf8991c9633158e95445be2769192ea526de936fc41f7e1624d71ca02c808cfb72e5c8ad2e124e71bf0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SpectrumModule-a2a4553f6684f720b156a598901fe2caed8623bbd2007cf8991c9633158e95445be2769192ea526de936fc41f7e1624d71ca02c808cfb72e5c8ad2e124e71bf0"' :
                                        'id="xs-injectables-links-module-SpectrumModule-a2a4553f6684f720b156a598901fe2caed8623bbd2007cf8991c9633158e95445be2769192ea526de936fc41f7e1624d71ca02c808cfb72e5c8ad2e124e71bf0"' }>
                                        <li class="link">
                                            <a href="injectables/SpectrumService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SpectrumService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ToolsNavbarModule.html" data-type="entity-link" >ToolsNavbarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ToolsNavbarModule-adedb761829d31049a873d9e0d42e739c13c340c45b9bf20cfbf4aca530b27b018b6b6000ffc9f331454765efb1b506c2067eb9f7a210fd63b404aa8172602c5"' : 'data-bs-target="#xs-components-links-module-ToolsNavbarModule-adedb761829d31049a873d9e0d42e739c13c340c45b9bf20cfbf4aca530b27b018b6b6000ffc9f331454765efb1b506c2067eb9f7a210fd63b404aa8172602c5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ToolsNavbarModule-adedb761829d31049a873d9e0d42e739c13c340c45b9bf20cfbf4aca530b27b018b6b6000ffc9f331454765efb1b506c2067eb9f7a210fd63b404aa8172602c5"' :
                                            'id="xs-components-links-module-ToolsNavbarModule-adedb761829d31049a873d9e0d42e739c13c340c45b9bf20cfbf4aca530b27b018b6b6000ffc9f331454765efb1b506c2067eb9f7a210fd63b404aa8172602c5"' }>
                                            <li class="link">
                                                <a href="components/ToolsNavbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToolsNavbarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VariableModule.html" data-type="entity-link" >VariableModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VariableModule-f7fe770a133646b6aa56184ca5a58d04e37df8d08d8bcdeb48faf2ee3992202e05a294677afc3776b9fe11f2b0d59680726ba6b407b39ea124c47282ab2e6da3"' : 'data-bs-target="#xs-components-links-module-VariableModule-f7fe770a133646b6aa56184ca5a58d04e37df8d08d8bcdeb48faf2ee3992202e05a294677afc3776b9fe11f2b0d59680726ba6b407b39ea124c47282ab2e6da3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VariableModule-f7fe770a133646b6aa56184ca5a58d04e37df8d08d8bcdeb48faf2ee3992202e05a294677afc3776b9fe11f2b0d59680726ba6b407b39ea124c47282ab2e6da3"' :
                                            'id="xs-components-links-module-VariableModule-f7fe770a133646b6aa56184ca5a58d04e37df8d08d8bcdeb48faf2ee3992202e05a294677afc3776b9fe11f2b0d59680726ba6b407b39ea124c47282ab2e6da3"' }>
                                            <li class="link">
                                                <a href="components/VariableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VariableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VariableLightCurveChartFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VariableLightCurveChartFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VariableLightCurveComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VariableLightCurveComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VariableLightCurveFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VariableLightCurveFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VariableLightCurveHighchartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VariableLightCurveHighchartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VariablePeriodFoldingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VariablePeriodFoldingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VariablePeriodFoldingFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VariablePeriodFoldingFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VariablePeriodFoldingHighchartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VariablePeriodFoldingHighchartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VariablePeriodogramComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VariablePeriodogramComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VariablePeriodogramFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VariablePeriodogramFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VariablePeriodogramHighchartsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VariablePeriodogramHighchartsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VariableTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VariableTableComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-VariableModule-f7fe770a133646b6aa56184ca5a58d04e37df8d08d8bcdeb48faf2ee3992202e05a294677afc3776b9fe11f2b0d59680726ba6b407b39ea124c47282ab2e6da3"' : 'data-bs-target="#xs-injectables-links-module-VariableModule-f7fe770a133646b6aa56184ca5a58d04e37df8d08d8bcdeb48faf2ee3992202e05a294677afc3776b9fe11f2b0d59680726ba6b407b39ea124c47282ab2e6da3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VariableModule-f7fe770a133646b6aa56184ca5a58d04e37df8d08d8bcdeb48faf2ee3992202e05a294677afc3776b9fe11f2b0d59680726ba6b407b39ea124c47282ab2e6da3"' :
                                        'id="xs-injectables-links-module-VariableModule-f7fe770a133646b6aa56184ca5a58d04e37df8d08d8bcdeb48faf2ee3992202e05a294677afc3776b9fe11f2b0d59680726ba6b407b39ea124c47282ab2e6da3"' }>
                                        <li class="link">
                                            <a href="injectables/VariableService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VariableService</a>
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
                                <a href="classes/DualChartInfo.html" data-type="entity-link" >DualChartInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/DualData.html" data-type="entity-link" >DualData</a>
                            </li>
                            <li class="link">
                                <a href="classes/DualStorage.html" data-type="entity-link" >DualStorage</a>
                            </li>
                            <li class="link">
                                <a href="classes/DualTable.html" data-type="entity-link" >DualTable</a>
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
                                <a href="classes/MyFileParser.html" data-type="entity-link" >MyFileParser</a>
                            </li>
                            <li class="link">
                                <a href="classes/MyFileParserCSV.html" data-type="entity-link" >MyFileParserCSV</a>
                            </li>
                            <li class="link">
                                <a href="classes/MyFileParserDefault.html" data-type="entity-link" >MyFileParserDefault</a>
                            </li>
                            <li class="link">
                                <a href="classes/MyFileParserTXT.html" data-type="entity-link" >MyFileParserTXT</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScatterChartInfo.html" data-type="entity-link" >ScatterChartInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScatterData.html" data-type="entity-link" >ScatterData</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScatterModelInterface.html" data-type="entity-link" >ScatterModelInterface</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScatterStorage.html" data-type="entity-link" >ScatterStorage</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScatterTable.html" data-type="entity-link" >ScatterTable</a>
                            </li>
                            <li class="link">
                                <a href="classes/SliderUtil.html" data-type="entity-link" >SliderUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/SpectrumChartInfo.html" data-type="entity-link" >SpectrumChartInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/SpectrumData.html" data-type="entity-link" >SpectrumData</a>
                            </li>
                            <li class="link">
                                <a href="classes/SpectrumInterfaceImpl.html" data-type="entity-link" >SpectrumInterfaceImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/SpectrumStorage.html" data-type="entity-link" >SpectrumStorage</a>
                            </li>
                            <li class="link">
                                <a href="classes/SpectrumTable.html" data-type="entity-link" >SpectrumTable</a>
                            </li>
                            <li class="link">
                                <a href="classes/VariableChartInfo.html" data-type="entity-link" >VariableChartInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/VariableData.html" data-type="entity-link" >VariableData</a>
                            </li>
                            <li class="link">
                                <a href="classes/VariableInterfaceImpl.html" data-type="entity-link" >VariableInterfaceImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/VariablePeriodFolding.html" data-type="entity-link" >VariablePeriodFolding</a>
                            </li>
                            <li class="link">
                                <a href="classes/VariablePeriodogram.html" data-type="entity-link" >VariablePeriodogram</a>
                            </li>
                            <li class="link">
                                <a href="classes/VariableStorage.html" data-type="entity-link" >VariableStorage</a>
                            </li>
                            <li class="link">
                                <a href="classes/VariableTable.html" data-type="entity-link" >VariableTable</a>
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
                                <a href="interfaces/DualChartInfoStorageObject.html" data-type="entity-link" >DualChartInfoStorageObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DualDataDict.html" data-type="entity-link" >DualDataDict</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HeaderRequirement.html" data-type="entity-link" >HeaderRequirement</a>
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
                                <a href="interfaces/MyFileParserStrategy.html" data-type="entity-link" >MyFileParserStrategy</a>
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
                                <a href="interfaces/ScatterChartInfoStorageObject.html" data-type="entity-link" >ScatterChartInfoStorageObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScatterDataDict.html" data-type="entity-link" >ScatterDataDict</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScatterInterfaceStorageObject.html" data-type="entity-link" >ScatterInterfaceStorageObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScatterModel.html" data-type="entity-link" >ScatterModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SpectrumChartInfoStorageObject.html" data-type="entity-link" >SpectrumChartInfoStorageObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SpectrumDataDict.html" data-type="entity-link" >SpectrumDataDict</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SpectrumInterface.html" data-type="entity-link" >SpectrumInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VariableChartInfoStorageObject.html" data-type="entity-link" >VariableChartInfoStorageObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VariableDataDict.html" data-type="entity-link" >VariableDataDict</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VariableInterface.html" data-type="entity-link" >VariableInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VariableInterfaceStorageObject.html" data-type="entity-link" >VariableInterfaceStorageObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VariablePeriodFoldingInterface.html" data-type="entity-link" >VariablePeriodFoldingInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VariablePeriodFoldingStorageObject.html" data-type="entity-link" >VariablePeriodFoldingStorageObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VariablePeriodogramInterface.html" data-type="entity-link" >VariablePeriodogramInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VariablePeriodogramStorageObject.html" data-type="entity-link" >VariablePeriodogramStorageObject</a>
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