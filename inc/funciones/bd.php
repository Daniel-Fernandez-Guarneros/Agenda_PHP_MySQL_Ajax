<?php

// Credenciales de la base de datos de agendaphp
define('DB_USUARIO', 'root');
define('DB_PASSWORD', ''); // Mi usuario root no tiene contraseña
define('DB_HOST', 'localhost');
define('DB_NOMBRE', 'agendaphp');

$conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NOMBRE);

// echo $conn->ping();