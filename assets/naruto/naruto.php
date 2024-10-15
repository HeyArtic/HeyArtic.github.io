<?php

    session_start();
    require_once 'comentarios.php';
    $c = new Comentario("login","localhost","alisson","64315208");
    $coments = $c->buscarComentarios();
    

?>

<?php require('../editaveis/header.php') ?>
    <main class="container">
        <section class="main-video">
            <video src="https://stream.trk-fire.pro/b-12/naruto-fb780c56/dubbed/1/a1149530-55e9-4b57-acc2-3147409690b9/stream.mp4" controls autoplay muted></video>

        <section class="video-playlist">
            <h3 class="title">Naruto Clássico Completo - Dublado</h3>
            <p>10 episódios</p>
            <div class="videos">
                
            </div>
            <p>Resumo: Um jovem aspirante a ninja de 12 anos, Naruto cresceu sob o desprezo dos moradores da Vila Oculta da Folha. Por este motivo, 
        ele sonhava em crescer como ninja e em um dia se tornar Hokage, líder do local. Naruto entende que esse desafio será ainda maior do que 
        esperava ao descobrir que é o hospedeiro de uma raposa demoníaca conhecida como Nove Caudas.
         Essa entidade devastou a Vila Oculta da Folha há 12 anos. Por este motivo, Naruto sempre foi tratado mal por sua aldeia.</p>
            <br>
            <section class="com">
          <?php
          if (!isset($_SESSION['id_usuario']))
          { ?>
           <h2>Deixe seu comentário</h2>
           <p>Logue-se para comentar</p>
 <?php     }else
        { ?>
        <h2>Deixe seu comentário</h2>
       <?php }
?>
         
        <?php
        if (isset($_SESSION['id_usuario']))
        { ?>
        <form method="POST">
            <textarea name="texto" placeholder="Comente o que achou do episódio.."></textarea>
            <input type="submit" value="Compartilhar">
            </form>
            </div>
<?php  }
        ?>
        <?php
       if(count($coments) > 0)
          {
            foreach ($coments as $v)
            { ?>
            
                <div class="area-com">
                <img class="img" src="../img/perfil1.png" width="60">
                <h3><?php echo $v['nome_pessoa']; ?></h3>
                <h4>
                    <?php
                    $data = new DateTime($v['dia']);
                    echo $data->format('d/m/Y');
                    echo " - ";
                    echo $v['horario'];
                    ?>
                    <?php
                    if (isset($_SESSION['id_usuario']))
                    {
                        if($_SESSION['id_usuario'] == $v['fk_id_usuario'])
                        { ?>
                        <a href="naruto.php?id_exc=<?php echo $v['id'];?>">Excluir</a>                   
             <?php      }
                    }elseif (isset($_SESSION['id_master']))
                        {  ?>
                         <a href="naruto.php?id_exc=<?php echo $v['id'];?>">Excluir</a>
             <?php         } ?> 
                        
                     
                        </h4>
                <p><?php echo $v['comentarios']; ?></p>
                </div> 

        <?php    }
          }else
          {
            ?>
            <?php 
    echo "";
}

?>
   </section>
   
   <?php require('../editaveis/populares.php') ?>
   <footer class="footeranime">
        <div id="footer_copyright">
        <a href="#" class="logo">&#169; <i class="fas fa-crown"></i>AnimesClub</a>
        </div>
    </footer>
        </section>
        </section>
        
    </main>
    


   <main class="mmob"></main>
   
    <script src="scriptep.js"></script>
</body>

</html>

<?php
if (isset($_GET['id_exc']))
{
    $id_e = addslashes($_GET['id_exc']);
    if(isset($_SESSION['id_master']))
    {
      
        $c->excluirComentario($id_e,$_SESSION['id_master']);
    }elseif (isset($_SESSION['id']))
{
    $c->excluirComentario($id_e,$_SESSION['id']);

}
 echo "<script> window.location.href='naruto.php';</script>";
}

?>
<?php

if(isset($_POST['texto']))
{
    $texto = addslashes($_POST['texto']);
    if (isset($_SESSION['id_master']))
    {
        $c->inserirComentario($_SESSION['id_master'], $texto);
    }elseif (isset($_SESSION['id']))
    {
    $c->inserirComentario($_SESSION['id'], $texto);
}
echo "<script> window.location.href='naruto.php';</script>";
}
?>