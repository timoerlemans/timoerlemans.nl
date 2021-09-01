const sortBlogPostsByDate = require('./src/_utils/sort-blogposts-by-date');

module.exports = config => {
    // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
    config.setUseGitIgnore(false);

    // Set directories to pass through to the dist folder
    config.addPassthroughCopy('./src/assets/fonts/');

    config.addWatchTarget('./src/assets/');

    config.addCollection('blogposts',
            collection => sortBlogPostsByDate(collection));

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

