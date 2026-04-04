document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('time[datetime]').forEach(el => {
    const date = new Date(el.getAttribute('datetime') + 'T00:00:00');
    if (!isNaN(date)) {
      const locale = document.documentElement.lang || navigator.language;
      el.textContent = new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }
  });
});
