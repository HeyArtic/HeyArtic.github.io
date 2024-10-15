<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Animes Club</title>
    <link rel="stylesheet" href="../css/inicio.css">
    <link rel="stylesheet" href="../css/logiin.css">
    <link rel="stylesheet" href="../css/episss.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
        integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>

<body>
    <style>
        body {
            background-color: rgb(48, 48, 48);
        }
    </style>
       <header>
        <nav class="nav-bar">
        <a href="#" class="logo"><i class="fas fa-crown"></i>AnimesClub</a>
            </div>
            <div class="nav-list">
                <ul>
                    <li class="nav-item"><a href="../../index.php" class="nav-link">Início</a></li>
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
                                    <li><a href="../login/change-password.php">Mudar senha</a></li>
                                    <li><a href="../login/logout.php">Sair</a></li>
                                    
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
                <button><a href="../login/login-ix.php">Entrar</a></button>
                </div>
                <?php
                }
                ?>

            <div class="mobile-menu-icon">
                <button onclick="menuShow()"><img class="icon" src="../img/menu_white_36dp.svg" alt=""></button>
            </div>
            <div class="mobile-procurar-icon">
                <button onclick="menuShows()"><img class="procurar" src="../img/lupa.png" width="35"
                        alt=""></button>
            </div>


        </nav>
        <div class="mobile-menu">
            <ul>
                <li class="nav-item"><a href="../../index.php" class="nav-link">Início</a></li>
                <li class="nav-item"><a href="#footer_content" class="nav-link">Suporte</a></li>
                <?php
             if (isset($_SESSION['id_master']) || isset($_SESSION['id_usuario']))
             { ?>
                <li class="nav-item"><a href="../login/change-password.php" class="nav-link">Trocar senha</a></li>
            </ul>

            <div class="login-button">
                <button><a href="../login/logout.php">Sair da conta <?php echo $_SESSION['user_name'];?> </a></button>
                <?php
                }else
                { ?>
                <div class="login-button">
                <button><a href="../login/login-ix.php">Entrar</a></button>
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