function copyToClipboard(preId) {
  var pre = document.getElementById(preId);
  var range = document.createRange();
  range.selectNode(pre);
  window.getSelection().addRange(range);
  try {
      document.execCommand('copy');
      mostrarMensaje();
  } catch (err) {
      console.error('Error al copiar el texto: ', err);
  }
  window.getSelection().removeAllRanges();
}

function mostrarMensaje() {
  var mensaje = document.getElementById('mensaje');
  mensaje.classList.add('mostrar');
  setTimeout(function() {
      mensaje.classList.remove('mostrar');
  }, 5000);
}
