let instancias = [];

function mostrarFormulario() {
  document.getElementById('formularios').style.display = 'block';
}

function agregarInstancia() {
  const nombre = document.getElementById('nombreInstancia').value;
  const sistemaOperativo = document.getElementById('sistemaOperativo').value;
  const cantidad = document.getElementById('cantidadInstancias').value;
  
  for (let i = 0; i < cantidad; i++) {
    instancias.push({ nombre: nombre, sistemaOperativo: sistemaOperativo });
  }

  actualizarListaInstancias();
}

function actualizarListaInstancias() {
  const listaInstancias = document.getElementById('listaInstancias');
  listaInstancias.innerHTML = '';
  
  instancias.forEach(instancia => {
    const listItem = document.createElement('li');
    listItem.textContent = `Nombre: ${instancia.nombre}, Sistema Operativo: ${instancia.sistemaOperativo}`;
    listaInstancias.appendChild(listItem);
  });

  document.getElementById('formularios').style.display = 'none';
  document.getElementById('instancias').style.display = 'block';
}

function crearInstancias() {
  // En este punto, deberías ejecutar Terraform para crear las instancias en AWS
  // Por ejemplo, podrías usar fetch() para llamar a un backend que ejecute Terraform
  // y devolver el resultado al usuario
  alert('Se han creado las instancias en AWS utilizando Terraform.');
}
