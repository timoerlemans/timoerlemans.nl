document.addEventListener("DOMContentLoaded", () => {
    const switchBox = document.querySelector('#switch');
    if (window.matchMedia('(prefers-color-scheme: dark)').media === 'not all') {
        switchBox.toggleAttribute('checked');
    }
});
