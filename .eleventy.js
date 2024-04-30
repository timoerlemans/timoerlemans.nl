const sortBlogPostsByDate = require('./src/_utils/sort-blogposts-by-date');
const format = require('date-fns/format');
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");


module.exports = config => {
    // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
    config.setUseGitIgnore(false);

    // Set directories to pass through to the dist folder
    config.addPassthroughCopy('./src/assets/fonts/');
    config.addPassthroughCopy('./src/assets/js/');
    config.addPassthroughCopy('./src/assets/img/');
    config.addWatchTarget('./src/assets/');

    config.addCollection('blog',
        collection => sortBlogPostsByDate(collection));

    config.addFilter('date', function (date, dateFormat) {
        return format(date, dateFormat);
    });

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

