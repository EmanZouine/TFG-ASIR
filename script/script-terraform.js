document.addEventListener("DOMContentLoaded", function() {
  const formContainer = document.querySelector('.contenedor_formulario');
  const cantidadInstanciasSelect = document.querySelector('#cantidad_instancias');

  // Función para crear cajas de formulario
  function crearCajaFormulario(cantidad) {
      for (let i = 0; i < cantidad; i++) {
          const formularioHTML = `
          <div class="formulario_individual">
              <p class="num_form">Instancia ${i+1}</p>
              <input type="text" class="nombre_instancia" placeholder="Nombre de la instancia">
              <select class="sistema_operativo">
                  <option value="Windows">Windows</option>
                  <option value="Linux">Linux</option>
              </select>
          </div>
          `;
          // Insertar después del desplegable dentro del div .formulario
          const formularioContainer = formContainer.querySelector('#enviar_btn');
          formularioContainer.insertAdjacentHTML('beforebegin', formularioHTML);
      }
  }

  // Evento change en el desplegable de cantidad de instancias
  cantidadInstanciasSelect.addEventListener('change', function() {
      const cantidad = parseInt(cantidadInstanciasSelect.value);
      // Limpiar cajas de formulario anteriores
      const cajasFormulario = document.querySelectorAll('.formulario_individual');
      cajasFormulario.forEach(function(caja) {
          caja.remove();
      });
      // Crear nuevas cajas de formulario
      crearCajaFormulario(cantidad);
  });

  // Evento click en el botón de enviar
  const enviarBtn = document.querySelector('#enviar_btn');
  enviarBtn.addEventListener('click', function() {
      const nombreInstancias = document.querySelectorAll('.nombre_instancia');
      const sistemaOperativo = document.querySelectorAll('.sistema_operativo');
      const outputDiv = document.querySelector('.output');
      outputDiv.innerHTML = ''; // Limpiar salida anterior

      nombreInstancias.forEach(function(instancia, index) {
          const nombre = instancia.value;
          const sistema = sistemaOperativo[index].value;
          outputDiv.innerHTML += `<p>Instancia ${index + 1}: Nombre - ${nombre}, Sistema Operativo - ${sistema}</p>`;
      });
  });
});

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
