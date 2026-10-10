import fs from 'node:fs';
import path from 'node:path';
import * as sass from 'sass';
import CleanCSS from 'clean-css';

const inlineStyles = new Set(['critical', 'base']);

/** Register the complete CSS build and its watch behavior with Eleventy. */
export function setupCssBuild(config) {
  let nunjucks;
  config.on('eleventy.engine.njk', ({ environment }) => { nunjucks = environment; });
  // Directories are finalized after the configuration callback returns.
  config.on('eleventy.beforeConfig', () => {
    const { input, includes } = config.directories;
    config.addWatchTarget(path.join(input, 'assets/css'));
    const generatedCss = path.resolve(includes, 'css');
    const absoluteSuffix = path.relative(path.parse(generatedCss).root, generatedCss).replaceAll('\\', '/');
    // Leading globs bypass Eleventy's relative-path normalization. Cover absolute
    // programmatic paths and relative CLI paths without unresolved parent segments.
    config.watchIgnores.add(`**/${absoluteSuffix}/**`);
    const relativeSuffix = path.relative(process.cwd(), generatedCss).replaceAll('\\', '/');
    if (!relativeSuffix.startsWith('../') && !path.isAbsolute(relativeSuffix)) {
      config.watchIgnores.add(`**/${relativeSuffix}/**`);
    }
  });

  config.on('eleventy.before', ({ directories }) => {
    const cssDir = path.join(directories.input, 'assets/css');
    const entrypoints = fs.readdirSync(cssDir, { recursive: true, withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name.endsWith('.scss') && !entry.name.startsWith('_'));

    for (const name of inlineStyles) {
      if (!fs.existsSync(path.join(cssDir, `${name}.scss`))) {
        throw new Error(`Missing required CSS entrypoint: ${name}.scss`);
      }
    }
    const outputNames = new Set();
    for (const entry of entrypoints) {
      if (outputNames.has(entry.name)) {
        throw new Error(`Multiple CSS entrypoints target ${path.basename(entry.name, '.scss')}.css`);
      }
      outputNames.add(entry.name);
    }

    for (const entry of entrypoints) {
      const name = path.basename(entry.name, '.scss');
      const result = sass.compile(path.join(entry.parentPath, entry.name), {
        loadPaths: [cssDir, path.resolve('node_modules')]
      });
      let css = result.css;
      if (process.env.NODE_ENV === 'production') {
        const minified = new CleanCSS({ level: 2 }).minify(css);
        if (minified.errors.length) {
          throw new Error(`Cannot minify ${entry.name}: ${minified.errors.join('; ')}`);
        }
        css = minified.styles;
      }

      const inline = inlineStyles.has(name);
      const destination = path.join(inline ? directories.includes : directories.output, 'css');
      fs.mkdirSync(destination, { recursive: true });
      fs.writeFileSync(path.join(destination, `${name}.css`), css);
    }
    // Generated includes are ignored by the watcher, so refresh their template cache here.
    nunjucks?.invalidateCache();
  });
}
