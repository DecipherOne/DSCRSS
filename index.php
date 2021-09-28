<html><head>
  <title></title>
</head>
<body>
<div class="template-section main-section">
  <div class="middle" data-bind="css: { &#39;has-header&#39;: showHeader }">
    <div class="full-height" data-bind="component: { name: &#39;content-control&#39;, params: { serverData: svr } }"><!--  --><!-- ko withProperties: { '$content': $data } -->
      <div class="flex-column"><!-- ko if: $page.paginationControlHelper.showBackgroundLogoHolder --><!-- /ko --><!-- ko if: $page.paginationControlHelper.showPageLevelTitleControl --><!-- /ko -->
        <div class="win-scroll">
          <div class="sign-in-box ext-sign-in-box fade-in-lightbox has-popup" data-bind="
            animationEnd: $page.paginationControlHelper.animationEnd,
            externalCss: { &#39;sign-in-box&#39;: true },
            css: {
                &#39;inner&#39;:  $content.isVerticalSplitTemplate,
                &#39;vertical-split-content&#39;: $content.isVerticalSplitTemplate,
                &#39;app&#39;: $page.backgroundLogoUrl,
                &#39;wide&#39;: $page.paginationControlHelper.useWiderWidth,
                &#39;fade-in-lightbox&#39;: $page.fadeInLightBox,
                &#39;has-popup&#39;: $page.showFedCredAndNewSession &amp;&amp; ($page.showFedCredButtons() || $page.newSession()),
                &#39;transparent-lightbox&#39;: $page.backgroundControlMethods() &amp;&amp; $page.backgroundControlMethods().useTransparentLightBox,
                &#39;lightbox-bottom-margin-debug&#39;: $page.showDebugDetails }" id="lightbox"><!-- ko template: { nodes: $masterPageContext.$componentTemplateNodes, data: $page } --><!-- ko if: svr.BM --><!-- /ko -->
            <div class="lightbox-cover" data-bind="css: { &#39;disable-lightbox&#39;: svr.Ca &amp;&amp; showLightboxProgress() }"> </div>
            <!-- ko if: showLightboxProgress --><!-- /ko --><!-- ko if: loadBannerLogo -->

            <div data-bind="component: { name: &#39;logo-control&#39;,
            params: {
                isChinaDc: svr.fIsChinaDc,
                bannerLogoUrl: bannerLogoUrl() } }"><!--  --><!-- ko if: bannerLogoUrl --><!-- /ko --><!-- ko if: !bannerLogoUrl && !isChinaDc --><!-- ko component: 'accessible-image-control' --><!-- ko if: (isHighContrastBlackTheme || hasDarkBackground || svr.fHasBackgroundColor) && !isHighContrastWhiteTheme --><!-- /ko --><!-- ko if: (isHighContrastWhiteTheme || (!hasDarkBackground && !svr.fHasBackgroundColor)) && !isHighContrastBlackTheme --><!-- ko template: { nodes: [darkImageNode], data: $parent } --><img alt="Microsoft" class="logo" data-bind="imgSrc, attr: { alt: str[&#39;MOBILE_STR_Footer_Microsoft&#39;] }" pngsrc="https://logincdn.msauth.net/shared/1.0/content/images/microsoft_logo_ed9c9eb0dce17d752bedea6b5acda6d9.png" role="img" src="https://logincdn.msauth.net/shared/1.0/content/images/microsoft_logo_ee5c8d9fb6248c938fd0dc19370e90bd.svg" svgsrc="https://logincdn.msauth.net/shared/1.0/content/images/microsoft_logo_ee5c8d9fb6248c938fd0dc19370e90bd.svg"/><!-- /ko --> <!-- /ko --><!-- /ko --> <!-- /ko --></div>
            <!-- /ko --><!-- ko if: svr.c7 && paginationControlHelper.showLwaDisclaimer() --><!-- /ko --><!-- ko if: asyncInitReady -->

            <div data-bind="component: { name: &#39;pagination-control&#39;,
            publicMethods: paginationControlMethods,
            params: {
                enableCssAnimation: svr.av,
                disableAnimationIfAnimationEndUnsupported: svr.Ce,
                initialViewId: initialViewId,
                currentViewId: currentViewId,
                initialSharedData: initialSharedData,
                initialError: $loginPage.getServerError() },
            event: {
                cancel: paginationControl_onCancel,
                loadView: view_onLoadView,
                showView: view_onShow,
                setLightBoxFadeIn: view_onSetLightBoxFadeIn,
                animationStateChange: paginationControl_onAnimationStateChange } }" role="main"><!--  -->
              <div data-bind="css: { &#39;zero-opacity&#39;: hidePaginatedView() }"><!-- ko if: showIdentityBanner() && (sharedData.displayName || svr.J) --><!-- /ko -->
                <div class="pagination-view animate slide-in-back" data-bind="css: {
        &#39;has-identity-banner&#39;: showIdentityBanner() &amp;&amp; (sharedData.displayName || svr.J),
        &#39;zero-opacity&#39;: hidePaginatedView.hideSubView(),
        &#39;animate&#39;: animate(),
        &#39;slide-out-next&#39;: animate.isSlideOutNext(),
        &#39;slide-in-next&#39;: animate.isSlideInNext(),
        &#39;slide-out-back&#39;: animate.isSlideOutBack(),
        &#39;slide-in-back&#39;: animate.isSlideInBack() }"><!-- ko foreach: views --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- ko template: { nodes: [$data], data: $parent } -->
                  <div data-bind="pageViewComponent: { name: &#39;login-paginated-username-view&#39;,
                params: {
                    serverData: svr,
                    serverError: initialError,
                    isInitialView: isInitialState,
                    displayName: sharedData.displayName,
                    otherIdpRedirectUrl: sharedData.otherIdpRedirectUrl,
                    prefillNames: $loginPage.prefillNames,
                    flowToken: sharedData.flowToken,
                    availableSignupCreds: sharedData.availableSignupCreds },
                event: {
                    redirect: $loginPage.view_onRedirect,
                    setPendingRequest: $loginPage.view_onSetPendingRequest,
                    registerDialog: $loginPage.view_onRegisterDialog,
                    unregisterDialog: $loginPage.view_onUnregisterDialog,
                    showDialog: $loginPage.view_onShowDialog,
                    updateAvailableCredsWithoutUsername: $loginPage.view_onUpdateAvailableCreds,
                    agreementClick: $loginPage.footer_agreementClick } }" data-showfedcredbutton="true" data-viewid="1"><!--  -->
                    <div data-bind="component: { name: &#39;header-control&#39;,
    params: {
        serverData: svr,
        title: str[&#39;WF_STR_HeaderDefault_Title&#39;] } }">
                      <div class="row title ext-title" data-bind="externalCss: { &#39;title&#39;: true }" id="loginHeader">
                        <div aria-level="1" data-bind="text: title" role="heading">Sign in</div>
                        <!-- ko if: isSubtitleVisible --><!-- /ko --></div>
                    </div>
                    <!-- ko if: pageDescription && !svr.Ci --><!-- /ko -->

                    <div class="row">
                      <div aria-live="assertive" role="alert"><!-- ko if: usernameTextbox.error --><!-- /ko --></div>

                      <div class="form-group col-md-24"><!-- ko if: prefillNames().length > 1 --><!-- /ko --><!-- ko ifnot: prefillNames().length > 1 -->
                        <div class="placeholderContainer" data-bind="component: { name: &#39;placeholder-textbox-field&#39;,
            publicMethods: usernameTextbox.placeholderTextboxMethods,
            params: {
                serverData: svr,
                hintText: tenantBranding.unsafe_userIdLabel || str[&#39;CT_PWD_STR_Email_Example&#39;],
                hintCss: &#39;placeholder&#39; + (!svr.aq ? &#39; ltr_override&#39; : &#39;&#39;) },
            event: {
                updateFocus: usernameTextbox.textbox_onUpdateFocus } }"><!-- ko withProperties: { '$placeholderText': placeholderText } --><!-- ko template: { nodes: $componentTemplateNodes, data: $parent } --><input aria-describedby="loginHeader usernameError" aria-label="Enter your email, phone, or Skype." aria-required="true" class="form-control ltr_override input ext-input text-box ext-text-box" data-bind="
                    attr: { lang: svr.aR ? null : &#39;en&#39; },
                    externalCss: {
                        &#39;input&#39;: true,
                        &#39;text-box&#39;: true,
                        &#39;has-error&#39;: usernameTextbox.error },
                    ariaLabel: tenantBranding.unsafe_userIdLabel || str[&#39;CT_PWD_STR_Username_AriaLabel&#39;],
                    ariaDescribedBy: &#39;loginHeader&#39; + (pageDescription &amp;&amp; !svr.Ci ? &#39; loginDescription usernameError&#39; : &#39; usernameError&#39;),
                    textInput: usernameTextbox.value,
                    hasFocusEx: usernameTextbox.focused,
                    placeholder: $placeholderText" id="i0116" maxlength="113" name="loginfmt" placeholder="Email, phone, or Skype" type="email"/></div>

                        <div class="placeholderContainer" data-bind="component: { name: &#39;placeholder-textbox-field&#39;,
            publicMethods: usernameTextbox.placeholderTextboxMethods,
            params: {
                serverData: svr,
                hintText: tenantBranding.unsafe_userIdLabel || str[&#39;CT_PWD_STR_Email_Example&#39;],
                hintCss: &#39;placeholder&#39; + (!svr.aq ? &#39; ltr_override&#39; : &#39;&#39;) },
            event: {
                updateFocus: usernameTextbox.textbox_onUpdateFocus } }"><input aria-hidden="true" autocomplete="off" class="moveOffScreen" data-bind="moveOffScreen, textInput: passwordBrowserPrefill" id="i0118" name="passwd" tabindex="-1" type="password"/> <!-- /ko --> <!-- /ko --> <!-- ko ifnot: usePlaceholderAttribute --><!-- /ko --></div>
                        <!-- /ko --></div>
                    </div>

                    <div class="position-buttons" data-bind="css: { &#39;position-buttons&#39;: !tenantBranding.BoilerPlateText }">
                      <div class="row">
                        <div class="col-md-24">
                          <div class="text-13"><!-- ko if: svr.Ar && !svr.Af && !svr.at -->
                            <div class="form-group" data-bind="
                    htmlWithBindings: html[&#39;WF_STR_SignUpLink_Text&#39;],
                    childBindings: {
                        &#39;signup&#39;: {
                            href: svr.i || &#39;#&#39;,
                            ariaLabel: svr.i ? str[&#39;WF_STR_SignupLink_AriaLabel_Text&#39;] : str[&#39;WF_STR_SignupLink_AriaLabel_Generic_Text&#39;],
                            click: signup_onClick } }">No account? <a aria-label="Create a Microsoft account" href="https://signup.live.com/signup?contextid=5620CD5201C36B48&amp;bk=1630695872&amp;ru=https://login.live.com/login.srf%3fcontextid%3d5620CD5201C36B48%26uiflavor%3dweb%26mkt%3dEN-US%26lc%3d1033%26bk%3d1630695872%26uaid%3db16d66229b3e4c388e2064b5741e6c7d&amp;uiflavor=web&amp;lic=1&amp;mkt=EN-US&amp;lc=1033&amp;uaid=b16d66229b3e4c388e2064b5741e6c7d" id="signup">Create one!</a></div>
                            <!-- /ko --><!-- ko ifnot: hideCantAccessYourAccount --><!-- /ko --><!-- ko if: showFidoLinkInline && hasFido() && (availableCredsWithoutUsername().length >= 2 || svr.AV || isOfflineAccountVisible) --><!-- /ko --><!-- ko if: (availableCredsWithoutUsername().length > 0 || svr.AV || svr.R) && !hideSignInOptions -->

                            <div class="form-group" data-bind="
                    component: { name: &#39;cred-switch-link-control&#39;,
                        params: {
                            serverData: svr,
                            availableCreds: availableCredsWithoutUsername(),
                            showForgotUsername: svr.AV },
                        event: {
                            switchView: noUsernameCredSwitchLink_onSwitchView,
                            redirect: onRedirect,
                            registerDialog: onRegisterDialog,
                            unregisterDialog: onUnregisterDialog,
                            showDialog: onShowDialog } }"><!--  -->
                              <div class="form-group"><!-- ko if: showSwitchToCredPickerLink --><!-- /ko --><!-- ko if: credentialCount === 1 && !(showForgotUsername || selectedCredShownOnlyOnPicker) --><!-- /ko --><!-- ko if: credentialCount === 0 && showForgotUsername --><!-- /ko --></div>
                              <!-- ko if: credLinkError --><!-- /ko --></div>
                            <!-- /ko --><!-- ko if: svr.am --><!-- /ko --></div>
                        </div>
                      </div>
                    </div>
                    <!-- ko if: svr.Cz --><!-- /ko -->

                    <div class="win-button-pin-bottom" data-bind="css : { &#39;boilerplate-button-bottom&#39;: tenantBranding.BoilerPlateText }">
                      <div class="row" data-bind="css: { &#39;move-buttons&#39;: tenantBranding.BoilerPlateText }">
                        <div data-bind="component: { name: &#39;footer-buttons-field&#39;,
            params: {
                serverData: svr,
                isPrimaryButtonEnabled: !isRequestPending(),
                isPrimaryButtonVisible: svr.f,
                isSecondaryButtonEnabled: true,
                isSecondaryButtonVisible: svr.f &amp;&amp; isSecondaryButtonVisible(),
                secondaryButtonText: secondaryButtonText() },
            event: {
                primaryButtonClick: primaryButton_onClick,
                secondaryButtonClick: secondaryButton_onClick } }">
                          <div class="col-xs-24 no-padding-left-right button-container" data-bind="
    visible: isPrimaryButtonVisible() || isSecondaryButtonVisible(),
    css: { &#39;no-margin-bottom&#39;: removeBottomMargin }"><!-- ko if: isSecondaryButtonVisible --><!-- /ko -->
                            <div class="inline-block" data-bind="css: { &#39;inline-block&#39;: isPrimaryButtonVisible }"><!-- type="submit" is needed in-addition to 'type' in primaryButtonAttributes observable to support IE8 --><input class="win-button button_primary button ext-button primary ext-primary" data-bind="
            attr: primaryButtonAttributes,
            externalCss: {
                &#39;button&#39;: true,
                &#39;primary&#39;: true },
            value: primaryButtonText() || str[&#39;CT_PWD_STR_SignIn_Button_Next&#39;],
            hasFocus: focusOnPrimaryButton,
            click: primaryButton_onClick,
            enable: isPrimaryButtonEnabled,
            visible: isPrimaryButtonVisible,
            preventTabbing: primaryButtonPreventTabbing" id="idSIButton9" type="submit" value="Next"/></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- ko if: tenantBranding.BoilerPlateText --><!-- /ko --></div>
                  <!-- /ko --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- ko if: $parent.currentViewIndex() === $index() --><!-- /ko --><!-- /ko --></div>
              </div>
            </div>
            <!-- /ko --><input data-bind="value: postedLoginStateViewId" name="ps" type="hidden" value=""/> <input data-bind="value: postedLoginStateViewRNGCDefaultType" name="psRNGCDefaultType" type="hidden" value=""/> <input data-bind="value: postedLoginStateViewRNGCEntropy" name="psRNGCEntropy" type="hidden" value=""/> <input data-bind="value: postedLoginStateViewRNGCSLK" name="psRNGCSLK" type="hidden" value=""/> <input data-bind="value: svr.canary" name="canary" type="hidden" value=""/> <input data-bind="value: ctx" name="ctx" type="hidden" value=""/> <input data-bind="value: svr.sessionId" name="hpgrequestid" type="hidden" value=""/> <input data-bind="attr: { name: svr.bI }, value: flowToken" id="i0327" name="PPFT" type="hidden" value="DQdp!b0NEwxxCO6nPXnn!Lke1GrAno0w37nWKSP10eh6OaOBVKi6r4UvgyiW1RZoAFbT0I!NVqwvlXU1JeuuGpZ3aZ*iSIk8jAhAQ7iyCOYXcJ2GwENWUGu*Llb9wzXCs7xOIr36Ut9Hzp!DrO5tLPah08VCmpI1z8PXYMb80aFg3h8Ko3ss*x6bTRmwnofCgsfygXpHKCih6uGl9NaHie2gQPBJYQpyIIqCOw1qHzdPVa!jCl1Fo7BqsHfrocEPKA$$"/> <input data-bind="value: svr.cz" name="PPSX" type="hidden" value="Passport"/> <input name="NewUser" type="hidden" value="1"/> <input data-bind="value: svr.Aj" name="FoundMSAs" type="hidden" value=""/> <input data-bind="value: svr.fPOST_ForceSignin ? 1 : 0" name="fspost" type="hidden" value="0"/> <input data-bind="value: wasLearnMoreShown() ? 1 : 0" name="i21" type="hidden" value="0"/> <input data-bind="value: svr.BM ? 1 : 0" name="CookieDisclosure" type="hidden" value="0"/> <input data-bind="value: isFidoSupported() ? 1 : 0" name="IsFidoSupported" type="hidden" value="0"/> <input data-bind="value: isSignupPost() ? 1 : 0" name="isSignupPost" type="hidden" value="0"/>
            <div data-bind="component: { name: &#39;instrumentation-control&#39;,
            publicMethods: instrumentationMethods,
            params: { serverData: svr } }"><input data-bind="value: clientMode" name="i2" type="hidden" value="1"/> <input data-bind="value: srsFailed" name="i17" type="hidden" value="0"/> <input data-bind="value: srsSuccess" name="i18" type="hidden"/> <input data-bind="value: timeOnPage" name="i19" type="hidden" value=""/></div>
            <!-- /ko --></div>
          <!-- ko if: $page.showFedCredAndNewSession --><!-- ko if: $page.showFedCredButtons -->

          <div class="promoted-fed-cred-box" data-bind="css: { &#39;app&#39;: $page.backgroundLogoUrl }">
            <div class="promoted-fed-cred-content" data-bind="css: {
                &#39;animate&#39;: $page.useCssAnimations &amp;&amp; $page.animate(),
                &#39;slide-out-next&#39;: $page.animate.isSlideOutNext,
                &#39;slide-in-next&#39;: $page.animate.isSlideInNext,
                &#39;slide-out-back&#39;: $page.animate.isSlideOutBack,
                &#39;slide-in-back&#39;: $page.animate.isSlideInBack,
                &#39;app&#39;: $page.backgroundLogoUrl }"><!-- ko foreach: $page.otherSigninOptions -->
              <div class="row tile">
                <div aria-label="Sign-in options" class="table" data-bind="
                        css: { &#39;list-item&#39;: svr.cb },
                        pressEnter: $page.otherSigninOptionsButton_onClick,
                        click: $page.otherSigninOptionsButton_onClick,
                        ariaLabel: $data.text" role="button" tabindex="0">
                  <div class="table-row">
                    <div class="table-cell tile-img medium"><!-- ko component: 'accessible-image-control' --><!-- ko if: (isHighContrastBlackTheme || hasDarkBackground || svr.fHasBackgroundColor) && !isHighContrastWhiteTheme --><!-- /ko --><!-- ko if: (isHighContrastWhiteTheme || (!hasDarkBackground && !svr.fHasBackgroundColor)) && !isHighContrastBlackTheme --><!-- ko template: { nodes: [darkImageNode], data: $parent } --><img class="tile-img medium" data-bind="attr: { src: $data.darkIconUrl }" role="presentation" src="https://logincdn.msauth.net/shared/1.0/content/images/signin-options_4e48046ce74f4b89d45037c90576bfac.svg"/><!-- /ko --> <!-- /ko --><!-- /ko --></div>

                    <div class="table-cell text-left content" data-bind="css: { &#39;content&#39;: !svr.cb }">
                      <div data-bind="
                                    text: $data.text,
                                    attr: { &#39;data-test-id&#39;: $data.testId }" data-test-id="signinOptions">Sign-in options</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- /ko --></div>
          </div>
          <!-- /ko --><!-- ko if: $page.newSession --><!-- /ko --><!-- /ko --><!-- ko if: $page.showDebugDetails --><!-- /ko --></div>
      </div>
      <!-- /ko --></div>
  </div>
</div>


</body></html>