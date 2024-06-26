document.addEventListener("DOMContentLoaded", function() {
    const formContainer = document.querySelector('.contenedor_formulario'); /*Contenedor donde se añadiran los formularios generados*/
    const cantidadFormEn = document.querySelector('#cantidad-en'); /*Desplegable de cantidad elegida de reglas de entrada*/
    const cantidadFormSa = document.querySelector('#cantidad-sa'); /*Desplegable de cantidad elegida de reglas de salida*/
    const formulariosEntrada = document.querySelector('#formularios-entrada'); /*Contenedor de reglas de entrada donde se añadiran los formularios generados*/
    const formulariosSalida = document.querySelector('#formularios-salida'); /*Contenedor de reglas de salida donde se añadiran los formularios generados*/
    const outputDiv = document.querySelector('#output'); /*Contenedor donde se añade la salida de código generada*/

    /* Mapeo de puertos para diferentes tipos de tráfico */
    const portMappings = {
        "http": { from: 80, to: 80 },
        "https": { from: 443, to: 443 },
        "tcp": { from: 0, to: 65535 },
        "ssh": { from: 22, to: 22 },
        "dns": { from: 53, to: 53 },
        "smtp": { from: 25, to: 25 },
        "imap": { from: 143, to: 143 },
        "nfs": { from: 2049, to: 2049 },
        "icmp": { from: -1, to: -1 },
        "ftp": { from: 21, to: 21 },
    };

    /*Función para crear las cajas del formulario para las reglas*/
    function crearCajaFormulario(tipo, cantidad) {
        const formularioContainer = tipo === 'entrada' ? formulariosEntrada : formulariosSalida;
        formularioContainer.innerHTML = '';

        /*Bucle para crear las cajas de formulario según la cantidad que se ha elegido*/
        for (let i = 0; i < cantidad; i++) {
            const formularioHTML = `
            <div class="formulario_individual">
                <p class="num_form">Regla ${tipo} ${i + 1}</p>
                <label for="tipo">Tipo:</label>
                <select class="tipo ${tipo}" required>
                  <option value="" selected>- Selecciona -</option>
                  <option value="tcp">TCP personalizado</option>
                  <option value="icmp">ICMP todo el tráfico</option>
                  <option value="ftp">FTP</option>
                  <option value="ssh">SSH</option>
                  <option value="http">HTTP</option>
                  <option value="https">HTTPS</option>
                  <option value="dns">DNS</option>
                  <option value="smtp">SMTP</option>
                  <option value="imap">IMAP</option>
                  <option value="nfs">NFS</option>
                </select>
                <input type="text" class="cidr ${tipo}" placeholder="Bloque CIDR  |  Ej: 192.168.1.0/24" required>
                <div class="tcp-ports ${tipo}">
                    <input type="number" class="from-port ${tipo}" placeholder="From Port" required>
                    <input type="number" class="to-port ${tipo}" placeholder="To Port" required>
                </div>
            </div>
            `;

            /*Inserta el formulario generado antes del formulario HMTL*/
            formularioContainer.insertAdjacentHTML('beforeend', formularioHTML);
        }

        /*Valida que el CIDR no tenga carácteres que no sean números, puntos o barras*/
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

        /* Configura el comportamiento de los campos según el tipo de tráfico seleccionado */
        document.querySelectorAll(`.tipo.${tipo}`).forEach(select => {
            select.addEventListener('change', function() {
                const selectedValue = select.value;
                const fromPortInput = select.parentElement.querySelector(`.from-port.${tipo}`);
                const toPortInput = select.parentElement.querySelector(`.to-port.${tipo}`);
                const cidrInput = select.parentElement.querySelector(`.cidr.${tipo}`);

                if (selectedValue === 'tcp') {
                    fromPortInput.value = '';
                    toPortInput.value = '';
                    fromPortInput.removeAttribute('readonly');
                    toPortInput.removeAttribute('readonly');
                    fromPortInput.classList.remove('blocked');
                    toPortInput.classList.remove('blocked');
                    cidrInput.value = '';
                    cidrInput.removeAttribute('readonly');
                    cidrInput.classList.remove('blocked');
                } else if (selectedValue === 'icmp') {
                    fromPortInput.value = portMappings[selectedValue].from;
                    toPortInput.value = portMappings[selectedValue].to;
                    fromPortInput.setAttribute('readonly', 'readonly');
                    toPortInput.setAttribute('readonly', 'readonly');
                    fromPortInput.classList.add('blocked');
                    toPortInput.classList.add('blocked');
                    cidrInput.value = '0.0.0.0/0';
                    cidrInput.setAttribute('readonly', 'readonly');
                    cidrInput.classList.add('blocked');
                } else if (portMappings[selectedValue]) {
                    fromPortInput.value = portMappings[selectedValue].from;
                    toPortInput.value = portMappings[selectedValue].to;
                    fromPortInput.setAttribute('readonly', 'readonly');
                    toPortInput.setAttribute('readonly', 'readonly');
                    fromPortInput.classList.add('blocked');
                    toPortInput.classList.add('blocked');
                    cidrInput.value = '';
                    cidrInput.removeAttribute('readonly');
                    cidrInput.classList.remove('blocked');
                } else {
                    fromPortInput.value = '';
                    toPortInput.value = '';
                    fromPortInput.setAttribute('readonly', 'readonly');
                    toPortInput.setAttribute('readonly', 'readonly');
                    fromPortInput.classList.add('blocked');
                    toPortInput.classList.add('blocked');
                    cidrInput.value = '';
                    cidrInput.removeAttribute('readonly');
                    cidrInput.classList.remove('blocked');
                }
            });
        });
    }

    /*Valida que los campos no tengan carácteres que no sean números, letras o guión bajo*/
    function añadirValidacionCampos() {
        const nombreInput = document.querySelector('.nombre');
        const vpcInput = document.querySelector('.vpc');
        const regex = /^[a-zA-Z0-9_-]*$/;
        const mensajeError = 'Solo se permiten letras, números y guiones bajos.';

        [nombreInput, vpcInput].forEach(input => {
            input.addEventListener('input', function() {
                if (!regex.test(input.value)) {
                    input.setCustomValidity(mensajeError);
                } else {
                    input.setCustomValidity('');
                }
            });
        });
    }

    /* Maneja el cambio en la cantidad de formularios de entrada */
    cantidadFormEn.addEventListener('change', function() {
        const cantidad = parseInt(cantidadFormEn.value);
        crearCajaFormulario('entrada', cantidad);
    });

    /* Maneja el cambio en la cantidad de formularios de salida*/
    cantidadFormSa.addEventListener('change', function() {
        const cantidad = parseInt(cantidadFormSa.value);
        crearCajaFormulario('salida', cantidad);
    });

    /* Maneja el envío del formulario */
    document.querySelector('#enviar_btn').addEventListener('click', function(event) {
        event.preventDefault();

        const formFields = document.querySelectorAll('.form_est input, .formulario_individual input, .formulario_individual select');
        let allValid = true;

        /* Valida todos los campos del formulario */
        formFields.forEach(field => {
            if (!field.checkValidity()) {
                allValid = false;
                field.reportValidity();
            }
        });

        if (allValid) {
            const nombreGs = document.querySelector('.nombre').value;
            const descripcion = document.querySelector('.descripcion').value;
            const Vpc = document.querySelector('.vpc').value;
            const etqNom = document.querySelector('.etq_nom').value;

            /*Se genera y añade al contenedor de la salida el código de terraform con las variables seleccionadas antes*/
            let outputContent = `
<pre>
<span class="morado">#Grupo de seguridad:</span> 
<span class="amarillo">resource</span> "aws_security_group" "${nombreGs}" <span class="amarillo">{</span>
    <span class="celeste">name</span> <span class="naranja">=</span> <span class="verde">"${nombreGs}"</span>
    <span class="celeste">description</span> <span class="naranja">=</span> <span class="verde">"${descripcion}"</span>
    <span class="celeste">vpc_id</span> <span class="naranja">=</span> <span class="celeste">aws_vpc</span><span class="naranja">.</span>${Vpc}<span class="naranja">.</span>id
`;

            const TipoEn = document.querySelectorAll('.tipo.entrada');
            const CidrEn = document.querySelectorAll('.cidr.entrada');

            /* Genera las reglas de entrada (ingress) */
            TipoEn.forEach(function(tipoSelect, index) {
                const tipo = tipoSelect.value === 'icmp' ? 'icmp' : 'tcp';
                const cidr = tipo === 'icmp' ? '0.0.0.0/0' : CidrEn[index].value;
                let fromPort = 0;
                let toPort = 0;

                if (tipo === 'tcp') {
                    fromPort = document.querySelectorAll('.from-port.entrada')[index].value;
                    toPort = document.querySelectorAll('.to-port.entrada')[index].value;
                } else if (portMappings[tipo]) {
                    fromPort = portMappings[tipo].from;
                    toPort = portMappings[tipo].to;
                }

                outputContent += `
    <span class="amarillo">ingress</span><span class="rosa">{</span>
        <span class="celeste">from_port</span> <span class="naranja">=</span> <span class="rojo">${fromPort}</span>
        <span class="celeste">to_port</span> <span class="naranja">=</span> <span class="rojo">${toPort}</span>
        <span class="celeste">protocol</span> <span class="naranja">=</span> <span class="verde">"${tipo}"</span>
        <span class="celeste">cidr_blocks</span> <span class="naranja">=</span> <span class="azul">[</span><span class="verde">"${cidr}"</span><span class="azul">]</span>
    <span class="rosa">}</span>
`;
            });

            const TipoSa = document.querySelectorAll('.tipo.salida');
            const CidrSa = document.querySelectorAll('.cidr.salida');

            /* Genera las reglas de salida (egress) */
            TipoSa.forEach(function(tipoSelect, index) {
                const tipo = tipoSelect.value === 'icmp' ? 'icmp' : 'tcp';
                const cidr = tipo === 'icmp' ? '0.0.0.0/0' : CidrSa[index].value;
                let fromPort = 0;
                let toPort = 0;

                if (tipo === 'tcp') {
                    fromPort = document.querySelectorAll('.from-port.salida')[index].value;
                    toPort = document.querySelectorAll('.to-port.salida')[index].value;
                } else if (portMappings[tipo]) {
                    fromPort = portMappings[tipo].from;
                    toPort = portMappings[tipo].to;
                }

                outputContent += `
    <span class="amarillo">egress</span><span class="rosa">{</span>
        <span class="celeste">from_port</span> <span class="naranja">=</span> <span class="rojo">${fromPort}</span>
        <span class="celeste">to_port</span> <span class="naranja">=</span> <span class="rojo">${toPort}</span>
        <span class="celeste">protocol</span> <span class="naranja">=</span> <span class="verde">"${tipo}"</span>
        <span class="celeste">cidr_blocks</span> <span class="naranja">=</span> <span class="azul">[</span><span class="verde">"${cidr}"</span><span class="azul">]</span>
    <span class="rosa">}</span>
`;
            });

            /* Añade las etiquetas al grupo de seguridad */
            outputContent += `
    <span class="celeste">tags</span> <span class="naranja">=</span> <span class="rosa">{</span>
        <span class="celeste">Name</span> <span class="naranja">=</span> <span class="verde">"${etqNom}"</span>
    <span class="rosa">}</span>
<span class="amarillo">}</span>
</pre>
            `;

            outputDiv.innerHTML = outputContent;
        }
    });

    /* Función para limpiar el formulario */
    function limpiarFormulario() {
        document.querySelectorAll('input').forEach(input => input.value = '');
        document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
    }

    limpiarFormulario();
    añadirValidacionCampos();

    /* Limpiar los campos del formulario al cargar la página */
    document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
});
