import { setupCssBuild } from './build/css.js';
import sortBlogPostsByDate from './src/_utils/sort-blogposts-by-date.js';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale/nl';
import { enUS } from 'date-fns/locale/en-US';
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';

export default config => {
    // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
    config.setUseGitIgnore(false);
    setupCssBuild(config);

    // Set directories to pass through to the dist folder
    config.addPassthroughCopy('./src/assets/fonts/');
    config.addPassthroughCopy('./src/assets/js/');
    config.addPassthroughCopy('./src/assets/img/');

    config.addCollection('blog',
        collection => sortBlogPostsByDate(collection));

    const localeMap = { nl, en: enUS };
    config.addFilter('date', function (date, dateFormat, lang) {
        const locale = localeMap[lang];
        return format(date, dateFormat, locale ? { locale } : undefined);
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
