const formularioContactos = document.querySelector('#contacto'),
      listadoContactos = document.querySelector('#listado-contactos tbody');
      inputBuscador = document.querySelector('#buscar');    

eventListeners();

function eventListeners() {
    //Cuando se ejecuta el formulario para editar o borrar
    formularioContactos.addEventListener('submit', leerFormulario);

    // Listener para eliminar el boton
    if(listadoContactos){
        listadoContactos.addEventListener("click", eliminarContacto);
    }

    // Buscador
    inputBuscador.addEventListener('input', buscarContactos);

    numeroContactos();
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

            const idRegistro = document.querySelector("#id").value;
            infoContacto.append("id", idRegistro);
            actualizarBD(infoContacto);
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

            // Actualizar numero
            numeroContactos();
        }
    }

    //Enviara los datos
    xhr.send(datos)
}


function actualizarBD(datos){

    const xhr = new XMLHttpRequest();

    //Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    //Leer la respuesta
    xhr.onload = function() {
        if(this.status === 200){
            const respuesta = JSON.parse(xhr.responseText);

            if(respuesta.respuesta === 'correcto'){
                // Mostrara las notificaciones
                mostrarNotificacion('Contacto Editado Correctamente', 'correcto');
            } else {
                // Mensaje de error
                mostrarNotificacion('Hubo un error...', 'error');
           }

            setTimeout( () => {
                window.location.href = "index.php";
            }, 4000);
        }
    }

    //Enviar datos
    xhr.send(datos);
}

//Eliminar el contacto
function eliminarContacto(e) {
    if( e.target.parentElement.classList.contains('btn-borrar') ) {
        
        const id = e.target.parentElement.getAttribute('data-id');

         // console.log(id);

        const respuesta = confirm('??Est??s Segur(a) ?');

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

                        // mostrar Notificaci??n
                        mostrarNotificacion('Contacto eliminado', 'correcto');

                        // Actualizar numero
                        numeroContactos();
                    } else {
                        // Mostramos una notificacion
                        mostrarNotificacion('Hubo un error...', 'error' );
                    }
                    
                }
            }

            // enviar la petici??n
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
//Buscador de Registros
function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i");
          registros = document.querySelectorAll('tbody tr');

        registros.forEach(registro => {
            registro.style.display = 'none';

            if(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1 ){
                registro.style.display = 'table-row';
            }
            numeroContactos();
        })
}

function numeroContactos() {
    const totalContactos = document.querySelectorAll('tbody tr'),
          contenedorNumero = document.querySelector('.total-contactos span');

    let total = 0;

    totalContactos.forEach(contacto => {
        if(contacto.style.display === '' || contacto.style.display === 'table-row'){
            total++;
        }
    });

    // console.log(total);
    contenedorNumero.textContent = total;
}