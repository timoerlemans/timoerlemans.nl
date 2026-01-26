module.exports = (collection) => collection.getFilteredByGlob('./src/blog/*/**/*.md')
        .sort((a, b) => {
            const aDate = new Date(a.data.postDate);
            const bDate = new Date(b.data.postDate);
            return aDate - bDate;
        });

