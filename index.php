<?php

if(!isset($_SESSION)) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/inicio.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
        integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <title>Animes Club</title>
</head>

<body>
    <style>
        body {
            background-color: black
        }
    </style>
<header>
        <nav class="nav-bar">
        <a href="#" class="logo"><i class="fas fa-crown"></i>AnimesClub</a>
            </div>
            <div class="nav-list">
                <ul>
                    <li class="nav-item"><a href="" class="nav-link">Início</a></li>
                    <li class="nav-item"><a href="#footer_content" class="nav-link"> Suporte</a></li>
                </ul>
            </div>

            <?php
              if (isset($_SESSION['id_master']) || isset($_SESSION['id_usuario']))
              { ?>
<div class="wrapper">
        <div class="navbar">
            <div class="nav_right">
                <ul>
                    <li class="nr_li dd_main">
                        <button><a>Conectado</a></button>

                        <div class="dd_menu">
                            <div class="dd_left">
                                <ul>
                                    <li><a href=""><i class="fas fa-user"></i></li>
                                    <li><a href=""><i class="fas fa-cog"></a></i></li><br>
                                    <li><a href=""><i class="fas fa-sign-out-alt"></a></i></li>
                                </ul>
                            </div>
                            <div class="dd_right">
                                <ul>
                                    <li><?php echo $_SESSION['user_name'];?></li>
                                    <li><a href="assets/login/change-password.php">Mudar senha</a></li>
                                    <li><a href="assets/login/logout.php">Sair</a></li>
                                    
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
                <?php
                }else
                { ?>
                <div class="login-button">
                <button><a href="assets/login/login-ix.php">Entrar</a></button>
                </div>
                <?php
                }
                ?>

            <div class="mobile-menu-icon">
                <button onclick="menuShow()"><img class="icon" src="assets/img/menu_white_36dp.svg" alt=""></button>
            </div>
            <div class="mobile-procurar-icon">
                <button onclick="menuShows()"><img class="procurar" src="assets/img/lupa.png" width="35"
                        alt=""></button>
            </div>


        </nav>
        <div class="mobile-menu">
            <ul>
                <li class="nav-item"><a href="" class="nav-link">Início</a></li>
                <li class="nav-item"><a href="#footer_content" class="nav-link">Suporte</a></li>
                <?php
             if (isset($_SESSION['id_master']) || isset($_SESSION['id_usuario']))
             { ?>
                <li class="nav-item"><a href="assets/login/change-password.php" class="nav-link">Trocar senha</a></li>
            </ul>

            <div class="login-button">
                <button><a href="assets/login/logout.php">Sair da conta <?php echo $_SESSION['user_name'];?> </a></button>
                <?php
                }else
                { ?>
                <div class="login-button">
                <button><a href="assets/login/login-ix.php">Entrar</a></button>
                </div>
                <?php
                }
                ?>

            </div>

        </div>

        </ul>
        </div>

        </div>
    </header>

    <div class="search-box">
        <input onkeyup="filtrar()" type="text" id="inputBusca" class="search-text" placeholder="Buscar...">
        <i class="fas fa-search" id="search-icon"></i>
        <ul class="listaProdutos">
        </ul>
    </div>

    <section class="containerproje">
        <div class="slide-container active">
            <div class="slide">
                <div class="contentproje">
                    <h3>One Piece</h3>
                    <p>One Piece é uma série de anime e manga sobre as aventuras de Monkey D. Luffy, um jovem que ganha
                        poderes de borracha depois de comer uma fruta do diabo. Luffy e os seus amigos, os Piratas de
                        Chapéu de Palha, procuram o One Piece, um tesouro inimaginável que pertenceu a Joy Boy durante o
                        Século Perdido e que se diz...</p>
                    <a href="assets/naruto/naruto.php" class="bntproj">Assistir</a>
                </div>
            </div>
        </div>

        <div class="slide-container">
            <div class="slide">
                <div class="contentproje">
                    <h3>Jujutsu Kaisen</h3>
                    <p>Jujutsu Kaisen é uma jornada épica que começa com Yuji Itadori, um estudante colegial comum que
                        tem sua vida transformada após um encontro fatídico com o sobrenatural. Quando Yuji
                        acidentalmente liberta uma terrível maldição contida em um artefato amaldiçoado, ele se vê
                        imerso em um mundo de trevas e perigo.</p>
                    <a href="" class="bntproj">Assistir</a>
                </div>
            </div>
        </div>

        <div class="slide-container">
            <div class="slide">
                <div class="contentproje">
                    <h3>Naruto Shippuden</h3>
                    <p>A série gira em torno das aventuras vividas por Naruto Uzumaki, um jovem órfão habitante da
                        Aldeia da Folha que sonha em se tornar o quinto Hokage, o maior guerreiro e governante da vila.
                        Ao se graduar como ninja, Naruto descobre que tem um demônio raposa selado dentro de si.</p>
                    <a href="assets/naruto/naruto.php" class="bntproj">Assistir</a>
                </div>
            </div>
        </div>


        <div id="prev" onclick="prev()"> <i class="fa-solid fa-chevron-left"></i></div>
        <div id="next" onclick="next()"><i class="fa-solid fa-chevron-right"></i></div>

            </section>
    <section class="product">
        <h2 class="novidade">Novidades</h2>
        <button class="pre-btn"><img src="assets/img/arrow.png" alt=""></button>
        <button class="nxt-btn"><img src="assets/img/arrow.png" alt=""></button>
        <div class="product-container">


            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/demonslayer.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Demon Slayer</h2>
                    <p class="product-short-description">Lengendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>

            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/narutoc.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Naruto Classico</h2>
                    <p class="product-short-description">Lengendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>


            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/narutos.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Naruto Shippuden</h2>
                    <p class="product-short-description">Lengendado/Dublado</p>
                    <span class="desc">Filme</span>
                </div>
            </div>


            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/dgz.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Dragon Ball Z</h2>
                    <p class="product-short-description">Lengendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/onep.webp" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">One Piece</h2>
                    <p class="product-short-description">Lengendado/Dublado</p>
                    <span class="desc">Filme</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/demonslayer.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Demon Slayer</h2>
                    <p class="product-short-description">Lengendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/dgz.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Dragon Ball Z</h2>
                    <p class="product-short-description">Lengendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/narutos.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Naruto Shippuden</h2>
                    <p class="product-short-description">Lengendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/dgz.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Dragon Ball Z</h2>
                    <p class="product-short-description">Lengendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/narutos.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Naruto Shippuden</h2>
                    <p class="product-short-description">Lengendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>
        </div>
    </section>
    <section class="product">
        <h2 class="novidade"><b>Populares</b></h2>
        <button class="pre-btn"><img src="assets/img/arrow.png" alt=""></button>
        <button class="nxt-btn"><img src="assets/img/arrow.png" alt=""></button>
        <div class="product-container">


            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/demonslayer.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Demon Slayer</h2>
                    <p class="product-short-description">Legendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>

            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/narutoc.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Naruto Classico</h2>
                    <p class="product-short-description">Legendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>


            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/narutos.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Naruto Shippuden</h2>
                    <p class="product-short-description">Legendado/Dublado</p>
                    <span class="desc">Filme</span>
                </div>
            </div>


            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/dgz.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Dragon Ball Z</h2>
                    <p class="product-short-description">Legendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/onep.webp" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">One Piece</h2>
                    <p class="product-short-description">Legendado/Dublado</p>
                    <span class="desc">Filme</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/demonslayer.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Demon Slayer</h2>
                    <p class="product-short-description">Legendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/dgz.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Dragon Ball Z</h2>
                    <p class="product-short-description">Legendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/narutos.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Naruto Shippuden</h2>
                    <p class="product-short-description">Legendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/dgz.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Dragon Ball Z</h2>
                    <p class="product-short-description">Legendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">
                    <span class="qualidade-tag"><a class="card-b" href="#">HD</a></span>
                    <img src="assets/img/imgp/narutos.jpg" class="product-thumb" alt="">
                    <button class="card-btn"><a class="card-b" href="#">Assistir</a></button>
                </div>
                <div class="product-info">
                    <h2 class="product-brand">Naruto Shippuden</h2>
                    <p class="product-short-description">Legendado/Dublado</p>
                    <span class="desc">Serie</span>
                </div>
            </div>
        </div>
    </section>
    <?php require('assets/editaveis/footer.php') ?>
    <script src="script.js"></script>
            </body>

</html>