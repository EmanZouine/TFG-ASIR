/* Función para copiar el contenido de un elemento <pre>*/
function copyToClipboard(preId) {
    var pre = document.getElementById(preId); /* Obtiene el elemento <pre> por su ID */
    var range = document.createRange(); /* Crea un nuevo rango de selección */
    range.selectNode(pre); /* Selecciona el contenido del elemento <pre> */
    window.getSelection().addRange(range); /* Añade el rango a la selección actual */
    try {
        document.execCommand('copy'); /* Copia el contenido seleccionado al portapapeles */
        mostrarMensaje(); /* Muestra el mensaje de confirmación */
    } catch (err) {
        console.error('Error al copiar el texto: ', err); /* Muestra un error en la consola si la copia falla */
    }
    window.getSelection().removeAllRanges(); /* Elimina todas las selecciones de rango */
}

/* Función para mostrar un mensaje temporalmente */
function mostrarMensaje() {
    var mensaje = document.getElementById('mensaje'); /* Obtiene el elemento del mensaje por su ID */
    mensaje.classList.add('mostrar'); /* Añade la clase 'mostrar' para hacer visible el mensaje */
    setTimeout(function() {
        mensaje.classList.remove('mostrar'); /* Elimina la clase 'mostrar' después de 5 segundos */
    }, 5000);
}
