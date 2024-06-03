document.addEventListener("DOMContentLoaded", function() {
    const rutasContainer = document.createElement('div'); // Contenedor dinámico para las rutas
    const subredesContainer = document.createElement('div'); // Contenedor dinámico para las subredes
    const cantidadForm = document.querySelector('#cantidad');
    const cantidadSubForm = document.querySelector('#cantidad-sub');
    const outputDiv = document.querySelector('#output');
    const enviarBtn = document.querySelector('#enviar_btn');

    // Insertar los contenedores dinámicos debajo de sus respectivos selectores
    cantidadForm.insertAdjacentElement('afterend', rutasContainer);
    cantidadSubForm.insertAdjacentElement('afterend', subredesContainer);

    function crearFormularioRutas(cantidad) {
        rutasContainer.innerHTML = ''; // Limpia el contenedor
        for (let i = 0; i < cantidad; i++) {
            const formularioRutaHTML = `
                <div class="formulario_individual">
                    <p class="num_form">Ruta ${i + 1}</p>
                    <label for="tipo">Tipo:</label>
                    <select class="tipo" required>
                      <option value="" disabled selected>- Selecciona -</option>
                      <option value="gateway">Internet gateway</option>
                      <option value="nat_gateway">NAT gateway</option>
                      <option value="instance">Instancia</option>
                      <option value="network_interface">Interfaz de red</option>
                      <option value="vpc_peering_connection">VPC Peering Connection</option>
                      <option value="transit_gateway">Gateway de tránsito</option>
                    </select>
                    <input type="text" class="nombre" placeholder="Nombre del recurso" required>
                    <input type="text" class="cidr" placeholder="Bloque CIDR | Ej: 192.168.1.0/24" required>
                </div>
            `;
            rutasContainer.insertAdjacentHTML('beforeend', formularioRutaHTML);
        }
        añadirValidacionCampos();
    }

    function crearFormularioSubredes(cantidad) {
        subredesContainer.innerHTML = ''; // Limpia el contenedor
        for (let i = 0; i < cantidad; i++) {
            const formularioSubredHTML = `
                <div class="formulario_individual">
                    <p class="num_form">Subred ${i + 1}</p>
                    <input type="text" class="nombre-subred" placeholder="Nombre de la subred" required>
                </div>
            `;
            subredesContainer.insertAdjacentHTML('beforeend', formularioSubredHTML);
        }
        añadirValidacionCampos();
    }

    cantidadForm.addEventListener('change', function() {
        const cantidad = parseInt(cantidadForm.value);
        crearFormularioRutas(cantidad);
    });

    cantidadSubForm.addEventListener('change', function() {
        const cantidad = parseInt(cantidadSubForm.value);
        crearFormularioSubredes(cantidad);
    });

    enviarBtn.addEventListener('click', function(event) {
        event.preventDefault();

        const formFields = document.querySelectorAll('.form_est input, .formulario_individual input, .formulario_individual select');
        let allValid = true;

        formFields.forEach(field => {
            if (!field.checkValidity()) {
                allValid = false;
                field.reportValidity();
            }
        });

        if (allValid) {
            const nombreTbl = document.querySelector('.nombre-tbl').value;
            const vpc = document.querySelector('.vpc').value;
            const etqNom = document.querySelector('.etq_nom').value;
            const rutas = rutasContainer.querySelectorAll('.formulario_individual');
            const subredes = subredesContainer.querySelectorAll('.formulario_individual');

            outputDiv.innerHTML = `
<pre>
<span class="morado">#Tabla de ruteo:</span> 
<span class="amarillo">resource</span> "aws_route_table" "${nombreTbl}" <span class="amarillo">{</span> 
    <span class="celeste">vpc_id</span> <span class="naranja">=</span> <span class="celeste">aws_vpc</span><span class="naranja">.</span>${vpc}<span class="naranja">.</span>id 
</pre>`;

            rutas.forEach(ruta => {
                const tipo = ruta.querySelector('.tipo').value;
                const nombre = ruta.querySelector('.nombre').value;
                const cidr = ruta.querySelector('.cidr').value;
                let tipoId = tipo

                if (tipo === "gateway") {
                    tipoId = "internet_gateway"; // Cambia a "gateway_id" para Internet gateway
                }

                outputDiv.innerHTML += `
<pre>
    <span class="amarillo">route</span> <span class="rosa">{</span> 
        <span class="celeste">${tipo}_id</span> <span class="naranja">=</span> <span class="celeste">aws_${tipoId}</span><span class="naranja">.</span>${nombre}<span class="naranja">.</span>id 
        <span class="celeste">cidr_block</span> <span class="naranja">=</span> <span class="verde">"${cidr}"</span>
    <span class="rosa">}</span>
</pre>`;
            });

            outputDiv.innerHTML += `
<pre>
    <span class="celeste">tags</span> <span class="naranja">=</span> <span class="rosa">{</span>
        <span class="celeste">Name</span> <span class="naranja">=</span> <span class="verde">"${etqNom}"</span>
    <span class="rosa">}</span>
<span class="amarillo">}</span><br/>
</pre>
`;

            subredes.forEach(subred => {
                const nombreSubred = subred.querySelector('.nombre-subred').value;
                const nombreTbl = document.querySelector('.nombre-tbl').value;

                outputDiv.innerHTML += `
<pre>
<span class="morado">#Asociacion a subred ${nombreSubred}:</span> 
<span class="amarillo">resource</span> "aws_route_table_association" "${nombreTbl}_${nombreSubred}_association" <span class="amarillo">{</span> 
    <span class="celeste">subnet_id</span> <span class="naranja">=</span> <span class="celeste">aws_subnet</span><span class="naranja">.</span>${nombreSubred}<span class="naranja">.</span>arn 
    <span class="celeste">route_table_id</span> <span class="naranja">=</span> <span class="celeste">aws_route_table</span><span class="naranja">.</span>${nombreTbl}<span class="naranja">.</span>id 
<span class="amarillo">}</span><br/>
</pre>
`;
            });
        }
    });

    // Añadir validación a los campos
    function añadirValidacionCampos() {
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

        document.querySelectorAll('.nombre-subred').forEach(input => {
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

    // Inicializa la validación de los campos existentes
    function añadirValidacionIndividual() {
        const campos = ['.nombre-tbl', '.vpc', '.etq_nom'];
        campos.forEach(selector => {
            const input = document.querySelector(selector);
            if (input) {
                input.addEventListener('input', function() {
                    let regex = /^[a-zA-Z0-9_]*$/;
                    let mensajeError = 'El campo solo puede contener letras, números y guiones bajos (_).';

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

    añadirValidacionIndividual();

    // Limpiar los campos del formulario al cargar la página
    function limpiarFormulario() {
        document.querySelectorAll('input').forEach(input => input.value = '');
        document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
    }

    limpiarFormulario();
});
