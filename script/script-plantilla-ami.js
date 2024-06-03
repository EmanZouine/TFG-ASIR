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
                <p class="num_form">Plantilla AMI ${i + 1}</p>
                <input type="text" class="nombre" placeholder="Nombre de la plantilla" required>
  
                <label for="sistema_operativo">Sistema Operativo:</label>
                <select class="sistema_operativo" required>
                  <option value="" selected>- Selecciona -</option>
                  <option value="ami-058bd2d568351da34">Debian 12</option>
                  <option value="ami-04b70fa74e45c3917">Ubuntu Server 24.04</option>
                  <option value="ami-0e001c9271cf7f3b9">Ubuntu Server 22.04</option>
                  <option value="ami-0bb84b8ffd87024d8">AWS Linux</option>
                  <option value="ami-0fe630eb857a6ec83">Red Hat</option>
                  <option value="ami-0e938238a19f40e09">macOS Sonoma</option>
                  <option value="ami-0f496107db66676ff">Windows Server 2022</option>
                  <option value="ami-0a62069ec7788c8be">Windows Server 2019</option>             
                </select>
  
                <label for="tipo_instancia">Tipo de instancia:</label>
                <select class="tipo_plant" required>
                  <option value="" selected>- Selecciona -</option>
                  <option value="t2.nano">T2 nano</option>
                  <option value="t2.micro">T2 micro</option>
                  <option value="t2.small">T2 small</option>
                  <option value="t2.medium">T2 medium</option>
                  <option value="t2.large">T2 large</option>
                </select>
  
                <input type="text" class="nombre_claves" placeholder="Nombre de las claves SSH" required>
  
                <input type="text" class="user_data" placeholder="Nombre del fichero user data" required>
  
                <input type="text" class="grseg_nom" placeholder="Nombre grupo seguridad  |  GS_1  GS_2" required>
  
                <input type="text" class="etiq_nom" placeholder="Etiqueta nombre" required>
            </div>
            `;
            /*Inserta el formulario generado antes del botón para enviar*/
            const enviarBtn = formContainer.querySelector('#enviar_btn');
            enviarBtn.insertAdjacentHTML('beforebegin', formularioHTML);
        }
  
        /*Valida que los campos no tengan carácteres que no sean números, letras o guión bajo*/
        document.querySelectorAll('.nombre, .nombre_claves, .user_data, .grseg_nom').forEach(input => {
            input.addEventListener('input', function() {
                if (!/^[a-zA-Z0-9_]*$/.test(input.value)) {
                    input.setCustomValidity('El campo solo puede contener letras, números y guiones bajos (_).');
                } else {
                    input.setCustomValidity('');
                }
            });
        });

        /*Permite espacios en el campo de grupo de seguridad*/
        document.querySelectorAll('.grseg_nom').forEach(input => {
            input.addEventListener('input', function() {
                if (!/^[a-zA-Z0-9_ ]*$/.test(input.value)) {
                    input.setCustomValidity('El campo solo puede contener letras, números, guiones bajos (_) y espacios.');
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
            const sistemaOperativo = document.querySelectorAll('.sistema_operativo');
            const tipoPlant = document.querySelectorAll('.tipo_plant');
            const nombreClaves = document.querySelectorAll('.nombre_claves');
            const userData = document.querySelectorAll('.user_data');
            const grupoSeguridad = document.querySelectorAll('.grseg_nom');
            const etiquetaNombre = document.querySelectorAll('.etiq_nom');
            /*Limpia el contenedor de la salida del contenido*/
            outputDiv.innerHTML = ''; 
            
            /*Recoge los datos de cada formulario y los añade a una variable*/
            nombre.forEach(function(nombreFuncion, index) { 
                const nombre = nombreFuncion.value;
                const sistema = sistemaOperativo[index].value;
                const tipoplant = tipoPlant[index].value;
                const nomclv = nombreClaves[index].value;
                const userdata = userData[index].value;
                const grpseg = grupoSeguridad[index].value.split(" ").map(gs => `aws_security_group.${gs}.id`).join(", ");
                const etqnom = etiquetaNombre[index].value;
  
                /*Se genera y añade al contenedor de la salida el código de terraform con las variables seleccionadas antes*/
                outputDiv.innerHTML += `
<pre>
<span class="morado">#Plantilla AMI ${index + 1}:</span> 
<span class="amarillo">resource</span> "aws_launch_template" "${nombre}" <span class="amarillo">{</span> 
    <span class="celeste">name_prefix </span><span class="naranja">=</span> <span class="verde">"${nombre}"</span> 
    <span class="celeste">image_id </span><span class="naranja">=</span> <span class="verde">"${sistema}"</span> 
    <span class="celeste">instance_type</span> <span class="naranja">=</span> <span class="verde">"${tipoplant}"</span> 
    <span class="celeste">key_name</span> <span class="naranja">=</span> <span class="verde">"${nomclv}"</span> 
    <span class="celeste">user_data</span> <span class="naranja">= filebase64</span><span class="rosa">(</span><span class="verde">"${userdata}.sh"</span><span class="rosa">)</span> 
    <span class="celeste">vpc_security_group_ids</span> <span class="naranja">=</span> <span class="rosa">[</span>${grpseg}<span class="rosa">]</span> 

    <span class="amarillo">tag_specifications</span> <span class="rosa">{</span> 
        <span class="celeste">resource_type  </span><span class="naranja">=</span> <span class="verde">"instance"</span> 
        <span class="celeste">tags</span> <span class="naranja">=</span> <span class="azul">{</span> </br>
            <span class="celeste">Name</span> <span class="naranja">=</span> <span class="verde">"${etqnom}"</span> 
        <span class="azul">}</span>
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


