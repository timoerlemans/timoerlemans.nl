# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Security
- Add SRI hashes to external scripts (#150)
- Replace WebFont loader with native CSS font-loading (#151)
- Add SRI hash to Umami analytics external script (#181)
- Add security headers to Netlify configuration (#183)
- Upgrade HTTP redirects to HTTPS in Netlify configuration (#182)
- Remove 'unsafe-inline' from CSP script-src directive (#180)

### Fixed
- Fix typo 'delare' to 'declare' in comment (#146)
- Remove duplicate blog posts at root level of blog directory (#185)
- Fix GitHub Actions workflows targeting 'master' instead of 'main' (#186)
- Fix dark mode detection using .media instead of .matches (#184)
- Fix blog listing showing raw date strings instead of formatted dates (#205)
- Fix page title showing dangling dash when title is empty (#199)

### Accessibility
- Add dynamic lang attribute for Dutch blog posts (#188)
- Add accessible label and keyboard support to dark mode toggle (#187)
- Add skip-to-content navigation link (#196)
- Wrap navigation list in nav landmark element (#202)
- Improve dark mode link color contrast to meet WCAG AA (#206)
- Convert CSS spacing from pixel values to rem units (#201)

### Changed
- Use modern ::before/::after pseudo-element syntax (#143)
- Improve HTML template formatting (#144)
- Remove empty webfontloader.js file (#145)
- Migrate from CommonJS to ES modules (#155)
- Remove unnecessary vendor prefixes (#156)
- Add CSS spacing custom properties (#158)
- Remove unused Muli font declaration and font file (#190)
- Fix incorrect JSDoc @returns descriptions in helpers.js (#200)
- Persist dark mode preference in localStorage (#195)
- Remove empty blogposts.json data file (#193)
- Move ESLint packages from dependencies to devDependencies (#198)
