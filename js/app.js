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

        mostrarNotificacion('Todos los campos son obligatorios', 'error');
    } else {
        console.log('Tiene algo');
    }
}


// Notificacion que aparece en pantalla
function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    // Formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    // Mostrar y ocultar la notificacion
    setTimeout(() => {
         notificacion.classList.add('visible');

         setTimeout(() => {
              notificacion.classList.remove('visible');     
              setTimeout(() => {
                   notificacion.remove();
              }, 500)
         }, 3000);
    }, 100);

}