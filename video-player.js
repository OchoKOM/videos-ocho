function video_player() {
    const player = document.querySelector('.player'),
        loader_spinner = document.querySelector('.loader'),
        timeline = document.querySelector('.timeline'),
        loaded_progress = document.querySelector('.loaded-progress'),
        play_pause_btn = document.querySelector('.play-pause-btn'),
        mute_btn = document.querySelector('.mute-btn'),
        volume_slider = document.querySelector('.volume-slider'),
        preview_thumb_el = document.querySelector('.preview-thumb'),
        video = document.getElementById('main-video'),
        preview_thumbnails = generate_thumbnails(video.src),
        current_time_el = document.querySelector('.current-time'),
        total_time_el = document.querySelector('.total-time'),
        auto_play = document.querySelector('.auto-play'),
        settings_btn = document.querySelector('.settings-btn'),
        settings_menu = document.querySelector('.settings-menu'),
        main_menus_ = settings_menu.querySelectorAll('.main-section .drop-item'),
        menus = settings_menu.querySelectorAll('.drop'),
        back_btns = settings_menu.querySelectorAll('.drop .back-icon'),
        quality_ul = settings_menu.querySelector('.quality-drop ul'),
        playbacks = settings_menu.querySelectorAll('.speed-drop li'),
        pip_btn = document.querySelector('.pip-btn'),
        cinema_btn = document.querySelector('.cinema-btn'),
        fullscreen_btn = document.querySelector('.fullscreen-btn'),
        video_container = document.querySelector('.player'),
        play_pause_icon = play_pause_btn.querySelector('svg');

    document.addEventListener('keydown', e => {
        const tag_name = document.activeElement.tagName.toLocaleLowerCase();
        if (tag_name === 'input') return
        switch (e.key.toLocaleLowerCase()) {
            case ' ':
                if (tag_name === 'button') return
            case 'k':
                toggle_play()
                break;
            case 'm':
                toggle_mute()
                break;
            case 'arrowleft':
            case 'j':
                skip(-5)
                break;
            case 'arrowright':
            case 'l':
                skip(5)
                break;
            case 'i':
                toggle_pip()
                break;
            case 't':
                toggle_cinema_mode()
                break;
            case 'f':
                toggle_fullscreen_mode()
                break;

        }
    })

    //! Play/pause
    const play_pause_svg = {
        play: '<use xlink:href="#play-icon-fill"></use>',
        pause: '<use xlink:href="#pause-icon-fill"></use>'
    }
    function toggle_play() {
        video.paused ? play_video() : pause_video();
    }

    function play_video() {
        video_container.classList.remove('paused');
        // Change the play icon xlink:href
        play_pause_icon.innerHTML = play_pause_svg['pause'];
        // Change the play icon title
        play_pause_icon.title = video.paused ? 'Lire(k)' : 'Pause(k)';
        // Change the video state
        video.play();
        loader_spinner.classList.add('active');
    }
    loader_spinner.classList.add('active');

    // Fonction pause
    function pause_video() {
        video_container.classList.add('paused');
        // Change the play icon xlink:href
        play_pause_icon.innerHTML = play_pause_svg['play'];
        // Change the play icon title
        play_pause_icon.title = video.paused ? 'Lire(k)' : 'Pause(k)';
        // Change the video state
        video.pause();
    }

    video.addEventListener('click', toggle_play)
    play_pause_btn.addEventListener('click', toggle_play)
    video.addEventListener('play', play_video)
    video.addEventListener('pause', pause_video)

    // ! Volume

    mute_btn.addEventListener('click', toggle_mute)
    function toggle_mute() {
        if (video.volume !== 0) {
            localStorage.setItem('volume', video.volume)
            video.volume = 0
        } else {
            let stored_volume = parseFloat(localStorage.getItem('volume')) || 1
            video.volume = isFinite(stored_volume) ? stored_volume : 1
        }
    }
    video.addEventListener('volumechange', volume_change);
    volume_slider.addEventListener('change', () => {
        volume_slide(volume_slider.value);
    });
    volume_slider.addEventListener('mousemove', () => {
        volume_slide(volume_slider.value);
    });
    function volume_change() {
        let volume_svg = [
            '<use xlink:href="#volume-muted-icon"></use>',
            '<use xlink:href="#volume-low-icon"></use>',
            '<use xlink:href="#volume-high-icon"></use>',
        ];

        volume_slider.value = video.volume;
        let video_volume = video.volume;
        // Détermine le niveau sonore en fonction des conditions
        video_volume = video_volume > 0.5 ? 2 : (video_volume !== 0 ? 1 : 0);
        // Mettre à jour l'icône du bouton de sourdine en fonction du niveau sonore
        mute_btn.querySelector('svg').innerHTML = volume_svg[video_volume];
    }

    function volume_slide(level) {
        video.volume = level;
    }

    // ! Duration
    video.addEventListener("waiting", () => {
        loader_spinner.classList.remove('active');
        video.addEventListener("canplay", () => {
            loader_spinner.classList.add('active');
        })
    })
    video.oncanplaythrough
    video.addEventListener("canplaythrough", () => {
        loader_spinner.classList.add('active');
    })
    video.addEventListener("loadeddata", () => {
        total_time_el.textContent = format_duration(video.duration);
    })
    video.onloadeddata = () => {
        total_time_el.textContent = format_duration(video.duration);
    }
    video.addEventListener("timeupdate", () => {
        current_time_el.textContent = format_duration(video.currentTime);
        total_time_el.textContent = format_duration(video.duration);
        let progress_position = (video.currentTime / video.duration) || 1
        timeline.style.setProperty('--progress-position', progress_position);
    })
    setInterval(() => {
        draw_progress(loaded_progress, video.buffered, video.duration);
    }, 1000);
    timeline.addEventListener('pointermove', (e) => {
        total_time_el.textContent = format_duration(video.duration);
        let preview_position = (e.layerX / timeline.clientWidth) || 1;
        preview_thumb_el.setAttribute('data-time', format_duration(video.duration * preview_position))
        if (e.offsetX > (timeline.clientWidth - 80)) {
            timeline.style.setProperty('--overflow-pos', "-80px");
            timeline.style.setProperty('--preview-position', 1);
        } else if (e.offsetX < 80) {
            timeline.style.setProperty('--preview-position', 0);
            timeline.style.setProperty('--overflow-pos', "80px");
        } else {
            timeline.style.setProperty('--overflow-pos', '0px');
            timeline.style.setProperty('--preview-position', preview_position);
        }
        preview_thumbnails.then(async thumbnails => {
            thumbnails.forEach(async thumbnail => {
                if (await thumbnail.data) {
                    let seconds = thumbnail.sec;
                    seconds.forEach(sec => {
                        if (sec['index'] === Math.floor(video.duration * preview_position)) {
                            preview_thumb_el.style.setProperty('--thumbnail-bg', `url(${thumbnail.data})`);
                            preview_thumb_el.style.setProperty('--thumblail-pos-x', `${sec.backgroundPositionX}px`);
                            preview_thumb_el.style.setProperty('--thumblail-pos-y', `${sec.backgroundPositionY}px`);
                        }
                    });
                }
            });
        })

    })
    timeline.addEventListener('pointerdown', () => {
        timeline.addEventListener('click', skip_time);
        timeline.addEventListener('pointermove', skip_time);
        document.addEventListener('pointerup', () => {
            timeline.removeEventListener('pointermove', skip_time);
        })
    })
    function skip_time(e) {
        if (e.target !== timeline) {
            console.log(e.target);
            return
        }
        let time_percent = (e.offsetX / timeline.clientWidth);
        timeline.style.setProperty('--progress-position', time_percent);
        video.currentTime = video.duration * time_percent;
    }


    const leading_zero_formatter = new Intl.NumberFormat(undefined, {
        minimumIntegerDigits: 2,
    })
    function format_duration(time) {
        time = isNaN(time) ? 0 : time;
        const seconds = Math.floor(time % 60)
        const minutes = Math.floor(time / 60) % 60
        const hours = Math.floor(time / 3600)
        let formated = `${hours}:${leading_zero_formatter.format(minutes)}:${leading_zero_formatter.format(seconds)}`
        if (hours === 0) {
            formated = `${minutes}:${leading_zero_formatter.format(seconds)}`;
        }
        return formated;
    }
    function skip(time) {
        video.currentTime += time;
    }
    video.addEventListener('progress', () => {
        draw_progress(loaded_progress, video.buffered, video.duration);
    })
    video.onprogress = () => {
        draw_progress(loaded_progress, video.buffered, video.duration);
    }
    function draw_progress(canvas, buffered, duration) {
        // Récupère le contexte du canvas
        let context = canvas.getContext('2d', { antialias: false })
        // Définit la couleur de remplissage du rectangle
        context.fillStyle = '#ffffff66'

        // Récupère la hauteur et la largeur du canvas
        let height = canvas.height
        let width = canvas.width
        // Vérifie que la hauteur et la largeur sont définies
        if (!height || !width)
            throw "La largeur ou la hauteur du canvas n'est pas définie."
        // Efface le contenu précédent du canvas
        context.clearRect(0, 0, width, height)

        // Parcourt les différentes plages tamponnées de la vidéo
        for (let i = 0; i < buffered.length; i++) {
            // Calcule la position de début et de fin de chaque plage tamponnée en fonction de la durée totale de la vidéo et de la largeur du canvas
            let leadingEdge = (buffered.start(i) / duration) * width
            let trailingEdge = (buffered.end(i) / duration) * width
            // Dessine un rectangle rempli pour chaque plage tamponnée
            context.fillRect(leadingEdge, 0, trailingEdge - leadingEdge, height)
        }
    }

    // ! autoplay 
    function auto_play_get() {
        const saved_autoplay = sessionStorage.getItem('auto-play');
        video.autoplay = saved_autoplay ? true : false;
        saved_autoplay ? auto_play.classList.add('active') : auto_play.classList.remove('active')
    }
    auto_play_get();
    auto_play.addEventListener('click', toggle_autoplay)
    function toggle_autoplay() {
        auto_play.classList.toggle('active');
        video.autoplay = auto_play.classList.contains('active');
        save_autoplay();
    }
    function save_autoplay() {
        // Sauvearder les preferences de lecture automatique ici
        auto_play.classList.contains('active') ?
            sessionStorage.setItem('auto-play', 'on') : sessionStorage.removeItem('auto-play')
    }

    //! View modes
    cinema_btn.addEventListener('click', toggle_cinema_mode)
    document.addEventListener('fullscreenchange', change_fullscreen)
    fullscreen_btn.addEventListener('click', toggle_fullscreen_mode)
    pip_btn.addEventListener('click', toggle_pip)

    function toggle_cinema_mode() {
        const cinema_svg = {
            on: '<use xlink:href="#cinema-wide-icon-fill"></use>',
            off: '<use xlink:href="#cinema-tall-icon-fill"></use>'
        }
        video_container.classList.toggle('cinema');
        cinema_btn.querySelector('svg').innerHTML = video_container.classList.contains('cinema') ? cinema_svg['on'] : cinema_svg['off'];
    }
    function toggle_fullscreen_mode() {
        document.fullscreenElement === null ?
            video_container.requestFullscreen() : document.exitFullscreen();
    }
    function change_fullscreen() {
        const fullscreen_svg = {
            on: '<use xlink:href="#fullscreen-close-icon-fill"></use>',
            off: '<use xlink:href="#fullscreen-open-icon-fill"></use>'
        }
        video_container.classList.toggle('fullscreen');
        fullscreen_btn.querySelector('svg').innerHTML = video_container.classList.contains('fullscreen') ? fullscreen_svg['on'] : fullscreen_svg['off'];
    }
    function toggle_pip() {
        if (document.fullscreenElement !== null) {
            document.exitFullscreen()
        }
        document.pictureInPictureElement === null ?
            video.requestPictureInPicture() : document.exitPictureInPicture();
    }
    // ! Settings 
    // activer la section des parametres
    settings_btn.addEventListener("click", toggle_settings);
    player.addEventListener('mouseleave', remove_settings);
    function toggle_settings() {
        settings_btn.classList.toggle('active');
        settings_menu.classList.toggle('active');
        settings_menu.classList.contains('active') ? settings_void() : remove_settings();
    }
    // Fonction pour enlever les parametres
    function remove_settings() {
        remove_active_class(settings_btn)
        remove_active_class(settings_menu)
        remove_active_classes(menus)
    }

    function settings_void() {
        main_menus_.forEach(menu => {
            menu.addEventListener('click', () => {
                const menu_id = menu.getAttribute('data-drop');
                remove_active_classes(menus)
                document.getElementById(menu_id).classList.add('active');
            })
        });
        back_btns.forEach(btn => {
            btn.addEventListener('click', () => {
                remove_active_classes(menus);
            })
        });

        quality_void()
        caption_void()
        playback_speed_void()
    }
    // qualite
    let quality_array = [];

    // Afficher les paramètres de qualité
    const sizes = document.querySelectorAll('[size]');

    // Convertir NodeList en tableau
    const sizesArray = Array.from(sizes);

    // Créer un tableau d'objets avec les données de taille
    const qualityDataArray = sizesArray.map(size => {
        return {
            data_quality: Number(size.getAttribute('size')),
            source: size.getAttribute('src'),
            current_quality: video.getAttribute('size'),
            active: Number(video.getAttribute('size')) === Number(size.getAttribute('size')) ? ' active' : '',
            tagName: size.tagName.toLowerCase(),
        };
    });

    // Trier le tableau d'objets par taille décroissante
    qualityDataArray.sort((a, b) => b.data_quality - a.data_quality);

    // Parcourir le tableau trié et ajouter les éléments à la liste
    qualityDataArray.forEach(data => {
        const size_li = `
        <li data-quality="${data.data_quality}">
            <div class="check${data.active}"></div>
            <span>${data.data_quality}p</span>
        </li>
    `;
        const source_html = `<source src="${data.source}" size="${data.data_quality}">`;

        if (data.tagName === 'video') video.innerHTML += source_html;
        quality_ul.innerHTML += size_li;
        quality_array.push(data.data_quality);
    });

    function quality_void() {
        const quality_li = quality_ul.querySelectorAll('li');
        quality_li.forEach(e => {
            const all_checks = e.parentNode.querySelectorAll('.check');
            e.addEventListener('click', () => {
                remove_active_classes(all_checks)
                e.querySelector('.check').classList.add('active');
                const size = Number(e.getAttribute('data-quality'));
                const sources = video.querySelectorAll('source');
                sources.forEach(source => {
                    if (Number(source.getAttribute('size')) === size
                        && Number(video.getAttribute('size')) !== size) {
                        let current_time = video.currentTime;
                        let temp_video = document.createElement('video');
                        temp_video.src = source.src
                        temp_video.currentTime = current_time;
                        temp_video.volume = 0
                        temp_video.autoplay = true;
                        temp_video.addEventListener('canplay', ()=>{
                            video.src = source.src;
                            video.currentTime = temp_video.currentTime;
                            video.autoplay = true;
                            video.setAttribute('size', size);
                            temp_video.remove();
                        })
                    }
                });
            })
        })
    }
    function caption_void() {

    }
    function playback_speed_void() {
        playbacks.forEach(e => {
            const all_checks = e.parentNode.querySelectorAll('.check');
            e.addEventListener('click', () => {
                remove_active_classes(all_checks)
                e.querySelector('.check').classList.add('active');
                let video_speed = Number(e.getAttribute('data-speed'))
                video.playbackRate = video_speed;
            })
        })
    }
    function remove_active_classes(elements) {
        elements.forEach(element => {
            remove_active_class(element)
        });
    }
    function remove_active_class(element) {
        element.classList.contains('active') && element.classList.remove('active');
    }
}
function generate_thumbnails(src) {
    return new Promise((resolve, reject) => {
        let thumb = false;
        let thumbnails = []
        let thumbnailWidth = 160
        let thumbnailHeight = thumbnailWidth * 9 / 16
        let horizontalItemCount = 5
        let verticalItemCount = 5

        let preview_video = document.createElement('video')
        preview_video.preload = 'metadata'
        preview_video.width = '250'
        preview_video.height = '250'
        preview_video.src = src;

        preview_video.addEventListener('loadeddata', async function () {
            var count = 1,
                id = 1,
                x = 0,
                y = 0,
                array = [],
                duration = parseInt(preview_video.duration);

            for (var i = 1; i <= duration; i++) {
                array.push(i)
            }

            var canvas, i, j;

            for (i = 0, j = array.length; i < j; i += horizontalItemCount) {
                for (var startIndex of array.slice(i, i + horizontalItemCount)) {
                    var backgroundPositionX = x * thumbnailWidth,
                        backgroundPositionY = y * thumbnailHeight,
                        item = thumbnails.find(x => x.id === id);

                    if (!item) {
                        canvas = document.createElement('canvas');
                        canvas.width = thumbnailWidth * horizontalItemCount;
                        canvas.height = thumbnailHeight * verticalItemCount;
                        thumbnails.push({
                            id: id,
                            canvas: canvas,
                            sec: [{
                                index: startIndex,
                                backgroundPositionX: -backgroundPositionX,
                                backgroundPositionY: -backgroundPositionY
                            }]
                        })
                    } else {
                        canvas = item.canvas;
                        item.sec.push({
                            index: startIndex,
                            backgroundPositionX: -backgroundPositionX,
                            backgroundPositionY: -backgroundPositionY
                        })
                    };

                    var context = canvas.getContext('2d');
                    preview_video.currentTime = startIndex;

                    await new Promise(function (resolve) {
                        var event = function () {
                            context.drawImage(preview_video, backgroundPositionX, backgroundPositionY, thumbnailWidth, thumbnailHeight);
                            x++;
                            preview_video.removeEventListener('canplay', event);
                            resolve()
                        };
                        preview_video.addEventListener('canplay', event);
                    });
                    // fin de la generation de l'image
                    count++;
                };
                x = 0;
                y++;
                if (count > horizontalItemCount * verticalItemCount) {
                    count = 1;
                    x = 0;
                    y = 0;
                    id++
                }
            }

            thumbnails.forEach(function (item) {
                item.canvas.toBlob(blob => {
                    item.data = URL.createObjectURL(blob)
                }, 'image/webp');
                delete item.canvas;
            });

            thumb = true;
            resolve(thumbnails);
        });
    });
}

video_player();