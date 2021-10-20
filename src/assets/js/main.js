document.addEventListener("DOMContentLoaded", () => {
    const switchBox = document.querySelector('#switch');
    const urlSearchParams = new URLSearchParams(window.location.search);
    let themeAlreadySet = false;
    if (urlSearchParams) {
        const params = Object.fromEntries(urlSearchParams.entries());
        if (params.mode) {
            if (params.mode === 'dark') {
                switchBox.setAttribute('checked', '');
            } else {
                switchBox.removeAttribute('checked');
            }

            themeAlreadySet = true;
        }
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').media && !themeAlreadySet) {
        switchBox.setAttribute('checked', '');
    }

});
