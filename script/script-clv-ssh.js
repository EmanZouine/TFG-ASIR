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
                <p class="num_form">Clave SSH ${i + 1}</p>
                <input type="text" class="nombre" placeholder="Nombre del par de claves SSH" required>
                <input type="text" class="nom_fich" placeholder="Nombre del fichero clave privada" required>
            </div>
            `;
            /*Inserta el formulario generado antes del botón para enviar*/
            const enviarBtn = formContainer.querySelector('#enviar_btn');
            enviarBtn.insertAdjacentHTML('beforebegin', formularioHTML);
        }
  
        /*Valida que los campos no tengan carácteres que no sean números, letras o guión bajo*/
        document.querySelectorAll('.nombre, .nom_fich').forEach(input => {
            input.addEventListener('input', function() {
                if (!/^[a-zA-Z0-9_]*$/.test(input.value)) {
                    input.setCustomValidity('El campo solo puede contener letras, números y guiones bajos (_).');
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
            const nombrefichero = document.querySelectorAll('.nom_fich');
            /*Limpia el contenedor de la salida del contenido*/
            outputDiv.innerHTML = ''; 
            
            /*Recoge los datos de cada formulario y los añade a una variable*/
            nombre.forEach(function(nombreFuncion, index) { 
                const nombre_clv = nombreFuncion.value;
                const nomfich = nombrefichero[index].value;
  
                /*Se genera y añade al contenedor de la salida el código de terraform con las variables seleccionadas antes*/
                outputDiv.innerHTML += `
<p>
<span class="morado">#Clave SSH ${index + 1}:</span> <br/>
<span class="amarillo">resource</span> "tls_private_key" "${nombre_clv}" <span class="amarillo">{</span> <br/>
<span class="celeste">algorithm</span> <span class="naranja">=</span> <span class="verde">"RSA"</span> <br/>
<span class="celeste">rsa_bits</span> <span class="naranja">=</span> <span class="rojo">2048</span> <br/>
<span class="amarillo">}</span><br/><br/>

<span class="amarillo">resource</span> "local_file" "${nombre_clv}_file" <span class="amarillo">{</span> <br/>
<span class="celeste">content</span> <span class="naranja">=</span> <span class="celeste">tls_private_key</span><span class="naranja">.</span>${nombre_clv}<span class="naranja">.</span>private_key_pem <br/>
<span class="celeste">filename</span> <span class="naranja">=</span> <span class="verde">"${nomfich}.pem"</span> <br/>
<span class="amarillo">}</span><br/><br/>

<span class="amarillo">resource</span> "aws_key_pair" "${nombre_clv}" <span class="amarillo">{</span> <br/>
<span class="celeste">key_name</span> <span class="naranja">=</span> <span class="verde">"${nombre_clv}"</span> <br/>
<span class="celeste">public_key</span> <span class="naranja">=</span> <span class="celeste">tls_private_key</span><span class="naranja">.</span>${nombre_clv}<span class="naranja">.</span>public_key_openssh <br/>
<span class="amarillo">}</span><br/><br/>

</p>
                `;
            });
        }
    });
});
