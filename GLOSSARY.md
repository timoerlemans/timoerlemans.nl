# Domain glossary

## CSS build

The build-time process that turns stylesheet entrypoints in `src/assets/css/` into CSS for the website. The `critical` and `base` entrypoints are included inline in each page; other entrypoints become standalone stylesheets. Sass partials provide shared definitions and have no standalone output.

The CSS build module owns compilation, import resolution, production minification, delivery and watch behavior. Its caller interface is the Eleventy setup function in `build/css.js`.
