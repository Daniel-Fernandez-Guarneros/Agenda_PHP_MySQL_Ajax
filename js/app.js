const formularioContactos = document.querySelector('#contacto');

eventListeners();

function eventListeners() {
    //Cuando se ejecuta el formulario para editar o borrar
    formularioContactos.addEventListener('submit', leerFormulario);
}

function leerFormulario(e) {
    e.preventDefault();

    //Lee los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
          empresa = document.querySelector('#empresa').value,
          telefono = document.querySelector('#telefono').value;
    
    if(nombre === '' || empresa === '' || telefono === '') {
        console.log('Los campos estan vacios')
    } else {
        console.log('Tiene algo');
    }
}