document.addEventListener("DOMContentLoaded", function() {
    const formContainer = document.querySelector('.contenedor_formulario'); /*Contenedor donde se añadiran los formularios generados*/
    const cantidadForm = document.querySelector('#cantidad'); /*Desplegable de cantidad elegida*/
    const outputDiv = document.querySelector('#output'); /*Contenedor donde se añade la salida de código generada*/

    /*Función para crear las cajas del formulario*/
    function crearCajaFormulario(cantidad) {
        /*Bucle para crear las cajas de formulario según la cantidad que se ha elegido*/
        for (let i = 0; i < cantidad; i++) { 
            const formularioHTML = `
            <div class="formulario_individual">
                <p class="num_form">Subred ${i + 1}</p>
                <input type="text" class="nombre" placeholder="Nombre de la subred" required>
                <input type="text" class="vpc_nom" placeholder="Nombre de la VPC" required>
                <input type="text" class="cidr" placeholder="Bloque CIDR  |  Ej: 192.168.10.0/24" required>
                <label for="avai_zone">Zona de disponibilidad:</label>
                <select class="avai_zone" required>
                  <option value="" selected>- Selecciona -</option>
                  <option value="us-east-1a">us east 1a</option>
                  <option value="us-east-1b">us east 1b</option>
                  <option value="us-east-1c">us east 1c</option>
                  <option value="us-east-1d">us east 1d</option>
                  <option value="us-east-1e">us east 1e</option>
                  <option value="us-east-1f">us east 1f</option>
                </select>
                <input type="text" class="etiq_nom" placeholder="Etiqueta nombre" required>
            </div>
            `;
            /*Inserta el formulario generado antes del botón para enviar*/
            const enviarBtn = formContainer.querySelector('#enviar_btn');
            enviarBtn.insertAdjacentHTML('beforebegin', formularioHTML);
        }
  
        /*Valida que los campos no tengan carácteres que no sean números, letras o guión bajo*/
        document.querySelectorAll('.nombre, .vpc_nom').forEach(input => {
            input.addEventListener('input', function() {
                if (!/^[a-zA-Z0-9_]*$/.test(input.value)) {
                    input.setCustomValidity('El campo solo puede contener letras, números y guiones bajos (_).');
                } else {
                    input.setCustomValidity('');
                }
            });
        });
  
        /*Valida que la IP no tenga letras o otros carácteres que no sean números y puntos*/
        document.querySelectorAll('.cidr').forEach(input => {
            input.addEventListener('input', function() {
                const regex = /^[\d./]*$/;
                if (!regex.test(input.value)) {
                    input.setCustomValidity('El bloque CIDR solo puede contener números, puntos (.) y barras (/).');
                } else {
                    input.setCustomValidity('');
                }
            });
        });
    }
  
    /*Detecta si el desplegable de cantidades ha sufrido algún cambio*/
    cantidadForm.addEventListener('change', function() {
        /*Obtiene la cantidad seleccionada del desplegable*/
        const cantidad = parseInt(cantidadForm.value); 
        /*Limpia las cajas de formualrios que estaban anteriormente*/
        document.querySelectorAll('.formulario_individual').forEach(caja => caja.remove());
        /*Limpia el contenedor de la salida del contenido*/
        document.querySelector('#output').innerHTML = '';
        /*Crea nuevos formularios llamando a la función*/
        crearCajaFormulario(cantidad);
    });
  
    /*Detecta si se cliquea en el botón enviar*/
    document.querySelector('#enviar_btn').addEventListener('click', function(event) {
        /*Evita que se envie el formulario*/
        event.preventDefault(); 
  
        const formFields = document.querySelectorAll('.formulario_individual input, .formulario_individual select');
        /*Variable boleana que se encarga de la comprobación de los campos*/
        let allValid = true; 
  
        /*Validación de que los campos tienen buenos nombres*/
        formFields.forEach(field => {
            if (!field.checkValidity()) {
                /*Si algún campo no es válido, establecer allValid a false*/
                allValid = false; 
                /*Muestra los mensajes en caso de no ser válido el campo*/
                field.reportValidity(); 
            }
        });
  
        /*Si todos los campos son válidos se ejecuta lo siguiente*/
        if (allValid) {
            const nombre = document.querySelectorAll('.nombre');
            const vpcnombre = document.querySelectorAll('.vpc_nom');
            const cidr_bl = document.querySelectorAll('.cidr');
            const availablezone = document.querySelectorAll('.avai_zone');
            const etiquetaNombre = document.querySelectorAll('.etiq_nom');
            /*Limpia el contenedor de la salida del contenido*/
            outputDiv.innerHTML = '';
  
            /*Recoge los datos de cada formulario y los añade a una variable*/
            nombre.forEach(function(nombreFuncion, index) {
                const nombre_sub = nombreFuncion.value;
                const vpcnom = vpcnombre[index].value;
                const cidr_block = cidr_bl[index].value;
                const avai_zone = availablezone[index].value;
                const etqnom = etiquetaNombre[index].value;
  
                /*Se genera y añade al contenedor de la salida el código de terraform con las variables seleccionadas antes*/
                outputDiv.innerHTML += `
<pre>
<span class="morado">#Subred ${index + 1}:</span> 
<span class="amarillo">resource</span> "aws_subnet" "${nombre_sub}" <span class="amarillo">{</span> 
    <span class="celeste">vpc_id</span> <span class="naranja">=</span> <span class="celeste">aws_vpc</span><span class="naranja">.</span>${vpcnom}<span class="naranja">.</span>id 
    <span class="celeste">cidr_block</span> <span class="naranja">=</span> <span class="verde">"${cidr_block}"</span> 
    <span class="celeste">availability_zone</span> <span class="naranja">=</span> <span class="verde">"${avai_zone}"</span> 

    <span class="celeste">tags</span> <span class="naranja">=</span> <span class="rosa">{</span>
        <span class="celeste">Name</span> <span class="naranja">=</span> <span class="verde">"${etqnom}"</span>
    <span class="rosa">}</span>
<span class="amarillo">}</span><br/>
</pre>
                `;
            });
        }
    });
    /* Limpiar los campos del formulario al cargar la página */
    document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
});
