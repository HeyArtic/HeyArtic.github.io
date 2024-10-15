<?php 
session_start();

if (isset($_SESSION['id']) && isset($_SESSION['user_name'])) {

 ?>
<?php require('../editaveis/header.php') ?>
<div class="login">
    <form action="change-p.php" method="post">
     	<h2>Trocar senha</h2>
     	<?php if (isset($_GET['error'])) { ?>
     		<p class="error"><?php echo $_GET['error']; ?></p>
     	<?php } ?>

     	<?php if (isset($_GET['success'])) { ?>
            <p class="success"><?php echo $_GET['success']; ?></p>
        <?php } ?>

     	<label>Antiga senha</label>
         <img src="../img/senha" width="18pxs">
     	<input type="password" 
     	       name="op" 
     	       placeholder="Antiga senha">
     	       <br>

     	<label>Nova senha</label>
         <img src="../img/senha" width="18pxs">
     	<input type="password" 
     	       name="np" 
     	       placeholder="Nova senha">
     	       <br>

     	<label>Confirmar nova senha</label>
         <img src="../img/senha" width="18pxs">
     	<input type="password" 
     	       name="c_np" 
     	       placeholder="Confirme sua senha">
     	       <br>

     	<button type="submit">Confirmar</button>
          <a href="../../index.php" class="ca">Voltar</a>
     </form>
		</div>
		<main class="m"></main>
     <?php require('../editaveis/footer.php') ?>
	 <script src="../naruto/scriptep.js"></script>
	 
</body>
</html>

<?php 
}else{
     header("Location: login-ix.php");
     exit();
}
 ?>