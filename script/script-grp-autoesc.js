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
                <p class="num_form">Grupo de autoescalado ${i + 1}</p>
                <input type="text" class="nombre" placeholder="Nombre del grupo de autoescalado" required>

                <input type="text" class="subred_nom" placeholder="Nombre de la subred" required>
  
                <label for="des_cant">Cantidad de instancias deseada:</label>
                <select class="des_cant">
                    <option selected>- Selecciona -</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>

                <label for="max_cant">Cantidad máxima de instancias:</label>
                <select class="max_cant">
                    <option selected>- Selecciona -</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>

                <label for="min_cant">Cantidad mínima de instancias:</label>
                <select class="min_cant">
                    <option selected>- Selecciona -</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
  
                <input type="text" class="nombre_plantilla" placeholder="Nombre de la plantilla AMI" required>
  
                <input type="text" class="etiq_nom" placeholder="Etiqueta nombre" required>
            </div>
            `;
            /*Inserta el formulario generado antes del botón para enviar*/
            const enviarBtn = formContainer.querySelector('#enviar_btn');
            enviarBtn.insertAdjacentHTML('beforebegin', formularioHTML);
        }
  
        /*Valida que los campos no tengan carácteres que no sean números, letras o guión bajo*/
        document.querySelectorAll('.nombre, .nombre_plantilla, .subred_nom').forEach(input => {
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
            const subredNom = document.querySelectorAll('.subred_nom');
            const cantDes = document.querySelectorAll('.des_cant');
            const cantMax = document.querySelectorAll('.max_cant');
            const cantMin = document.querySelectorAll('.min_cant');
            const nomPlantilla = document.querySelectorAll('.nombre_plantilla');
            const etiquetaNombre = document.querySelectorAll('.etiq_nom');
            /*Limpia el contenedor de la salida del contenido*/
            outputDiv.innerHTML = ''; 
            
            /*Recoge los datos de cada formulario y los añade a una variable*/
            nombre.forEach(function(nombreFuncion, index) { 
                const nombre_gat = nombreFuncion.value;
                const subnom = subredNom[index].value;
                const descan = cantDes[index].value;
                const maxcan= cantMax[index].value;
                const mincan = cantMin[index].value;
                const nomplan = nomPlantilla[index].value;
                const etqnom = etiquetaNombre[index].value;
  
                /*Se genera y añade al contenedor de la salida el código de terraform con las variables seleccionadas antes*/
                outputDiv.innerHTML += `
<p>
<span class="morado">#Grupo de autoescalado ${index + 1}:</span> <br/>
<span class="amarillo">resource</span> "aws_autoscaling_group" "${nombre_gat}" <span class="amarillo">{</span> <br/>
<span class="celeste">name </span><span class="naranja">=</span> <span class="verde">"${nombre_gat}"</span> <br/>
<span class="celeste">vpc_zone_identifier</span> <span class="naranja">=</span> <span class="rosa">[</span><span class="celeste">aws_subnet</span><span class="naranja">.</span>${subnom}<span class="naranja">.</span>id<span class="rosa">]</span> <br/>
<span class="celeste">desired_capacity</span> <span class="naranja">=</span> <span class="rojo">${descan}</span> <br/>
<span class="celeste">max_size</span> <span class="naranja">=</span> <span class="rojo">${maxcan}</span> <br/>
<span class="celeste">min_size</span> <span class="naranja">=</span> <span class="rojo">${mincan}</span> <br/>
<span class="celeste">EC2</span> <span class="naranja">=</span> <span class="verde">"EC2"</span> <br/>
<span class="amarillo">launch_template</span> <span class="rosa">{</span> <br/>
<span class="celeste">id</span> <span class="naranja">=</span> <span class="celeste">aws_launch_template</span><span class="naranja">.</span>${nomplan}<span class="naranja">.</span>id <br/>
<span class="rosa">}</span><br/>
<span class="amarillo">tag</span> <span class="rosa">{</span> <br/>
<span class="celeste">key </span><span class="naranja">=</span> <span class="verde">"Name"</span> <br/>
<span class="celeste">value</span> <span class="naranja">=</span> <span class="verde">"${etqnom}"</span> <br/>
<span class="celeste">propagate_at_launch </span><span class="naranja">=</span> <span class="rojo">true</span> <br/>
<span class="rosa">}</span><br/>
<span class="amarillo">}</span><br/><br/>
</p>
                `;
            });
        }
    });
});


