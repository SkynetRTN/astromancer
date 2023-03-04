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
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-890eb6cc8de99151b596b7448d16e29e122716c95c1e9757b46fdbb543ad05204c4c7257fa234e807ca215c4bb14f443ef8ebb60895a1f9f249c7405859a3ec9"' : 'data-target="#xs-components-links-module-AppModule-890eb6cc8de99151b596b7448d16e29e122716c95c1e9757b46fdbb543ad05204c4c7257fa234e807ca215c4bb14f443ef8ebb60895a1f9f249c7405859a3ec9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-890eb6cc8de99151b596b7448d16e29e122716c95c1e9757b46fdbb543ad05204c4c7257fa234e807ca215c4bb14f443ef8ebb60895a1f9f249c7405859a3ec9"' :
                                            'id="xs-components-links-module-AppModule-890eb6cc8de99151b596b7448d16e29e122716c95c1e9757b46fdbb543ad05204c4c7257fa234e807ca215c4bb14f443ef8ebb60895a1f9f249c7405859a3ec9"' }>
                                            <li class="link">
                                                <a href="components/AboutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AboutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageNotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageNotFoundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ChartDirectiveModule.html" data-type="entity-link" >ChartDirectiveModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-ChartDirectiveModule-45361e2103f992741176561b05409b5a89f3f6d6e9fc6139e963b88ad9b6a7facebeea8c693046ca064d9c8d4e7f8e72c3c473970a1fb82fb674528cd989ff78"' : 'data-target="#xs-directives-links-module-ChartDirectiveModule-45361e2103f992741176561b05409b5a89f3f6d6e9fc6139e963b88ad9b6a7facebeea8c693046ca064d9c8d4e7f8e72c3c473970a1fb82fb674528cd989ff78"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-ChartDirectiveModule-45361e2103f992741176561b05409b5a89f3f6d6e9fc6139e963b88ad9b6a7facebeea8c693046ca064d9c8d4e7f8e72c3c473970a1fb82fb674528cd989ff78"' :
                                        'id="xs-directives-links-module-ChartDirectiveModule-45361e2103f992741176561b05409b5a89f3f6d6e9fc6139e963b88ad9b6a7facebeea8c693046ca064d9c8d4e7f8e72c3c473970a1fb82fb674528cd989ff78"' }>
                                        <li class="link">
                                            <a href="directives/ChartDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChartDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CurveChartModule.html" data-type="entity-link" >CurveChartModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CurveChartModule-6080eea65382288a05091269f3692cf4c9e7edeeb1eae9e1a1dc27832ac514e852ae638ccd50637de2196fe8424172bce110c16b62245aec39faefda854b80da"' : 'data-target="#xs-components-links-module-CurveChartModule-6080eea65382288a05091269f3692cf4c9e7edeeb1eae9e1a1dc27832ac514e852ae638ccd50637de2196fe8424172bce110c16b62245aec39faefda854b80da"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CurveChartModule-6080eea65382288a05091269f3692cf4c9e7edeeb1eae9e1a1dc27832ac514e852ae638ccd50637de2196fe8424172bce110c16b62245aec39faefda854b80da"' :
                                            'id="xs-components-links-module-CurveChartModule-6080eea65382288a05091269f3692cf4c9e7edeeb1eae9e1a1dc27832ac514e852ae638ccd50637de2196fe8424172bce110c16b62245aec39faefda854b80da"' }>
                                            <li class="link">
                                                <a href="components/CurveChartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CurveChartComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CurveModule.html" data-type="entity-link" >CurveModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CurveModule-5f535671bf69411b5bc6c52b6cabf83cf87efcc893215bab2043bb6179e9c7effc9bc907bb64ecdb441ebad4f6f7ed4cdb9e972393d695ef59909096580b40eb"' : 'data-target="#xs-components-links-module-CurveModule-5f535671bf69411b5bc6c52b6cabf83cf87efcc893215bab2043bb6179e9c7effc9bc907bb64ecdb441ebad4f6f7ed4cdb9e972393d695ef59909096580b40eb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CurveModule-5f535671bf69411b5bc6c52b6cabf83cf87efcc893215bab2043bb6179e9c7effc9bc907bb64ecdb441ebad4f6f7ed4cdb9e972393d695ef59909096580b40eb"' :
                                            'id="xs-components-links-module-CurveModule-5f535671bf69411b5bc6c52b6cabf83cf87efcc893215bab2043bb6179e9c7effc9bc907bb64ecdb441ebad4f6f7ed4cdb9e972393d695ef59909096580b40eb"' }>
                                            <li class="link">
                                                <a href="components/CurveComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CurveComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DataButtonDirectiveModule.html" data-type="entity-link" >DataButtonDirectiveModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-DataButtonDirectiveModule-d14dedfb37a73cf4e34502a6d5ad9431f2f72ab4e9870d811a2558ee65622172d5c0973fda5656bcc60e7479467eb6bcdd92a47048db47617552000662558001"' : 'data-target="#xs-directives-links-module-DataButtonDirectiveModule-d14dedfb37a73cf4e34502a6d5ad9431f2f72ab4e9870d811a2558ee65622172d5c0973fda5656bcc60e7479467eb6bcdd92a47048db47617552000662558001"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-DataButtonDirectiveModule-d14dedfb37a73cf4e34502a6d5ad9431f2f72ab4e9870d811a2558ee65622172d5c0973fda5656bcc60e7479467eb6bcdd92a47048db47617552000662558001"' :
                                        'id="xs-directives-links-module-DataButtonDirectiveModule-d14dedfb37a73cf4e34502a6d5ad9431f2f72ab4e9870d811a2558ee65622172d5c0973fda5656bcc60e7479467eb6bcdd92a47048db47617552000662558001"' }>
                                        <li class="link">
                                            <a href="directives/DataButtonDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DataButtonDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DataControlDirectiveModule.html" data-type="entity-link" >DataControlDirectiveModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-DataControlDirectiveModule-ebbc6abab8fd0b85a3a0062026015e5cccad533e77cb3889371dd6b3a442932dadedf4c6ee859da8b75bdc34bbbd4cce29af6a49b06e71e34cfcba54666ff769"' : 'data-target="#xs-directives-links-module-DataControlDirectiveModule-ebbc6abab8fd0b85a3a0062026015e5cccad533e77cb3889371dd6b3a442932dadedf4c6ee859da8b75bdc34bbbd4cce29af6a49b06e71e34cfcba54666ff769"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-DataControlDirectiveModule-ebbc6abab8fd0b85a3a0062026015e5cccad533e77cb3889371dd6b3a442932dadedf4c6ee859da8b75bdc34bbbd4cce29af6a49b06e71e34cfcba54666ff769"' :
                                        'id="xs-directives-links-module-DataControlDirectiveModule-ebbc6abab8fd0b85a3a0062026015e5cccad533e77cb3889371dd6b3a442932dadedf4c6ee859da8b75bdc34bbbd4cce29af6a49b06e71e34cfcba54666ff769"' }>
                                        <li class="link">
                                            <a href="directives/DataControlDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DataControlDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DataTableDirectiveModule.html" data-type="entity-link" >DataTableDirectiveModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-DataTableDirectiveModule-ad56651e175218b1681bbc2b8acdb1ceebef1870416cd61ceddad451afa636c55c48fcef4a8aea8d35133a55f84d5a56376e41b5b8f129f179390ec6b4852ccd"' : 'data-target="#xs-directives-links-module-DataTableDirectiveModule-ad56651e175218b1681bbc2b8acdb1ceebef1870416cd61ceddad451afa636c55c48fcef4a8aea8d35133a55f84d5a56376e41b5b8f129f179390ec6b4852ccd"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-DataTableDirectiveModule-ad56651e175218b1681bbc2b8acdb1ceebef1870416cd61ceddad451afa636c55c48fcef4a8aea8d35133a55f84d5a56376e41b5b8f129f179390ec6b4852ccd"' :
                                        'id="xs-directives-links-module-DataTableDirectiveModule-ad56651e175218b1681bbc2b8acdb1ceebef1870416cd61ceddad451afa636c55c48fcef4a8aea8d35133a55f84d5a56376e41b5b8f129f179390ec6b4852ccd"' }>
                                        <li class="link">
                                            <a href="directives/DataTableDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DataTableDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GraphButtonDirectiveModule.html" data-type="entity-link" >GraphButtonDirectiveModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-GraphButtonDirectiveModule-9d643d3e7d3f987edc762dab45ea82a67c7d794108f899d44427eba975a920cb60175ff682a5dc923c790896699d640ab6712a3e20208c92a4a7bac31dff76fb"' : 'data-target="#xs-directives-links-module-GraphButtonDirectiveModule-9d643d3e7d3f987edc762dab45ea82a67c7d794108f899d44427eba975a920cb60175ff682a5dc923c790896699d640ab6712a3e20208c92a4a7bac31dff76fb"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-GraphButtonDirectiveModule-9d643d3e7d3f987edc762dab45ea82a67c7d794108f899d44427eba975a920cb60175ff682a5dc923c790896699d640ab6712a3e20208c92a4a7bac31dff76fb"' :
                                        'id="xs-directives-links-module-GraphButtonDirectiveModule-9d643d3e7d3f987edc762dab45ea82a67c7d794108f899d44427eba975a920cb60175ff682a5dc923c790896699d640ab6712a3e20208c92a4a7bac31dff76fb"' }>
                                        <li class="link">
                                            <a href="directives/GraphButtonDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GraphButtonDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GraphInfoDirectiveModule.html" data-type="entity-link" >GraphInfoDirectiveModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-GraphInfoDirectiveModule-819f424a537f430a7f69774a5295b7fa17d3d7712dad11328d5dc207c8e394567a2883ef943288b13b761d3d6fd168234bbed9cdb4a844f0f378254dc9220d8c"' : 'data-target="#xs-directives-links-module-GraphInfoDirectiveModule-819f424a537f430a7f69774a5295b7fa17d3d7712dad11328d5dc207c8e394567a2883ef943288b13b761d3d6fd168234bbed9cdb4a844f0f378254dc9220d8c"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-GraphInfoDirectiveModule-819f424a537f430a7f69774a5295b7fa17d3d7712dad11328d5dc207c8e394567a2883ef943288b13b761d3d6fd168234bbed9cdb4a844f0f378254dc9220d8c"' :
                                        'id="xs-directives-links-module-GraphInfoDirectiveModule-819f424a537f430a7f69774a5295b7fa17d3d7712dad11328d5dc207c8e394567a2883ef943288b13b761d3d6fd168234bbed9cdb4a844f0f378254dc9220d8c"' }>
                                        <li class="link">
                                            <a href="directives/GraphInfoDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GraphInfoDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HonorCodePopupModule.html" data-type="entity-link" >HonorCodePopupModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HonorCodePopupModule-6062aa5ad8f8e384555b8fb78bc068ef438b34f44aa966c9462f3afe7e9c262dde0ce49286795d0f639251f1aa652d165e17599ea7cf12f205983891832255f1"' : 'data-target="#xs-components-links-module-HonorCodePopupModule-6062aa5ad8f8e384555b8fb78bc068ef438b34f44aa966c9462f3afe7e9c262dde0ce49286795d0f639251f1aa652d165e17599ea7cf12f205983891832255f1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HonorCodePopupModule-6062aa5ad8f8e384555b8fb78bc068ef438b34f44aa966c9462f3afe7e9c262dde0ce49286795d0f639251f1aa652d165e17599ea7cf12f205983891832255f1"' :
                                            'id="xs-components-links-module-HonorCodePopupModule-6062aa5ad8f8e384555b8fb78bc068ef438b34f44aa966c9462f3afe7e9c262dde0ce49286795d0f639251f1aa652d165e17599ea7cf12f205983891832255f1"' }>
                                            <li class="link">
                                                <a href="components/HonorCodePopupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HonorCodePopupComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LineFormModule.html" data-type="entity-link" >LineFormModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LineFormModule-5d7fb3042df766c20c8b667339cf8412980b45b6aa234366a102eded53e126f9b766384052db409b67e36b2ccdb7176b3312aab029b06ff64ca1d3bd1dd669ba"' : 'data-target="#xs-components-links-module-LineFormModule-5d7fb3042df766c20c8b667339cf8412980b45b6aa234366a102eded53e126f9b766384052db409b67e36b2ccdb7176b3312aab029b06ff64ca1d3bd1dd669ba"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LineFormModule-5d7fb3042df766c20c8b667339cf8412980b45b6aa234366a102eded53e126f9b766384052db409b67e36b2ccdb7176b3312aab029b06ff64ca1d3bd1dd669ba"' :
                                            'id="xs-components-links-module-LineFormModule-5d7fb3042df766c20c8b667339cf8412980b45b6aa234366a102eded53e126f9b766384052db409b67e36b2ccdb7176b3312aab029b06ff64ca1d3bd1dd669ba"' }>
                                            <li class="link">
                                                <a href="components/LineFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LineFormComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MenubarModule.html" data-type="entity-link" >MenubarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MenubarModule-576d48f9e164ea50986a00b2bf9b099e5e9d37255f861d438bee878ffbb67f6d438faaf45e708a76c3e7f9f1202467e364d7ddca12019eb956fca1e37366b697"' : 'data-target="#xs-components-links-module-MenubarModule-576d48f9e164ea50986a00b2bf9b099e5e9d37255f861d438bee878ffbb67f6d438faaf45e708a76c3e7f9f1202467e364d7ddca12019eb956fca1e37366b697"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MenubarModule-576d48f9e164ea50986a00b2bf9b099e5e9d37255f861d438bee878ffbb67f6d438faaf45e708a76c3e7f9f1202467e364d7ddca12019eb956fca1e37366b697"' :
                                            'id="xs-components-links-module-MenubarModule-576d48f9e164ea50986a00b2bf9b099e5e9d37255f861d438bee878ffbb67f6d438faaf45e708a76c3e7f9f1202467e364d7ddca12019eb956fca1e37366b697"' }>
                                            <li class="link">
                                                <a href="components/MenubarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MenubarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SimpleDataButtonModule.html" data-type="entity-link" >SimpleDataButtonModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SimpleDataButtonModule-13bd7c55371640b0ddeb2e439fab25a7d2463814510cd1a2b32e79a0d554dfbc13f44ff92a68979b9901177a1dfe5feb9938834dbc521752d5c8f6a311339cf8"' : 'data-target="#xs-components-links-module-SimpleDataButtonModule-13bd7c55371640b0ddeb2e439fab25a7d2463814510cd1a2b32e79a0d554dfbc13f44ff92a68979b9901177a1dfe5feb9938834dbc521752d5c8f6a311339cf8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SimpleDataButtonModule-13bd7c55371640b0ddeb2e439fab25a7d2463814510cd1a2b32e79a0d554dfbc13f44ff92a68979b9901177a1dfe5feb9938834dbc521752d5c8f6a311339cf8"' :
                                            'id="xs-components-links-module-SimpleDataButtonModule-13bd7c55371640b0ddeb2e439fab25a7d2463814510cd1a2b32e79a0d554dfbc13f44ff92a68979b9901177a1dfe5feb9938834dbc521752d5c8f6a311339cf8"' }>
                                            <li class="link">
                                                <a href="components/SimpleDataButtonComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SimpleDataButtonComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SimpleGraphButtonModule.html" data-type="entity-link" >SimpleGraphButtonModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SimpleGraphButtonModule-608bcaafa917100db1a87274f9737de378d604fdd50ec3b2ef3cc73c636a0d7b1ecd1b6de35fe1d8dc322c0f4bd5d1d1f83a920b5bf3cf8b6d0f11a83027af2c"' : 'data-target="#xs-components-links-module-SimpleGraphButtonModule-608bcaafa917100db1a87274f9737de378d604fdd50ec3b2ef3cc73c636a0d7b1ecd1b6de35fe1d8dc322c0f4bd5d1d1f83a920b5bf3cf8b6d0f11a83027af2c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SimpleGraphButtonModule-608bcaafa917100db1a87274f9737de378d604fdd50ec3b2ef3cc73c636a0d7b1ecd1b6de35fe1d8dc322c0f4bd5d1d1f83a920b5bf3cf8b6d0f11a83027af2c"' :
                                            'id="xs-components-links-module-SimpleGraphButtonModule-608bcaafa917100db1a87274f9737de378d604fdd50ec3b2ef3cc73c636a0d7b1ecd1b6de35fe1d8dc322c0f4bd5d1d1f83a920b5bf3cf8b6d0f11a83027af2c"' }>
                                            <li class="link">
                                                <a href="components/SimpleGraphButtonComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SimpleGraphButtonComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SimpleTableImplModule.html" data-type="entity-link" >SimpleTableImplModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SimpleTableImplModule-8dd8541658e15ed44ff72a7169ee0cad2f596620b79f0d64584ff941de66706108d1721ba2842801b25bced116023ffc7f0bcd16bb88ecea6bfb68cf02ea7fbb"' : 'data-target="#xs-components-links-module-SimpleTableImplModule-8dd8541658e15ed44ff72a7169ee0cad2f596620b79f0d64584ff941de66706108d1721ba2842801b25bced116023ffc7f0bcd16bb88ecea6bfb68cf02ea7fbb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SimpleTableImplModule-8dd8541658e15ed44ff72a7169ee0cad2f596620b79f0d64584ff941de66706108d1721ba2842801b25bced116023ffc7f0bcd16bb88ecea6bfb68cf02ea7fbb"' :
                                            'id="xs-components-links-module-SimpleTableImplModule-8dd8541658e15ed44ff72a7169ee0cad2f596620b79f0d64584ff941de66706108d1721ba2842801b25bced116023ffc7f0bcd16bb88ecea6bfb68cf02ea7fbb"' }>
                                            <li class="link">
                                                <a href="components/SimpleTableImplComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SimpleTableImplComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StandardGraphInfoModule.html" data-type="entity-link" >StandardGraphInfoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StandardGraphInfoModule-6c67bc1d00e5919b67491a372499b6aa19c39954cfdb6d1456f80f4aa75fd079f8a39e04f09eb876ecc16ec271ff2eca0f186127bf38bc540d48969c1ef59598"' : 'data-target="#xs-components-links-module-StandardGraphInfoModule-6c67bc1d00e5919b67491a372499b6aa19c39954cfdb6d1456f80f4aa75fd079f8a39e04f09eb876ecc16ec271ff2eca0f186127bf38bc540d48969c1ef59598"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StandardGraphInfoModule-6c67bc1d00e5919b67491a372499b6aa19c39954cfdb6d1456f80f4aa75fd079f8a39e04f09eb876ecc16ec271ff2eca0f186127bf38bc540d48969c1ef59598"' :
                                            'id="xs-components-links-module-StandardGraphInfoModule-6c67bc1d00e5919b67491a372499b6aa19c39954cfdb6d1456f80f4aa75fd079f8a39e04f09eb876ecc16ec271ff2eca0f186127bf38bc540d48969c1ef59598"' }>
                                            <li class="link">
                                                <a href="components/StandardGraphInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StandardGraphInfoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StandardLayoutModule.html" data-type="entity-link" >StandardLayoutModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StandardLayoutModule-d3f90225789dcf0853486e06cbb886f36e666d8648b10709a39d82fcae40e04fdd631b55d3f4c73d5d238c63005e343ebd8e33887c5ee1140fbd4c76b04ebc91"' : 'data-target="#xs-components-links-module-StandardLayoutModule-d3f90225789dcf0853486e06cbb886f36e666d8648b10709a39d82fcae40e04fdd631b55d3f4c73d5d238c63005e343ebd8e33887c5ee1140fbd4c76b04ebc91"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StandardLayoutModule-d3f90225789dcf0853486e06cbb886f36e666d8648b10709a39d82fcae40e04fdd631b55d3f4c73d5d238c63005e343ebd8e33887c5ee1140fbd4c76b04ebc91"' :
                                            'id="xs-components-links-module-StandardLayoutModule-d3f90225789dcf0853486e06cbb886f36e666d8648b10709a39d82fcae40e04fdd631b55d3f4c73d5d238c63005e343ebd8e33887c5ee1140fbd4c76b04ebc91"' }>
                                            <li class="link">
                                                <a href="components/StandardLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StandardLayoutComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ToolsNavbarModule.html" data-type="entity-link" >ToolsNavbarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ToolsNavbarModule-dd7e85dbcadbccbf595a0da32ed33bb1adc4e762a66abc3676528c1eba7b3d9660151c42866b4646841c7e13ad419103d090f5e665699bec96f44bc7b0eebf9f"' : 'data-target="#xs-components-links-module-ToolsNavbarModule-dd7e85dbcadbccbf595a0da32ed33bb1adc4e762a66abc3676528c1eba7b3d9660151c42866b4646841c7e13ad419103d090f5e665699bec96f44bc7b0eebf9f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ToolsNavbarModule-dd7e85dbcadbccbf595a0da32ed33bb1adc4e762a66abc3676528c1eba7b3d9660151c42866b4646841c7e13ad419103d090f5e665699bec96f44bc7b0eebf9f"' :
                                            'id="xs-components-links-module-ToolsNavbarModule-dd7e85dbcadbccbf595a0da32ed33bb1adc4e762a66abc3676528c1eba7b3d9660151c42866b4646841c7e13ad419103d090f5e665699bec96f44bc7b0eebf9f"' }>
                                            <li class="link">
                                                <a href="components/ToolsNavbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToolsNavbarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/StandardGraphInfo.html" data-type="entity-link" >StandardGraphInfo</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ChartService.html" data-type="entity-link" >ChartService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HonorCodePopupService.html" data-type="entity-link" >HonorCodePopupService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ChartComponent.html" data-type="entity-link" >ChartComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CurveCounts.html" data-type="entity-link" >CurveCounts</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataButtonComponent.html" data-type="entity-link" >DataButtonComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataControlComponent.html" data-type="entity-link" >DataControlComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataTableComponent.html" data-type="entity-link" >DataTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraphButtonComponent.html" data-type="entity-link" >GraphButtonComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraphInfoComponent.html" data-type="entity-link" >GraphInfoComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SimpleTable.html" data-type="entity-link" >SimpleTable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SimpleTableInitArgs.html" data-type="entity-link" >SimpleTableInitArgs</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
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
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});