// Corre en el <head>, antes de pintar, para evitar el parpadeo de tema
(function () {
  var guardado = null;
  try {
    guardado = localStorage.getItem('tema');
  } catch (error) {
    guardado = null;
  }
  var root = document.documentElement;
  if (guardado === 'light' || guardado === 'dark') {
    root.dataset.theme = guardado;
  }
  var oscuro = guardado
    ? guardado === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.classList.toggle('is-dark', oscuro);
})();
