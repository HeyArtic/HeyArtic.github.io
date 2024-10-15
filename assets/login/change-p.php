<?php 
session_start();

if (isset($_SESSION['id']) && isset($_SESSION['user_name'])) {

    include "db_conn.php";

if (isset($_POST['op']) && isset($_POST['np'])
    && isset($_POST['c_np'])) {

	function validate($data){
       $data = trim($data);
	   $data = stripslashes($data);
	   $data = htmlspecialchars($data);
	   return $data;
	}

	$op = validate($_POST['op']);
	$np = validate($_POST['np']);
	$c_np = validate($_POST['c_np']);
    
    if(empty($op)){
      header("Location: change-password.php?error=Antiga senha em branco");
	  exit();
    }else if(empty($np)){
      header("Location: change-password.php?error=Nova senha em branco");
	  exit();
    }else if($np !== $c_np){
      header("Location: change-password.php?error=Confirme sua nova senha");
	  exit();
    }else {
    
		$op = validate($_POST['op']);
    	$np = password_hash($_POST['np'],PASSWORD_DEFAULT);
        $id = $_SESSION['id'];

        $sql_code = "SELECT * FROM users WHERE id='$id' LIMIT 1";
		$sql_exec = $conn->query($sql_code) or die($conn->error);
	    $usuario = $sql_exec->fetch_assoc();
		if (password_verify($op, $usuario['password'])) {
        	$sql_2 = "UPDATE users
        	          SET password='$np'
        	          WHERE id='$id'";
        	mysqli_query($conn, $sql_2);
        	header("Location: change-password.php?success=Sua senha foi trocada com sucesso");
	        exit();

        }else {
        	header("Location: change-password.php?error=Senha incorreta");
	        exit();
        }

    }

    
}else{
	header("Location: change-password.php");
	exit();
}

}else{
     header("Location: login-ix.php");
     exit();
}