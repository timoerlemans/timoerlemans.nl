document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('time[datetime]').forEach(el => {
    const date = new Date(el.getAttribute('datetime') + 'T00:00:00');
    if (!isNaN(date)) {
      el.textContent = new Intl.DateTimeFormat(navigator.language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }
  });

  const switchBox = document.querySelector('#switch');
  const urlSearchParams = new URLSearchParams(window.location.search);
  const storedTheme = localStorage.getItem('theme');
  let themeAlreadySet = false;

  if (urlSearchParams) {
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.mode) {
      if (params.mode === 'dark') {
        switchBox.setAttribute('checked', '');
      } else {
        switchBox.removeAttribute('checked');
      }
      localStorage.setItem('theme', params.mode);
      themeAlreadySet = true;
    }
  }

  if (!themeAlreadySet && storedTheme) {
    if (storedTheme === 'dark') {
      switchBox.setAttribute('checked', '');
    } else {
      switchBox.removeAttribute('checked');
    }
    themeAlreadySet = true;
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches && !themeAlreadySet) {
    switchBox.setAttribute('checked', '');
  }

  switchBox.addEventListener('change', () => {
    localStorage.setItem('theme', switchBox.checked ? 'dark' : 'light');
  });
});
