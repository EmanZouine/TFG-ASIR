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
                <p class="num_form">Bucket ${i + 1}</p>
                <input type="text" class="nombre" placeholder="Nombre del bucket" required>
                <input type="text" class="nom_dir" placeholder="Nombre del directorio donde están tus ficheros" required>
                <input type="text" class="etiq_nom" placeholder="Etiqueta nombre" required>
            </div>
            `;
            /*Inserta el formulario generado antes del botón para enviar*/
            const enviarBtn = formContainer.querySelector('#enviar_btn');
            enviarBtn.insertAdjacentHTML('beforebegin', formularioHTML);
        }
  
        /*Valida que los campos no tengan carácteres que no sean números, letras o guión bajo*/
        document.querySelectorAll('.nom_dir').forEach(input => {
            input.addEventListener('input', function() {
                if (!/^[a-zA-Z0-9_]*$/.test(input.value)) {
                    input.setCustomValidity('El campo solo puede contener letras, números y guiones bajos (_).');
                } else {
                    input.setCustomValidity('');
                }
            });
        });

        /*Valida que el nombre tenga solo numeros y letras en minúscula*/
        document.querySelectorAll('.nombre').forEach(input => {
            input.addEventListener('input', function() {
                if (!/^[a-z0-9]*$/.test(input.value)) {
                    input.setCustomValidity('El campo solo puede contener letras minúsculas y números.');
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
        /*Limpia las cajas de formularios que estaban anteriormente*/
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
            const nombredirectorio = document.querySelectorAll('.nom_dir');
            const etiquetaNombre = document.querySelectorAll('.etiq_nom');

            /*Limpia el contenedor de la salida del contenido*/
            outputDiv.innerHTML = ''; 
            
            /*Recoge los datos de cada formulario y los añade a una variable*/
            nombre.forEach(function(nombreFuncion, index) { 
                const nombre_buck = nombreFuncion.value;
                const nomdir = nombredirectorio[index].value;
                const etqnom = etiquetaNombre[index].value;
  
                /*Se genera y añade al contenedor de la salida el código de terraform con las variables seleccionadas antes*/
                outputDiv.innerHTML += `
<pre>
<span class="morado">#Bucket ${index + 1}:</span> 
<span class="amarillo">resource</span> "aws_s3_bucket" "${nombre_buck}" <span class="amarillo">{</span> 
    <span class="celeste">bucket</span> <span class="naranja">=</span> <span class="verde">"${nombre_buck}"</span> 

    <span class="celeste">tags</span> <span class="naranja">=</span> <span class="rosa">{</span>
        <span class="celeste">Name</span> <span class="naranja">=</span> <span class="verde">"${etqnom}"</span>
    <span class="rosa">}</span>
<span class="amarillo">}</span>

<span class="amarillo">resource</span> "aws_s3_object" "${nombre_buck}_objects" <span class="amarillo">{</span> 
    <span class="celeste">for_each</span> <span class="naranja">=</span> <span class="naranja">fileset</span><span class="rosa">(</span><span class="verde">"${nomdir}/"</span>, <span class="verde">"**/*"</span><span class="rosa">)</span> 
    <span class="celeste">bucket</span> <span class="naranja">=</span> <span class="celeste">aws_s3_bucket</span><span class="naranja">.</span>${nombre_buck}<span class="naranja">.</span>id 
    <span class="celeste">key</span> <span class="naranja">=</span> <span class="celeste">each</span><span class="naranja">.</span>value 
    <span class="celeste">source</span> <span class="naranja">=</span> <span class="verde">"${nomdir}/</span><span class="naranja">\$\{</span><span class="celeste">each</span><span class="naranja">.</span>value<span class="naranja">}</span><span class="verde">"</span> 
<span class="amarillo">}</span></br>
</pre>
                `;
            });
        }
    });

    /* Limpiar los campos del formulario al cargar la página */
    document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);

});
