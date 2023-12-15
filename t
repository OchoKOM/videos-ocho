function generate_thumbnails(src) {
    let thumb = false;
    let thumbnails = []
    let thumbnailWidth = 160
    let thumbnailHeight = thumbnailWidth * 9/16
    let horizontalItemCount = 5
    let verticalItemCount = 5
    
    let preview_video = document.createElement('video')
    preview_video.preload = 'metadata'
    preview_video.width = '250'
    preview_video.height = '250'
    preview_video.src = src;
    
    // Attend que la vidéo soit chargée
    preview_video.addEventListener('loadeddata', async function () {
        // Met la vidéo en pause
        preview_video.pause();
        // Initialise les variables
        var count = 1,
            id = 1,
            x = 0,
            y = 0,
            array = [],
            duration = parseInt(preview_video.duration);
        // Crée un tableau contenant tous les indices de temps de la vidéo
        for (var i = 1; i <= duration; i++) {
            array.push(i)
        }
        var canvas, i, j;
        // Parcourt le tableau d'indices de temps par groupes de horizontalItemCount
        for (i = 0, j = array.length; i < j; i += horizontalItemCount) {
            // Parcourt chaque groupe d'indices de temps
            for (var startIndex of array.slice(i, i + horizontalItemCount)) {
                // Calcule la position du fond d'écran pour chaque vignette
                var backgroundPositionX = x * thumbnailWidth,
                    backgroundPositionY = y * thumbnailHeight,
                    item = thumbnails.find(x => x.id === id);
                // Si la vignette n'existe pas encore, crée un nouveau canvas et ajoute la vignette au tableau
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
                    // Si la vignette existe déjà, ajoute l'indice de temps à la vignette existante
                    canvas = item.canvas;
                    item.sec.push({
                        index: startIndex,
                        backgroundPositionX: -backgroundPositionX,
                        backgroundPositionY: -backgroundPositionY
                    })
                };
                var context = canvas.getContext('2d');
                // Définit le temps de la vidéo à l'indice de temps actuel
                preview_video.currentTime = startIndex;
                await new Promise(function (resolve) {
                    var event = function () {
                        // Dessine l'image de la vidéo sur le canvas à la position calculée précédemment
                        context.drawImage(preview_video, backgroundPositionX, backgroundPositionY, thumbnailWidth, thumbnailHeight);
                        x++;
                        preview_video.removeEventListener('canplay', event);
                        resolve()
                    };
                    preview_video.addEventListener('canplay', event);
                });
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
        // Convertit chaque canvas en blob et stocke l'URL du blob dans l'objet vignette correspondant
        thumbnails.forEach(function (item) {
            item.canvas.toBlob(blob => {
                item.data = URL.createObjectURL(blob)
                /* // Envoie le blob au serveur avant de créer l'URL d'objet
                sendBlobToServer(blob, item.id); */
            }, 'image/webp');
            delete item.canvas;
        });    
       /*  function sendBlobToServer(blob, id, backgroundPositionX, backgroundPositionY) {
            // Crée un objet FormData pour envoyer le blob et les informations au serveur
            var formData = new FormData();
            formData.append('thumbnail', blob, 'thumbnail_' + id + '.webp');
            formData.append('backgroundPositionX', backgroundPositionX);
            formData.append('backgroundPositionY', backgroundPositionY);
            formData.append('thumbnailId', id);
        
            // Crée une requête XMLHttpRequest
            var xhr = new XMLHttpRequest();
        
            // Spécifie la méthode HTTP, l'URL du fichier PHP sur le serveur, et indique que la requête est asynchrone
            xhr.open('POST', 'votre_fichier_php.php', true);
        
            // Gère l'événement de fin de la requête
            xhr.onload = function () {
                // Vérifie si la requête a abouti avec succès
                if (xhr.status === 200) {
                    console.log('Blob ' + id + ' envoyé avec succès.');
                } else {
                    console.error('Échec de l\'envoi du blob ' + id + '. Statut de la requête:', xhr.status);
                }
            };
        
            // Envoie la requête avec le FormData contenant le blob et les informations de position
            xhr.send(formData);
        }  */       
        
        thumb = true;
    });
    return thumbnails;
}

// Call this function to initialize the timeline and thumbnails
async function initializeTimeline() {
    const videoSource = 'your_video_source.mp4'; // Replace with your video source
    const thumbnails = await generate_thumbnails(videoSource);
    const timelineContainer = document.getElementById('timeline');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const previewVideo = document.getElementById('previewVideo');

    thumbnails.forEach((item, index) => {
        const timelineElement = document.createElement('div');
        timelineElement.addEventListener('mouseover', () => handleTimelineHover(item, thumbnailContainer));
        timelineContainer.appendChild(timelineElement);

        const thumbnailElement = document.createElement('img');
        thumbnailElement.src = item.data;
        thumbnailElement.classList.add('thumbnail');
        thumbnailContainer.appendChild(thumbnailElement);
    });

    // Set the source of the video once the timeline is initialized
    previewVideo.src = videoSource;
}

function handleTimelineHover(item, thumbnailContainer) {
    // Update the background position of the thumbnail container
    thumbnailContainer.style.backgroundPositionX = `${item.sec[0].backgroundPositionX}px`;
    thumbnailContainer.style.backgroundPositionY = `${item.sec[0].backgroundPositionY}px`;

    // Show the corresponding thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumbnail) => {
        thumbnail.style.display = 'none';
    });

    const thumbnailIndex = item.id - 1; // Adjust as needed
    thumbnails[thumbnailIndex].style.display = 'block';
}

initializeTimeline();

video.addEventListener('progress', () => {
    draw_progress(bufferedBar, video.buffered, video.duration)
})
function draw_progress(canvas, buffered, duration) {
    // Récupère le contexte du canvas
    let context = canvas.getContext('2d', { antialias: false })
    // Définit la couleur de remplissage du rectangle
    context.fillStyle = '#fff'
  
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