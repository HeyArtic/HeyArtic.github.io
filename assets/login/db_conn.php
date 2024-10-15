<?php

$sname= "localhost";
$unmae= "alisson";
$password = "64315208";

$db_name = "login";

$conn = mysqli_connect($sname, $unmae, $password, $db_name);

if (!$conn) {
	echo "Falha na conexão!";
}

