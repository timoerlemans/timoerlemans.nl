module.exports = {
    /**
     * Returns back some attributes based on whether the
     * link is active or a parent of an active item
     *
     * @param {String} itemUrl The link in question
     * @param {String} pageUrl The page context
     * @returns {String} The attributes or empty
     */
    getLinkActiveState(itemUrl, pageUrl) {
        let response = '';

        if (itemUrl === pageUrl) {
            response = ' aria-current="page"';
        }

        if (itemUrl.length > 1 && pageUrl.includes(itemUrl)) {
            response += ' data-state="active"';
        }

        return response;
    },

    /**
     * Returns active class if page is active
     *
     * @param {String} itemUrl The link in question
     * @param {String} pageUrl The page context
     * @returns {String} A class or undefined
     */
    getLinkActiveClass(itemUrl, pageUrl) {
        if (itemUrl === pageUrl) {
            return 'nav__item--active';
        } else if (itemUrl.length > 1 && pageUrl.includes(itemUrl)) {
            return 'nav__link--active';
        }

        return '';
    },

    /**
     * Returns true if link is current page link
     *
     * @param {String} itemUrl The link in question
     * @param {String} pageUrl The page context
     * @returns {Boolean} A class or undefined
     */
    linkIsActiveLink(itemUrl, pageUrl) {
        return (itemUrl === pageUrl);
    }
};
