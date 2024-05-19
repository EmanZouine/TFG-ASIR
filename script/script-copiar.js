// Obtener el botón y el elemento de salida
var botonCopiar = document.getElementById("boton-copiar");
var output = document.getElementById("output");
var mensaje = document.getElementById("mensaje");

// Función para mostrar el mensaje
function mostrarMensaje() {
  mensaje.classList.add("mostrar");
  setTimeout(function() {
    mensaje.classList.remove("mostrar");
  }, 3000); // El mensaje se ocultará después de 3 segundos
}

// Agregar un evento de clic al botón
botonCopiar.addEventListener("click", function() {
  // Crear un rango de selección
  var range = document.createRange();
  // Seleccionar el texto dentro del elemento de salida
  range.selectNode(output);
  // Agregar el rango de selección a la selección actual
  window.getSelection().addRange(range);
  // Copiar el texto seleccionado
  document.execCommand("copy");
  // Limpiar la selección
  window.getSelection().removeAllRanges();
  // Mostrar el mensaje discreto
  mostrarMensaje();
});