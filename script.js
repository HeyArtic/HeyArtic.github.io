
function menuShow() {
    let menuMobile = document.querySelector('.mobile-menu');
    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        document.querySelector('.icon').src = "assets/img/menu_white_36dp.svg";
    } else {
        menuMobile.classList.add('open');
        document.querySelector('.icon').src = "assets/img/close_white_36dp.svg";
    }
}
function menuShows() {
    let menuMobile = document.querySelector('.search-box');
    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        document.querySelector('.procurar').src = "assets/img/lupa.png";
    } else {
        menuMobile.classList.add('open');
        document.querySelector('.procurar').src = "assets/img/lupa.png";
    }
}

fetch('buscas.json')
    .then(res => res.json())
    .then((json) => {
        const ul = document.querySelector('.listaProdutos');
        json.forEach((buscas) => {
            const li = document.createElement("li");
            li.innerHTML = `
                    <a href="${buscas.url}">
                            <img width="50" src="${buscas.image}">
                            <span class="item-name">${buscas.title}</span>
                         
                        </a>
                           
    `
            ul.appendChild(li);

        })
    })

function filtrar() {
    var input,
        filter,
        ul,
        li,
        a,
        i,
        txtValue,
        span,
        count = 0

    input = document.getElementById('inputBusca');
    ul = document.querySelector('.listaProdutos');
    filter = input.value.toUpperCase();
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            count++
            span = li[i].querySelector(".item-name");
            if (span) {
                span.innerHTML = txtValue.replace(new RegExp(filter, "gi"), (match) => {
                    return "" + match + "";
                })

            }

        } else {
            li[i].style.display = "none";
        }
    }
    if (count === 0) {
        ul.style.display = "none";

    } else {
        ul.style.display = "block";
    }

    if (filter === "") {
        ul.style.display = "none";

    } else {
        ul.style.display = "block";
    }
}
let slides = document.querySelectorAll('.slide-container');
let index = 0;

function next() {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
}

function prev() {
    slides[index].classList.remove('active');
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add('active');
}

setInterval(next, 7000);

const productContainers = [...document.querySelectorAll('.product-container')];
const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
const preBtn = [...document.querySelectorAll('.pre-btn')];

productContainers.forEach((item, i) => {
    let containerDimensions = item.getBoundingClientRect();
    let containerWidth = containerDimensions.width;

    nxtBtn[i].addEventListener('click', () => {
        item.scrollLeft += containerWidth;
    })

    preBtn[i].addEventListener('click', () => {
        item.scrollLeft -= containerWidth;
    })
})

var dd_main = document.querySelector(".dd_main");

dd_main.addEventListener("click", function () {
    this.classList.toggle("active");
})