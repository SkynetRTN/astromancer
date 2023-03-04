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
                                        'data-target="#directives-links-module-ChartDirectiveModule-2af44515660e2b5941f5c139a4bc3e4670eaf8b56df02525d7dd771fe5b2086b06573cd7f6b3561c1f0812ed86be0fc7f3d02580790c0168d02564b004a2702f"' : 'data-target="#xs-directives-links-module-ChartDirectiveModule-2af44515660e2b5941f5c139a4bc3e4670eaf8b56df02525d7dd771fe5b2086b06573cd7f6b3561c1f0812ed86be0fc7f3d02580790c0168d02564b004a2702f"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-ChartDirectiveModule-2af44515660e2b5941f5c139a4bc3e4670eaf8b56df02525d7dd771fe5b2086b06573cd7f6b3561c1f0812ed86be0fc7f3d02580790c0168d02564b004a2702f"' :
                                        'id="xs-directives-links-module-ChartDirectiveModule-2af44515660e2b5941f5c139a4bc3e4670eaf8b56df02525d7dd771fe5b2086b06573cd7f6b3561c1f0812ed86be0fc7f3d02580790c0168d02564b004a2702f"' }>
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
                                            'data-target="#components-links-module-CurveChartModule-26e84e8d56cef76be50c70ffb3167b241dd257809aa6283b9bd8c338054604b94577b6b3c22a38626a3c54c67f0865e9ba5ab3d7f6072bb6a523c0b9ba88d27c"' : 'data-target="#xs-components-links-module-CurveChartModule-26e84e8d56cef76be50c70ffb3167b241dd257809aa6283b9bd8c338054604b94577b6b3c22a38626a3c54c67f0865e9ba5ab3d7f6072bb6a523c0b9ba88d27c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CurveChartModule-26e84e8d56cef76be50c70ffb3167b241dd257809aa6283b9bd8c338054604b94577b6b3c22a38626a3c54c67f0865e9ba5ab3d7f6072bb6a523c0b9ba88d27c"' :
                                            'id="xs-components-links-module-CurveChartModule-26e84e8d56cef76be50c70ffb3167b241dd257809aa6283b9bd8c338054604b94577b6b3c22a38626a3c54c67f0865e9ba5ab3d7f6072bb6a523c0b9ba88d27c"' }>
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
                                            'data-target="#components-links-module-CurveModule-6c303da37084cd32c502b78a1ba074400a1364e151d9139363fcd31d883df33ee4e9d948a2c7fa77c318c84c764cfe8a0971ac47311655dcdae84ea7562959d1"' : 'data-target="#xs-components-links-module-CurveModule-6c303da37084cd32c502b78a1ba074400a1364e151d9139363fcd31d883df33ee4e9d948a2c7fa77c318c84c764cfe8a0971ac47311655dcdae84ea7562959d1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CurveModule-6c303da37084cd32c502b78a1ba074400a1364e151d9139363fcd31d883df33ee4e9d948a2c7fa77c318c84c764cfe8a0971ac47311655dcdae84ea7562959d1"' :
                                            'id="xs-components-links-module-CurveModule-6c303da37084cd32c502b78a1ba074400a1364e151d9139363fcd31d883df33ee4e9d948a2c7fa77c318c84c764cfe8a0971ac47311655dcdae84ea7562959d1"' }>
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
                                        'data-target="#directives-links-module-DataButtonDirectiveModule-97343a88dffc8c50313fceb0b5d659b6b365df3e953530431e95cd4ef8d1590313313c612d7b5b840682a5abf2492f0c56e87130718a59c4a1d575af4c298b22"' : 'data-target="#xs-directives-links-module-DataButtonDirectiveModule-97343a88dffc8c50313fceb0b5d659b6b365df3e953530431e95cd4ef8d1590313313c612d7b5b840682a5abf2492f0c56e87130718a59c4a1d575af4c298b22"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-DataButtonDirectiveModule-97343a88dffc8c50313fceb0b5d659b6b365df3e953530431e95cd4ef8d1590313313c612d7b5b840682a5abf2492f0c56e87130718a59c4a1d575af4c298b22"' :
                                        'id="xs-directives-links-module-DataButtonDirectiveModule-97343a88dffc8c50313fceb0b5d659b6b365df3e953530431e95cd4ef8d1590313313c612d7b5b840682a5abf2492f0c56e87130718a59c4a1d575af4c298b22"' }>
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
                                        'data-target="#directives-links-module-DataControlDirectiveModule-51901e16bd564239db78c7bc0cc1abcc930eddc99fff073a3771e3af4f00372a5b355086251fe3e18eae0e20a06275d36bebf45c548ff849d8101ba3214209a8"' : 'data-target="#xs-directives-links-module-DataControlDirectiveModule-51901e16bd564239db78c7bc0cc1abcc930eddc99fff073a3771e3af4f00372a5b355086251fe3e18eae0e20a06275d36bebf45c548ff849d8101ba3214209a8"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-DataControlDirectiveModule-51901e16bd564239db78c7bc0cc1abcc930eddc99fff073a3771e3af4f00372a5b355086251fe3e18eae0e20a06275d36bebf45c548ff849d8101ba3214209a8"' :
                                        'id="xs-directives-links-module-DataControlDirectiveModule-51901e16bd564239db78c7bc0cc1abcc930eddc99fff073a3771e3af4f00372a5b355086251fe3e18eae0e20a06275d36bebf45c548ff849d8101ba3214209a8"' }>
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
                                        'data-target="#directives-links-module-DataTableDirectiveModule-10d71f5b213df6b497eee5d641d6555c9802543e8841b7288802cf8b5ad923f3b6ae03430dee83962e5c261e5d77472dfaf18b08255dc872911c1273eacb9d0a"' : 'data-target="#xs-directives-links-module-DataTableDirectiveModule-10d71f5b213df6b497eee5d641d6555c9802543e8841b7288802cf8b5ad923f3b6ae03430dee83962e5c261e5d77472dfaf18b08255dc872911c1273eacb9d0a"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-DataTableDirectiveModule-10d71f5b213df6b497eee5d641d6555c9802543e8841b7288802cf8b5ad923f3b6ae03430dee83962e5c261e5d77472dfaf18b08255dc872911c1273eacb9d0a"' :
                                        'id="xs-directives-links-module-DataTableDirectiveModule-10d71f5b213df6b497eee5d641d6555c9802543e8841b7288802cf8b5ad923f3b6ae03430dee83962e5c261e5d77472dfaf18b08255dc872911c1273eacb9d0a"' }>
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
                                        'data-target="#directives-links-module-GraphButtonDirectiveModule-5ff6d2c267d423d5cd0d6ca50765c529ac17b00f8b92b13561e48dfd6b8fae18c5cdea2fe33822ffa60e2d4aadf1799934840e963daaccf733910ea80bde53bf"' : 'data-target="#xs-directives-links-module-GraphButtonDirectiveModule-5ff6d2c267d423d5cd0d6ca50765c529ac17b00f8b92b13561e48dfd6b8fae18c5cdea2fe33822ffa60e2d4aadf1799934840e963daaccf733910ea80bde53bf"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-GraphButtonDirectiveModule-5ff6d2c267d423d5cd0d6ca50765c529ac17b00f8b92b13561e48dfd6b8fae18c5cdea2fe33822ffa60e2d4aadf1799934840e963daaccf733910ea80bde53bf"' :
                                        'id="xs-directives-links-module-GraphButtonDirectiveModule-5ff6d2c267d423d5cd0d6ca50765c529ac17b00f8b92b13561e48dfd6b8fae18c5cdea2fe33822ffa60e2d4aadf1799934840e963daaccf733910ea80bde53bf"' }>
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
                                        'data-target="#directives-links-module-GraphInfoDirectiveModule-aab149578f1438f96633605f19d9f2a0088d25d5c64d8b4714150c0592f29ecd3077aaccca2f12fd4d503f72235b9958ba3e08be8167658923ece699fe0346e9"' : 'data-target="#xs-directives-links-module-GraphInfoDirectiveModule-aab149578f1438f96633605f19d9f2a0088d25d5c64d8b4714150c0592f29ecd3077aaccca2f12fd4d503f72235b9958ba3e08be8167658923ece699fe0346e9"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-GraphInfoDirectiveModule-aab149578f1438f96633605f19d9f2a0088d25d5c64d8b4714150c0592f29ecd3077aaccca2f12fd4d503f72235b9958ba3e08be8167658923ece699fe0346e9"' :
                                        'id="xs-directives-links-module-GraphInfoDirectiveModule-aab149578f1438f96633605f19d9f2a0088d25d5c64d8b4714150c0592f29ecd3077aaccca2f12fd4d503f72235b9958ba3e08be8167658923ece699fe0346e9"' }>
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
                                            'data-target="#components-links-module-HonorCodePopupModule-66555ce0a9f70b7acacae2971fcbd3f49ad2a82f50b9dae9915a7ad0516d91965577827dbde4eb43c336327e2c769848badbb76667c6522656ef1bbef64cee58"' : 'data-target="#xs-components-links-module-HonorCodePopupModule-66555ce0a9f70b7acacae2971fcbd3f49ad2a82f50b9dae9915a7ad0516d91965577827dbde4eb43c336327e2c769848badbb76667c6522656ef1bbef64cee58"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HonorCodePopupModule-66555ce0a9f70b7acacae2971fcbd3f49ad2a82f50b9dae9915a7ad0516d91965577827dbde4eb43c336327e2c769848badbb76667c6522656ef1bbef64cee58"' :
                                            'id="xs-components-links-module-HonorCodePopupModule-66555ce0a9f70b7acacae2971fcbd3f49ad2a82f50b9dae9915a7ad0516d91965577827dbde4eb43c336327e2c769848badbb76667c6522656ef1bbef64cee58"' }>
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
                                            'data-target="#components-links-module-LineFormModule-1e9e448a8dd39764151d279a8710930757284773ded37a567caad8088c67b65eae9d34aa4a8c2a9fde839111c6902f2345bac6452041011bddeb96d462ea0e64"' : 'data-target="#xs-components-links-module-LineFormModule-1e9e448a8dd39764151d279a8710930757284773ded37a567caad8088c67b65eae9d34aa4a8c2a9fde839111c6902f2345bac6452041011bddeb96d462ea0e64"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LineFormModule-1e9e448a8dd39764151d279a8710930757284773ded37a567caad8088c67b65eae9d34aa4a8c2a9fde839111c6902f2345bac6452041011bddeb96d462ea0e64"' :
                                            'id="xs-components-links-module-LineFormModule-1e9e448a8dd39764151d279a8710930757284773ded37a567caad8088c67b65eae9d34aa4a8c2a9fde839111c6902f2345bac6452041011bddeb96d462ea0e64"' }>
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
                                            'data-target="#components-links-module-MenubarModule-b106bc0b0edfaa56fcef099cfba2eeeb5e48357b936b365b84cd8681310e85df2e5bbf110fcbdb18f5ef46e2468aac06853c38ff14381828016b91c87070531b"' : 'data-target="#xs-components-links-module-MenubarModule-b106bc0b0edfaa56fcef099cfba2eeeb5e48357b936b365b84cd8681310e85df2e5bbf110fcbdb18f5ef46e2468aac06853c38ff14381828016b91c87070531b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MenubarModule-b106bc0b0edfaa56fcef099cfba2eeeb5e48357b936b365b84cd8681310e85df2e5bbf110fcbdb18f5ef46e2468aac06853c38ff14381828016b91c87070531b"' :
                                            'id="xs-components-links-module-MenubarModule-b106bc0b0edfaa56fcef099cfba2eeeb5e48357b936b365b84cd8681310e85df2e5bbf110fcbdb18f5ef46e2468aac06853c38ff14381828016b91c87070531b"' }>
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
                                            'data-target="#components-links-module-ToolsNavbarModule-0d56d0c7d0c5e3604ebee7a2ec5045078f452c0d423ada3fa47efcf49fe4346c879b2f28420dfb351964ddc24249373acbc306bd7fd0e3edc08cb482dffc34de"' : 'data-target="#xs-components-links-module-ToolsNavbarModule-0d56d0c7d0c5e3604ebee7a2ec5045078f452c0d423ada3fa47efcf49fe4346c879b2f28420dfb351964ddc24249373acbc306bd7fd0e3edc08cb482dffc34de"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ToolsNavbarModule-0d56d0c7d0c5e3604ebee7a2ec5045078f452c0d423ada3fa47efcf49fe4346c879b2f28420dfb351964ddc24249373acbc306bd7fd0e3edc08cb482dffc34de"' :
                                            'id="xs-components-links-module-ToolsNavbarModule-0d56d0c7d0c5e3604ebee7a2ec5045078f452c0d423ada3fa47efcf49fe4346c879b2f28420dfb351964ddc24249373acbc306bd7fd0e3edc08cb482dffc34de"' }>
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