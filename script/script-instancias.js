document.addEventListener("DOMContentLoaded", function() {
  const formContainer = document.querySelector('.contenedor_formulario');
  const cantidadInstanciasSelect = document.querySelector('#cantidad_instancias');

  // Función para crear cajas de formulario
  function crearCajaFormulario(cantidad) {
      for (let i = 0; i < cantidad; i++) {
          const formularioHTML = `
          <div class="formulario_individual">
              <p class="num_form">Instancia ${i+1}</p>
              <input type="text" class="nombre_instancia" placeholder="Nombre de la instancia" required>

              <label for="sistema_operativo">Sistema Operativo:</label>
              <select class="sistema_operativo">
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
              <select class="tipo_instancia">
                <option value="" selected>- Selecciona -</option>
                <option value="t2.nano">T2 nano</option>
                <option value="t2.micro">T2 micro</option>
                <option value="t2.small">T2 small</option>
                <option value="t2.medium">T2 medium</option>
                <option value="t2.large">T2 large</option>
              </select>

              <input type="text" class="nombre_claves" placeholder="Nombre de las claves SSH" required>

              <input type="text" class="subred_nom" placeholder="Nombre de la subred" required>

              <div class="ip_pub_container">
                <p class="ip_pub_txt">Asignar IP pública automáticamente</p>
                <input type="checkbox" class="ip_pub">
              </div>

              <input type="text" class="ip_priv" placeholder="IP privada" required>

              <input type="text" class="grseg_nom" placeholder="Nombre del grupo de seguridad" required>

              <input type="text" class="etiq_nom" placeholder="Etiqueta nombre" required>
          </div>
          `;
          // Insertar después del desplegable dentro del div .formulario
          const formularioContainer = formContainer.querySelector('#enviar_btn');
          formularioContainer.insertAdjacentHTML('beforebegin', formularioHTML);
      }

      // Agregar validación a los campos de nombre de instancia y de IP privada
      const nombreInstanciaInputs = document.querySelectorAll('.nombre_instancia');
      nombreInstanciaInputs.forEach(function(input) {
          input.addEventListener('input', function() {
              validarNombre(input);
          });
      });

      const ipPrivadaInputs = document.querySelectorAll('.ip_priv');
      ipPrivadaInputs.forEach(function(input) {
          input.addEventListener('input', function() {
              validarIPPrivada(input);
          });
      });
  }

  // Función para validar el nombre de la instancia
  function validarNombre(input) {
      const regex = /^[a-zA-Z_]*$/;
      if (!regex.test(input.value)) {
          input.setCustomValidity('El nombre solo puede contener letras y guiones bajos (_).');
      } else {
          input.setCustomValidity('');
      }
  }

  // Función para validar la IP Privada
  function validarIPPrivada(input) {
      const regex = /^[\d.]*$/;
      if (!regex.test(input.value)) {
          input.setCustomValidity('La IP privada solo puede contener números y puntos (.)');
      } else {
          input.setCustomValidity('');
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
      // Limpiar el output anterior
      const outputDiv = document.querySelector('#output');
      outputDiv.innerHTML = '';
      // Crear nuevas cajas de formulario
      crearCajaFormulario(cantidad);
  });

  // Evento click en el botón de enviar
  const enviarBtn = document.querySelector('#enviar_btn');
  enviarBtn.addEventListener('click', function(event) {
      event.preventDefault(); // Evitar envío del formulario

      const nombreInstancias = document.querySelectorAll('.nombre_instancia');
      const sistemaOperativo = document.querySelectorAll('.sistema_operativo');
      const tipoInstancia = document.querySelectorAll('.tipo_instancia');
      const nombreClaves = document.querySelectorAll('.nombre_claves');
      const subredNom = document.querySelectorAll('.subred_nom');
      const ipPublica = document.querySelectorAll('.ip_pub');
      const ipPrivada = document.querySelectorAll('.ip_priv');
      const grupoSeguridad = document.querySelectorAll('.grseg_nom');
      const etiquetaNombre = document.querySelectorAll('.etiq_nom');
      const outputDiv = document.querySelector('#output');
      outputDiv.innerHTML = ''; // Limpiar salida anterior

      let allValid = true;
      nombreInstancias.forEach(function(instancia) {
          if (!instancia.checkValidity()) {
              allValid = false;
              instancia.reportValidity();
          }
      });

      ipPrivada.forEach(function(ip) {
          if (!ip.checkValidity()) {
              allValid = false;
              ip.reportValidity();
          }
      });

      if (allValid) {
          nombreInstancias.forEach(function(instancia, index) {
              const nombre = instancia.value;
              const sistema = sistemaOperativo[index].value;
              const tipoins = tipoInstancia[index].value;
              const nomclv = nombreClaves[index].value;
              const subnom = subredNom[index].value;
              const ippub = ipPublica[index].checked;
              const ipprv = ipPrivada[index].value;
              const grpseg = grupoSeguridad[index].value;
              const etqnom = etiquetaNombre[index].value;

              outputDiv.innerHTML += `
                  
                      #Instancia ${index + 1}: <br/>
                      resource "aws_instance" "${nombre}" {<br/>
                      ami           = "${sistema}" <br/>
                      instance_type = "${tipoins}" <br/>
                      key_name = "${nomclv}" <br/>
                      subnet_id = aws_subnet.${subnom}.id <br/>
                      associate_public_ip_address = "${ippub}" <br/>
                      private_ip = "${ipprv}" <br/>
                      vpc_security_group_ids = [aws_security_group.${grpseg}.id] <br/>
                      tags = { 
                          Name = "${etqnom}"
                        }
                      }
                  
              `;
          });
      }
  });
});
