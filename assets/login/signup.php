<?php require('../editaveis/header.php') ?>
<div class="login">
     <form action="signup-check.php" method="post">
     	<h2>REGISTRE-SE</h2>
     	<?php if (isset($_GET['error'])) { ?>
     		<p class="error"><?php echo $_GET['error']; ?></p>
     	<?php } ?>

          <?php if (isset($_GET['success'])) { ?>
               <p class="success"><?php echo $_GET['success']; ?></p>
          <?php } ?>

          <label>Nome Completo</label>
          <img src="../img/person" width="18pxs">
          <?php if (isset($_GET['name'])) { ?>
               <input type="text" 
                      name="name" 
                      placeholder="Digite seu Nome"
                      value="<?php echo $_GET['name']; ?>"><br>
          <?php }else{ ?>
               <input type="text" 
                      name="name" 
                      placeholder="Digite seu Nome"><br>
          <?php }?>

          <label>Usuário</label>
          <img src="../img/person" width="18pxs">
          <?php if (isset($_GET['uname'])) { ?>
               <input type="text" 
                      name="uname" 
                      placeholder="Digite seu Usuário"
                      value="<?php echo $_GET['uname']; ?>"><br>
          <?php }else{ ?>
               <input type="text" 
                      name="uname" 
                      placeholder="Digite seu Usuário"><br>
          <?php }?>


     	<label>Senha</label>
          <img src="../img/senha" width="18pxs">
     	<input type="password" 
                 name="password" 
                 placeholder="Digite sua senha"><br>

          <label>Confirmar Senha</label>
          <img src="../img/senha" width="18pxs">
          <input type="password" 
                 name="re_password" 
                 placeholder="Confirme sua senha"><br>

     	<button type="submit">Registrar</button>
          <a href="login-ix.php" class="ca">Ja possui uma conta?</a>
     </form>
          </div>
          <main class="m"></main>
     <?php require('../editaveis/footer.php') ?>
     <script src="script.js"></script>
</body>
</html>