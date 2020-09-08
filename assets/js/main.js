console.log('hi')

document.addEventListener("DOMContentLoaded", function (event) {
    console.log('hi')
    const switchBox = document.querySelector('#switch');
    const body = document.querySelector('body');
    switchBox.addEventListener('click', (event) => {
        console.log(event);
        if (body.classList.contains('light-theme')) {
            console.log(body.classList);
            body.classList.toggle('light-theme', false);
            body.classList.toggle('dark-theme', true);
        }
        if (body.classList.contains('dark-theme')) {
            body.classList.toggle('light-theme', true);
            body.classList.toggle('dark-theme', false);
        }

    });
});