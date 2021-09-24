module.exports = (collection) => collection.getFilteredByGlob('./src/blog/**/*.md')
        .sort((a, b) => {
            const aDate = new Date(a.date.postDate);
            const bDate = new Date(b.date.postDate);
            return +bDate - +aDate;
        });

