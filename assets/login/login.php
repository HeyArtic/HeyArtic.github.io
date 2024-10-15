<?php 
session_start(); 
include "db_conn.php";

if (isset($_POST['uname']) && isset($_POST['password'])) {

	function validate($data){
       $data = trim($data);
	   $data = stripslashes($data);
	   $data = htmlspecialchars($data);
	   return $data;
	}

	$uname = validate($_POST['uname']);
	$pass = validate($_POST['password']);

	if (empty($uname)) {
		header("Location: login-ix.php?error=Usuário em branco");
	    exit();
	}else if(empty($pass)){
        header("Location: login-ix.php?error=Senha em branco");
	    exit();
	}else{
		// hashing the password

        
		$sql = "SELECT * FROM users WHERE user_name='$uname'";

		$result = mysqli_query($conn, $sql);

		if (mysqli_num_rows($result) === 1) {
			$row = mysqli_fetch_assoc($result);
            if (password_verify($pass, $row['password'])) {
            	$_SESSION['user_name'] = $row['user_name'];
            	$_SESSION['name'] = $row['name'];
            	if($row['id'] == 1){
					$_SESSION['id_master'] = 1;	
				}else{
					$_SESSION['id_usuario'] = $row['id'];
				}	
            	header("Location: ../../index.php");
		        exit();
            }else{
				header("Location: login-ix.php?error=Senha ou Usuário incorreto");
		        exit();
			}
		}else{
			header("Location: login-ix.php?error=Senha ou Usuário incorreto");
	        exit();
		}
	}
	
}else{
	header("Location: login-ix.php");
	exit();
}