document.addEventListener("DOMContentLoaded", function() {
    const formContainer = document.querySelector('.contenedor_formulario'); /* Contenedor donde se añadirán los formularios generados */
    const cantidadForm = document.querySelector('#cantidad'); /* Desplegable de cantidad elegida */
    const outputDiv = document.querySelector('#output'); /* Contenedor donde se añade la salida de código generada */

    /* Función para crear las cajas del formulario */
    function crearCajaFormulario(cantidad) {
        /* Bucle para crear las cajas de formulario según la cantidad que se ha elegido */
        for (let i = 0; i < cantidad; i++) {
            const formularioHTML = `
            <div class="formulario_individual">
                <p class="num_form">Instancia ${i + 1}</p>
                <input type="text" class="nombre" placeholder="Nombre de la instancia" required>
            </div>
            `;
            /* Inserta el formulario generado antes del botón para enviar */
            const enviarBtn = formContainer.querySelector('#enviar_btn');
            enviarBtn.insertAdjacentHTML('beforebegin', formularioHTML);
        }

        /* Añadir validación a los nuevos campos creados */
        document.querySelectorAll('.nombre').forEach(input => {
            input.addEventListener('input', function() {
                if (!/^[a-zA-Z0-9_]*$/.test(input.value)) {
                    input.setCustomValidity('El campo solo puede contener letras, números y guiones bajos (_).');
                    input.reportValidity();
                } else {
                    input.setCustomValidity('');
                }
            });
        });
    }

    /* Función para añadir validación a los campos individuales */
    function añadirValidaciónIndividual() {
        const campos = ['.nombre-lb', '.nombre-lb-tg', '.vpc', '.etq_nom', '.subred', ".grp-seg"];
        campos.forEach(selector => {
            const input = document.querySelector(selector);
            if (input) {
                input.addEventListener('input', function() {
                    let regex;
                    let mensajeError;

                    if (selector === '.subred' || selector === '.grp-seg'){
                        regex = /^[a-zA-Z0-9_, ]*$/;
                        mensajeError = 'El campo solo puede contener letras, números, guiones bajos (_), comas y espacios.';
                    } else {
                        regex = /^[a-zA-Z0-9_]*$/;
                        mensajeError = 'El campo solo puede contener letras, números y guiones bajos (_).';
                    }

                    if (!regex.test(input.value)) {
                        input.setCustomValidity(mensajeError);
                        input.reportValidity();
                    } else {
                        input.setCustomValidity('');
                    }
                });
            }
        });
        

    }

    /* Detecta si el desplegable de cantidades ha sufrido algún cambio */
    cantidadForm.addEventListener('change', function() {
        /* Obtiene la cantidad seleccionada del desplegable */
        const cantidad = parseInt(cantidadForm.value);
        /* Limpia las cajas de formularios que estaban anteriormente */
        document.querySelectorAll('.formulario_individual').forEach(caja => caja.remove());
        /* Limpia el contenedor de la salida del contenido */
        outputDiv.innerHTML = '';
        /* Crea nuevos formularios llamando a la función */
        crearCajaFormulario(cantidad);
    });

    /* Detecta si se cliquea en el botón enviar */
    document.querySelector('#enviar_btn').addEventListener('click', function(event) {
        /* Evita que se envíe el formulario */
        event.preventDefault();

        const formFields = document.querySelectorAll('.form_est input, .formulario_individual input');
        /* Variable booleana que se encarga de la comprobación de los campos */
        let allValid = true;

        /* Validación de que los campos tienen buenos nombres */
        formFields.forEach(field => {
            if (!field.checkValidity()) {
                /* Si algún campo no es válido, establecer allValid a false */
                allValid = false;
                /* Muestra los mensajes en caso de no ser válido el campo */
                field.reportValidity();
            }
        });

        /* Si todos los campos son válidos se ejecuta lo siguiente */
        if (allValid) {
            const nombreLb = document.querySelector('.nombre-lb').value;
            const nombreLbTg = document.querySelector('.nombre-lb-tg').value;
            const intLb = document.querySelector('#intlb').checked;
            const grpSeg = document.querySelector('.grp-seg').value.split(" ").map(gs => `aws_security_group.${gs}.id`).join(", ");
            const subredes = document.querySelector('.subred').value.split(" ").map(subred => `aws_subnet.${subred}.id`).join(", ");
            const vpc = document.querySelector('.vpc').value;
            const etqNom = document.querySelector('.etq_nom').value;

            /* Limpia el contenedor de la salida del contenido */
            outputDiv.innerHTML = '';

            /* Añade la salida de los campos estáticos */
            outputDiv.innerHTML += `
<pre>

<span class="morado">#Balanceador de carga:</span>
<span class="amarillo">resource</span> "aws_lb" "${nombreLb}" <span class="amarillo">{</span>
    <span class="celeste">name </span><span class="naranja">=</span> <span class="verde">"${nombreLb}"</span>
    <span class="celeste">load_balancer_type</span> <span class="naranja">=</span> <span class="verde">"application"</span>
    <span class="celeste">internal</span> <span class="naranja">=</span> <span class="rojo">${intLb}</span>
    <span class="celeste">security_groups</span> <span class="naranja">=</span> <span class="rosa">[</span>${grpSeg}<span class="rosa">]</span>
    <span class="celeste">subnets</span> <span class="naranja">=</span> <span class="rosa">[</span>${subredes}<span class="rosa">]</span>

    <span class="celeste">tags</span> <span class="naranja">=</span> <span class="rosa">{</span>
        <span class="celeste">Name</span> <span class="naranja">=</span> <span class="verde">"${etqNom}"</span>
    <span class="rosa">}</span>
<span class="amarillo">}</span>

<span class="morado">#Target Group:</span>
    <span class="amarillo">resource</span> "aws_lb_target_group" "${nombreLbTg}" <span class="amarillo">{</span>
    <span class="celeste">name </span><span class="naranja">=</span> <span class="verde">"${nombreLbTg}"</span>
    <span class="celeste">port</span> <span class="naranja">=</span> <span class="rojo">80</span>
    <span class="celeste">protocol</span> <span class="naranja">=</span> <span class="verde">"HTTP"</span>
    <span class="celeste">target_type</span> <span class="naranja">=</span> <span class="verde">"instance"</span>
    <span class="celeste">vpc_id</span> <span class="naranja">=</span> <span class="celeste">aws_vpc</span><span class="naranja">.</span>${vpc}<span class="naranja">.</span>id 
<span class="amarillo">}</span>

<span class="morado">#Listener del balanceador de carga:</span>
<span class="amarillo">resource</span> "aws_lb_listener" "${nombreLb}_lstnr" <span class="amarillo">{</span>
    <span class="celeste">load_balancer_arn</span> <span class="naranja">=</span> <span class="celeste">aws_lb</span><span class="naranja">.</span>${nombreLb}<span class="naranja">.</span>arn
    <span class="celeste">port</span> <span class="naranja">=</span> <span class="rojo">80</span>
    <span class="celeste">protocol</span> <span class="naranja">=</span> <span class="verde">"HTTP"</span>

    <span class="amarillo">default_action</span> <span class="rosa">{</span>
        <span class="celeste">type </span><span class="naranja">=</span> <span class="verde">"forward"</span>
        <span class="celeste">target_group_arn</span> <span class="naranja">=</span> <span class="celeste">aws_lb_target_group</span><span class="naranja">.</span>${nombreLbTg}<span class="naranja">.</span>arn
    <span class="rosa">}</span>
<span class="amarillo">}</span>
</pre>
            `;

            /* Recoge los datos de cada formulario dinámico y los añade a la salida */
            const nombres = document.querySelectorAll('.nombre');
            nombres.forEach(function(nombreFuncion, index) {
                const nombreIns = nombreFuncion.value;
                outputDiv.innerHTML += `
<pre>
<span class="morado">#Instancia ${index + 1}:</span>
    <span class="amarillo">resource</span> "aws_lb_target_group_attachment" "${nombreLbTg}_${nombreIns}_attach" <span class="amarillo">{</span>
    <span class="celeste">target_group_arn</span> <span class="naranja">=</span> <span class="celeste">aws_lb_target_group</span><span class="naranja">.</span>${nombreLbTg}<span class="naranja">.</span>arn
    <span class="celeste">target_id</span> <span class="naranja">=</span> <span class="celeste">aws_instance</span><span class="naranja">.</span>${nombreIns}<span class="naranja">.</span>id
    <span class="celeste">port</span> <span class="naranja">=</span> <span class="rojo">80</span>
<span class="amarillo">}</span></br>
</pre>
                `;
            });
        }
    });

    /* Inicializa la validación de los campos existentes */
    añadirValidaciónIndividual();

    /* Limpiar los campos del formulario al cargar la página */
    function limpiarFormulario() {
        document.querySelectorAll('input').forEach(input => input.value = '');
        document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
    }

    limpiarFormulario();
});
