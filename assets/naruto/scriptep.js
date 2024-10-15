const main_video = document.querySelector('.main-video video');
const main_video_title = document.querySelector('.main-video .title');
const video_playlist = document.querySelector('.video-playlist .videos');

let data = [
    {
        'id': 'a1',
        'title': 'Episódio 1',
        'name': '1/a1149530-55e9-4b57-acc2-3147409690b9/stream.mp4',
        'duration': '2:47',
    },
    {
        'id': 'a2',
        'title': 'Episódio 2',
        'name': '2/92ddd757-faa1-42d7-bcbd-c328344e5d65/stream.mp4',
        'duration': '2:45',
    },
    {
        'id': 'a3',
        'title': 'Episódio 3',
        'name': '3/8ed5cbea-cef2-4c72-8237-f514ffda644f/stream.mp4',
        'duration': '24:49',
    },

    {
        'id': 'a4',
        'title': 'Episódio 4',
        'name': '4/e332d685-b78b-4249-bbee-954f0de351c8/stream.mp4',
        'duration': '3:59',
    },
    {
        'id': 'a5',
        'title': 'Episódio 5',
        'name': '5/f4fc9394-96a1-41c5-bf9e-e3b02ad993af/stream.mp4',
        'duration': '4:25',
    },
    {
        'id': 'a6',
        'title': 'Episódio 6',
        'name': '6/4154549e-3075-4990-adb1-7db1eecb8320/stream.mp4',
        'duration': '5:33',
    },
    {
        'id': 'a7',
        'title': 'Episódio 7',
        'name': '7/dc77e9b6-1dcc-4945-992e-9efdf7abf74f/stream.mp4',
        'duration': '0:29',
    },

    {
        'id': 'a8',
        'title': 'Episódio 8',
        'name': '8/de6f7ab8-5a84-43cc-b3f0-559701d0e18e/stream.mp4',
        'duration': '1:12',
    },
    {
        'id': 'a9',
        'title': 'Episódio 9',
        'name': '9/e60b366b-bb65-4f8b-9521-dcb200b04c89/stream.mp4',
        'duration': '3:38',
    },
    {
        'id': 'a10',
        'title': 'Episódio 10',
        'name': '10/8ed3b4c7-88bb-4a9a-9c7a-3c076c14fbef/stream.mp4',
        'duration': '3:38',
    },
    {
        'id': 'a11',
        'title': 'Episódio 11',
        'name': '11/4b9286ed-e235-4854-8c28-b292e22fbb26/stream.mp4',
        'duration': '2:47',
    },
    {
        'id': 'a12',
        'title': 'Episódio 12',
        'name': '12/d9e4088a-cab9-4fb3-99c6-df9dfb7aefe3/stream.mp4',
        'duration': '2:45',
    },
    {
        'id': 'a13',
        'title': 'Episódio 13',
        'name': '13/423faf02-d67a-44a3-961b-ecb258d94bc1/stream.mp4',
        'duration': '24:49',
    },

    {
        'id': 'a14',
        'title': 'Episódio 14',
        'name': '',
        'duration': '3:59',
    },
    {
        'id': 'a15',
        'title': 'Episódio 15',
        'name': '',
        'duration': '4:25',
    },
    {
        'id': 'a16',
        'title': 'Episódio 16',
        'name': '',
        'duration': '5:33',
    },
    {
        'id': 'a17',
        'title': 'Episódio 17',
        'name': '',
        'duration': '0:29',
    },

    {
        'id': 'a18',
        'title': 'Episódio 18',
        'name': '',
        'duration': '1:12',
    },
    {
        'id': 'a19',
        'title': 'Episódio 19',
        'name': '',
        'duration': '3:38',
    },
    {
        'id': 'a20',
        'title': 'Episódio 20',
        'name': '',
        'duration': '3:38',
    },
    {
        'id': 'a21',
        'title': 'Episódio 11',
        'name': '',
        'duration': '2:47',
    },
    {
        'id': 'a22',
        'title': 'Episódio 12',
        'name': '',
        'duration': '2:45',
    },
    {
        'id': 'a23',
        'title': 'Episódio 13',
        'name': '',
        'duration': '24:49',
    },

    {
        'id': 'a24',
        'title': 'Episódio 14',
        'name': '',
        'duration': '3:59',
    },
    {
        'id': 'a25',
        'title': 'Episódio 15',
        'name': '',
        'duration': '4:25',
    },
    {
        'id': 'a26',
        'title': 'Episódio 16',
        'name': '',
        'duration': '5:33',
    },
    {
        'id': 'a27',
        'title': 'Episódio 17',
        'name': '',
        'duration': '0:29',
    },

    {
        'id': 'a28',
        'title': 'Episódio 18',
        'name': '',
        'duration': '1:12',
    },
    {
        'id': 'a29',
        'title': 'Episódio 19',
        'name': '',
        'duration': '3:38',
    },
    {
        'id': 'a30',
        'title': 'Episódio 20',
        'name': '',
        'duration': '3:38',
    },
    {
        'id': 'a31',
        'title': 'Episódio 11',
        'name': '',
        'duration': '2:47',
    },
    {
        'id': 'a32',
        'title': 'Episódio 12',
        'name': '',
        'duration': '2:45',
    },
    {
        'id': 'a33',
        'title': 'Episódio 13',
        'name': '',
        'duration': '24:49',
    },

    {
        'id': 'a34',
        'title': 'Episódio 14',
        'name': '',
        'duration': '3:59',
    },
    {
        'id': 'a35',
        'title': 'Episódio 15',
        'name': '',
        'duration': '4:25',
    },
    {
        'id': 'a36',
        'title': 'Episódio 16',
        'name': '',
        'duration': '5:33',
    },
    {
        'id': 'a37',
        'title': 'Episódio 17',
        'name': '',
        'duration': '0:29',
    },

    {
        'id': 'a38',
        'title': 'Episódio 18',
        'name': '',
        'duration': '1:12',
    },
    {
        'id': 'a39',
        'title': 'Episódio 19',
        'name': '',
        'duration': '3:38',
    },
    {
        'id': 'a40',
        'title': 'Episódio 20',
        'name': '',
        'duration': '3:38',
    },
    {
        'id': 'a41',
        'title': 'Episódio 11',
        'name': '',
        'duration': '2:47',
    },
    {
        'id': 'a42',
        'title': 'Episódio 12',
        'name': '',
        'duration': '2:45',
    },
    {
        'id': 'a43',
        'title': 'Episódio 13',
        'name': '',
        'duration': '24:49',
    },

    {
        'id': 'a44',
        'title': 'Episódio 14',
        'name': '',
        'duration': '3:59',
    },
    {
        'id': 'a45',
        'title': 'Episódio 15',
        'name': '',
        'duration': '4:25',
    },
    {
        'id': 'a46',
        'title': 'Episódio 16',
        'name': '',
        'duration': '5:33',
    },
    {
        'id': 'a47',
        'title': 'Episódio 17',
        'name': '',
        'duration': '0:29',
    },

    {
        'id': 'a48',
        'title': 'Episódio 18',
        'name': '',
        'duration': '1:12',
    },
    {
        'id': 'a49',
        'title': 'Episódio 19',
        'name': '',
        'duration': '3:38',
    },
    {
        'id': 'a50',
        'title': 'Episódio 20',
        'name': '',
        'duration': '3:38',
    },

];

data.forEach((video, i) => {
    let video_element = `
                <div class="video" data-id="${video.id}">
                    <img src="../img/play1.svg" alt="">
                    <p>${i + 1 > 9 ? i + 1 : '0' + (i + 1)}. </p>
                <h3 class="title">${video.title}</h3>
                    
                </div>
    `;
    video_playlist.innerHTML += video_element;
})

let videos = document.querySelectorAll('.video');
videos[0].classList.add('active');
videos[0].querySelector('img').src = '../img/pause1.svg';

videos.forEach(selected_video => {
    selected_video.onclick = () => {

        for (all_videos of videos) {
            all_videos.classList.remove('active');
            all_videos.querySelector('img').src = '../img/play1.svg';

        }

        selected_video.classList.add('active');
        selected_video.querySelector('img').src = '../img/pause1.svg';

        let match_video = data.find(video => video.id == selected_video.dataset.id);
        main_video.src = 'https://stream.trk-fire.pro/b-12/naruto-fb780c56/dubbed/' + match_video.name;
        main_video_title.innerHTML = match_video.title;
    }
});
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

function menuShow() {
    let menuMobile = document.querySelector('.mobile-menu');
    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        document.querySelector('.icon').src = "../img/menu_white_36dp.svg";
    } else {
        menuMobile.classList.add('open');
        document.querySelector('.icon').src = "../img/close_white_36dp.svg";
    }
}