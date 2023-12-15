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
    ambiant_light(video);
}
function ambiant_light(video) {
    video.addEventListener('timeupdate', () => {
        let temp_video = document.createElement('video');
        temp_video.src = video.src;
        temp_video.currentTime = Math.floor(video.currentTime);
        // Créer un élément canvas pour dessiner le fond
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        temp_video.addEventListener('seeked', () => {
            // Définir la taille du canvas selon la taille de l'image
            canvas.width = temp_video.videoWidth;
            canvas.height = temp_video.videoHeight;

            // Dessiner l'image sur le canvas
            ctx.drawImage(temp_video, 0, 0);

            // Obtenir les données des pixels de l'image
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var pixels = imageData.data;

            // Parcourir les pixels et calculer la moyenne des couleurs
            var r = 0,
                g = 0,
                b = 0,
                n = 0;
            for (var i = 0; i < pixels.length; i += 4) {
                r += pixels[i]; // rouge
                g += pixels[i + 1]; // vert
                b += pixels[i + 2]; // bleu
                n++; // nombre de pixels
            }
            r = Math.round(r / n); // moyenne du rouge
            g = Math.round(g / n); // moyenne du vert
            b = Math.round(b / n); // moyenne du bleu

            // Convertir les valeurs RGB en une chaîne de couleur hexadécimale
            var rgbToHex = function (rgb) {
                var hex = Number(rgb).toString(16);
                if (hex.length < 2) {
                    hex = "0" + hex;
                }
                return hex;
            };
            var hex = "#" + rgbToHex(r) + rgbToHex(g) + rgbToHex(b);

            // Créer un élément div pour afficher le fond
            var light = video.parentNode.querySelector(".light") || document.createElement('div');
            let height_ratio = temp_video.videoWidth + "/" + temp_video.videoHeight;
            // Définir le style du light selon la couleur moyenne et la luminosité
            light.style.setProperty('--hx', hex)
            light.style.setProperty('--ratio', height_ratio)
            video.style.setProperty('--hx', hex);
            if (light !== video.parentNode.querySelector(".light")) {
                light.classList.add('light');
                video.parentNode.insertBefore(light, video);
            }

        })
    })
}