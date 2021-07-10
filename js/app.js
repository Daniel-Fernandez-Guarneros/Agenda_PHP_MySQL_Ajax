const formularioContactos = document.querySelector('#contacto'),
      listadoContactos = document.querySelector('#listado-contactos tbody');

eventListeners();

function eventListeners() {
    //Cuando se ejecuta el formulario para editar o borrar
    formularioContactos.addEventListener('submit', leerFormulario);

    // Listener para eliminar el boton
    listadoContactos.addEventListener('click', eliminarContacto); 
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

            // Inserta elemento en la tabala
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            // Crea Contenedor para los botones
            const contenedorAcciones = document.createElement('td');

            // Crea el Icono de Editar
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-pen-square');

            // Crea el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            // Agrega al padre del contenedor
            contenedorAcciones.appendChild(btnEditar);

            // Crea el Icono de Eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash-alt');

            // Crea el boton de eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            // Agregar al padre
            contenedorAcciones.appendChild(btnEliminar);

            // Agregar al <tr>
            nuevoContacto.appendChild(contenedorAcciones);

            // Agrega a los contactos
            listadoContactos.appendChild(nuevoContacto);       
            
            // Resetear el formulario
            document.querySelector('form').reset();

            // Mostrar la notificacion
            mostrarNotificacion('Contacto Creado Correctamente', 'correcto');
        }
    }

    //Enviara los datos
    xhr.send(datos)
}

//Eliminar el contacto
function eliminarContacto(e) {
    if( e.target.parentElement.classList.contains('btn-borrar') ) {
        
        const id = e.target.parentElement.getAttribute('data-id');

         // console.log(id);

        const respuesta = confirm('¿Estás Segur(a) ?');

        if(respuesta) {
            // llamado a ajax
            
            const xhr = new XMLHttpRequest();

            // Abrir conexion
            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

            //lee la respuesta
            xhr.onload = function() {
                if (this.status === 200) {
                    const resultado = JSON.parse(xhr.responseText);

                    if(resultado.respuesta == 'correcto') {
                        
                        console.log(e.target.parentElement.parentElement.parentElement);
                        e.target.parentElement.parentElement.parentElement.remove();

                        // mostrar Notificación
                        mostrarNotificacion('Contacto eliminado', 'correcto');
                    } else {
                        // Mostramos una notificacion
                        mostrarNotificacion('Hubo un error...', 'error' );
                    }
                    
                }
            }

            // enviar la petición
            xhr.send();
        }
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