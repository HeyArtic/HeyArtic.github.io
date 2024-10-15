<?php require('../editaveis/header.php') ?>
<div class="login">
     <form action="login.php" method="post">
     	<h2>LOGUE-SE</h2>
     	<?php if (isset($_GET['error'])) { ?>
     		<p class="error"><?php echo $_GET['error']; ?></p>
     	<?php } ?>
     	<label>Usuário</label>
         <img src="../img/person" width="18pxs">
     	<input type="text" name="uname" class="textt" placeholder="Digite seu Usuário"><br>
     	<label>Senha</label>
         <img src="../img/senha" width="18pxs">
     	<input type="password" name="password" class="textt" placeholder="Digite sua senha"><br>

     	<button type="submit">Logar</button>
          <a href="signup.php" class="ca">criar conta</a>
     </form>
		</div>
     <main class="m"></main>
     <?php require('../editaveis/footer.php') ?>
	 <script src="script.js"></script>
</body>
</html>