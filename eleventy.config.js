import sortBlogPostsByDate from './src/_utils/sort-blogposts-by-date.js';
import { format } from 'date-fns';
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import * as sass from 'sass';
import CleanCSS from 'clean-css';
import path from 'path';
import fs from 'fs';

// SCSS compilation helper
const isProduction = process.env.NODE_ENV === 'production';
const cssDir = './src/assets/css';

function compileSCSS(filename) {
    const inputPath = path.join(cssDir, `${filename}.scss`);
    const result = sass.compile(inputPath, {
        loadPaths: [cssDir]
    });

    let css = result.css;
    if (isProduction) {
        css = new CleanCSS({ level: 2 }).minify(css).styles;
    }
    return css;
}

export default config => {
    // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
    config.setUseGitIgnore(false);

    // Set directories to pass through to the dist folder
    config.addPassthroughCopy('./src/assets/fonts/');
    config.addPassthroughCopy('./src/assets/js/');
    config.addPassthroughCopy('./src/assets/img/');
    config.addWatchTarget('./src/assets/css/');

    config.addCollection('blog',
        collection => sortBlogPostsByDate(collection));

    config.addFilter('date', function (date, dateFormat) {
        return format(date, dateFormat);
    });

    // html: true is intentional - content is trusted (site owner only)
    // Required for: Nunjucks templating in .md files and markdown-it-attrs plugin
    const mdOptions = {
        html: true,
        breaks: true,
        linkify: true
    };
    const markdownLib = markdownIt(mdOptions)
        .use(markdownItAttrs)
        .disable('code');

    config.setLibrary('md', markdownLib);

    // Compile critical CSS and write to _includes for inlining
    config.on('eleventy.before', async () => {
        const includesDir = './src/_includes/css';
        if (!fs.existsSync(includesDir)) {
            fs.mkdirSync(includesDir, { recursive: true });
        }

        // Compile critical styles
        const criticalStyles = ['critical', 'base'];
        for (const name of criticalStyles) {
            const css = compileSCSS(name);
            fs.writeFileSync(path.join(includesDir, `${name}.css`), css);
        }
    });

    // SCSS extension for non-critical styles (fonts.css goes to dist/css/)
    config.addTemplateFormats('scss');
    config.addExtension('scss', {
        outputFileExtension: 'css',

        compileOptions: {
            permalink: function(contents, inputPath) {
                const filename = path.basename(inputPath, '.scss');

                // Skip partials and critical styles (handled by eleventy.before)
                if (filename.startsWith('_') || ['critical', 'base'].includes(filename)) {
                    return false;
                }

                // Other CSS goes to css/
                return `css/${filename}.css`;
            }
        },

        compile: async function(inputContent, inputPath) {
            const filename = path.basename(inputPath, '.scss');

            // Skip partials and critical styles
            if (filename.startsWith('_') || ['critical', 'base'].includes(filename)) {
                return;
            }

            const result = sass.compileString(inputContent, {
                loadPaths: [path.dirname(inputPath)],
                sourceMap: !isProduction
            });

            // Track dependencies for incremental builds
            this.addDependencies(inputPath, result.loadedUrls.map(url => url.pathname));

            return async () => {
                let css = result.css;

                if (isProduction) {
                    css = new CleanCSS({ level: 2 }).minify(css).styles;
                }

                return css;
            };
        }
    });

    return {
        markdownTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dir: {
            input: 'src',
            output: 'dist'
        }
    };
};
