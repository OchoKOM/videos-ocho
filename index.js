function App() {
    let videos = document.querySelectorAll('video')

    videos.forEach(video => {
        play_video(video);
    });
}
function home_page() {
    let video_array = []
    for (let i = 0; i < 10; i++) {
        let datas = {
            id: i + 1,
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            user: "Martin Ocho",
            vues: Math.floor(Math.random() * 1000),
            date: Math.floor(Math.random() * 1702123979),
            source: "video.mp4",
            cover: "img.webp"
        }
        video_array.push(datas);
    }
    video_array.forEach(async video => {
        let video_section = document.createElement('div')
        video_section.className = 'video-section loading';
        video_section.innerHTML = `
        <div class="mini-player">
            <img src="${video.cover}" alt="" style="position:absolute;">
            <video src="" muted autoplay loop poster="${video.cover}"></video>
        </div>
        <div class="video-details">
            <div class="left-d"></div>
            <div class="right-d">
                <div class="v-title">${video.title}</div>
                <div class="v-data">${video.user} • ${video.vues} vues • Il y a <span class="time"></span></div>
            </div>
        </div>
        `
        video_section.querySelector('img').onload = video_section.classList.remove('loading');
        video_section.querySelector('.mini-player').addEventListener('mouseover', () => {
            remove_playing_classes();
            video_section.querySelector('video').src = video.source;
            video_section.classList.add('playing');
            play_video(video_section.querySelector('video'));
            video_section.querySelector('.mini-player').addEventListener('mouseleave', () => {
                remove_playing_class(video_section);
            })
        })
        video_section.querySelector('.time').setAttribute('data-date', video.date)
        time_stamp(video_section.querySelector('.time'));
        let container = document.querySelector('.home');
        if (container) {
            container.appendChild(video_section);
        }
    });
}
App();
function remove_playing_classes() {
    let players = document.querySelectorAll('.video-section')
    players.forEach(player => {
        remove_playing_class(player)
    });
}
function remove_playing_class(player) {
    let video = player.querySelector('video'),
    lights = document.querySelectorAll('.light');
    video.pause()
    video.src = ''
    player.classList.remove('playing')
    if (lights.length !== 0) {
        lights.forEach(light => {
            light.style.setProperty('--hx', 'transparent');
            light.remove();
        });
    }
}
function time_stamp(times = document.querySelectorAll('.time')) {
    let currentDate = new Date().getTime() / 1000
    function updateTimes() {
        if (times.length !== 0 && times === document.querySelectorAll('.time')) {
            times.forEach(time => {
                let date = time.getAttribute('data-date')
                let difference = currentDate - date;
                time.innerHTML = formatTime(difference);
            })
        }
        if (times !== document.querySelectorAll('.time')) {
            let date = times.getAttribute('data-date')
            let difference = currentDate - date;
            times.innerHTML = formatTime(difference);
        }
        requestAnimationFrame(updateTimes);
    }
    updateTimes();
}
function formatTime(time) {
    const units = [
        { label: ' ans', divisor: 3600 * 24 * 365 },
        { label: ' mois', divisor: 2592000 },
        { label: ' sem.', divisor: 604800 },
        { label: ' j', divisor: 86400 },
        { label: ' h', divisor: 3600 },
        { label: ' min', divisor: 60 },
        { label: ' sec', divisor: 1 }
    ];

    for (const unit of units) {
        const value = Math.floor(time / unit.divisor);
        if (value >= 1) {
            return `${value} ${unit.label}`;
        }
    }

    return "A l'instant";
}

function play_video(video) {
    video.controlsList = 'nodownload';
    video.addEventListener('timeupdate', ambiant_light);
}