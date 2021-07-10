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
          accion = document.querySelector('#accion').value;
    
    if(nombre === '' || empresa === '' || telefono === '') {

        mostrarNotificacion('Todos los campos son obligatorios', 'error');
    } else {
        //Llamdo de ajax
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        //console.log(...infoContacto);

        if(accion === 'crear'){
            // creara un nuevo contacto
            insertarBD(infoContacto);
       } else {
            // editara el contacto
       }
    }
}
/**Insertara en la base de datos mediante ajax */
function insertarBD(datos) {
    // Llamado de AJAX

    // Creara el objeto
    const xhr = new XMLHttpRequest();

    //Abrira la Conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    //Pasara los datos
    xhr.onload = function() {
        if(this.status === 200) {
            console.log(JSON.parse(xhr.responseText));
            //Leera la respuesta de php
            const respuesta = JSON.parse(xhr.responseText);

            console.log(respuesta.empresa);
        }
    }

    //Enviara los datos
    xhr.send(datos)
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