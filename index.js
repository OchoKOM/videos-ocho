function App() {
  let videos = document.querySelectorAll('video')

  videos.forEach(video => {
    play_video(video);
  });
}
function aside_page() {
  let video_array = []
  let container = document.querySelector('.aside');
  for (let i = 0; i < 10; i++) {
    let datas = {
      id: i + 1,
      title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      user: "Martin Ocho",
      vues: Math.floor(Math.random() * 1000),
      date: Math.floor(Math.random() * 1702123979),
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
    video_section.querySelector('.time').setAttribute('data-date', video.date)
    time_stamp(video_section.querySelector('.time'));
    if (container) {
      container.appendChild(video_section);
    }
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
function format_number(number, language = 'en') {
  // Définir les suffixes par langue
  const suffixes = {
    'en': ['', ' k', ' M', ' B', ' T'],
    'fr': ['', ' k', ' M', ' Md', ' B', ' T'],
  };
  const langSuffixes = suffixes[language] || suffixes['en'];

  let tier = Math.log10(Math.abs(number)) / 3 | 0;
  tier = Math.max(0, Math.min(langSuffixes.length - 1, tier));

  // Formate le nombre en ajoutant le suffixe approprié
  let formattedNumber = (number / Math.pow(1000, tier)).toFixed(2);

  // Supprime les zéros après la virgule si ils sont égaux à zéro
  formattedNumber = formattedNumber.replace(/\.?0*$/, '');

  // Ajoute le suffixe
  formattedNumber += langSuffixes[tier];

  return formattedNumber;
}

// console.log(Math.floor(new Date(new Date('2023-04-13T18:30:00Z').getTime()).getMonth() + 1));
function load_video_data(id) {
  const leading_zero_formatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  })
  function VideoData() {
    this.titre = "Pete & Bas - Stepped Into the Building";
    this.descr = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi fugit, aspernatur sapiente velit natus officia, recusandae nisi itaque deserunt illum quos corrupti suscipit quibusdam, exercitationem expedita! Aliquam, modi veritatis soluta exercitationem aspernatur voluptatibus est. Similique, ab sapiente ratione eveniet officia ex hic modi obcaecati exercitationem delectus eius maiores tempore consectetur vero at earum deleniti labore non nam beatae repellendus? Saepe obcaecati eos sit quo eaque modi. Magni eum distinctio, ex doloremque iste fugit in ad est eligendi obcaecati, tempora illum asperiores at dolore similique consectetur nemo nesciunt. Suscipit laudantium architecto dolorem accusamus cumque, voluptatibus doloremque dolor quidem autem veritatis excepturi.";
    this.views = 700000;
    this.views_formated = format_number(this.views, "fr");
    this.date = 1681410600;
    this.formated_date = formatTime((new Date().getTime() / 1000) - this.date);
    this.year = Math.floor(new Date(this.date * 1000).getFullYear());
    this.ddmm = `${(leading_zero_formatter.format(Math.floor(new Date(this.date * 1000).getDay())))}/${(leading_zero_formatter.format(Math.floor(new Date(this.date * 1000).getMonth() + 1)))}`;
    this.channel = "Pete & Bas";
    this.channel_profile = "profil.jpg";
    this.channel_subs = format_number(10000347, "fr");
    this.likes = 90000;
    this.likes_formated = format_number(this.likes, "fr");
  }

  const video_data = new VideoData();
  let video_comments = [
    {
      id: 0,
      username: "Mister Douche",
      message: "C'est vraiment une vidéo superbe !",
      timestamp: Math.round(Math.random() * 1000000000) / 1000000
    }, {
      id: 1,
      username: "Yoann Boniface",
      message: "Je suis d'accord avec toi Pete.",
      timestamp: Math.round(Math.random() * 1000000000) / 1000000 + 10,
    }
  ].sort((a, b) => a.timestamp - b.timestamp);
  let comment_replies = {
    0: [
      {
        id: 2,
        username: "Ludovic Dupont",
        message: "J'ai pas envie de dire quoi mais c'est vraiment top."
      },{
        id: 3,
        username: "Pete & Bas",
        message: "Merci beaucoup"
      }
    ],
    1: [
      {
        id: 4,
        username: "Fabien Lefebvre",
        message: "Oui oui oui, je comprends tout"
      },{
        id: 5,
        username: "Gauthier Leroy",
        message: "Et si on ajoutait des couleurs ?"
      }
    ]
  };
  let replies_num = 0;
  for (let i = 0; i < comment_replies.length; i++) {
    const replies = comment_replies[i];
    for (let j = 0; j < replies.length; j++) {
      replies_num++
    }
  }

  let video_details_html = `
    <span class="video-title">${video_data.titre}</span>
    <span class="mobile-desc-toggle">
      <span class="views">${video_data.views_formated}</span> vues il y a
      <span class="time">${video_data.formated_date}</span>
      <span class="desc-toggle">...plus</span>
    </span>
    <div class="video-channel">
      <div class="channel-info">
        <div class="channel-section">
          <div class="channel-profile"></div>
          <span class="channel-name">
            <div class="name">${video_data.channel}</div>
            <div class="channel-subs">${video_data.channel_subs} <span class="sub-label"> d'abonnés</span></div>
          </span>
        </div>
        <button type="button" title="S'abonner" class="sub-btn">
          S'aboner
        </button>
      </div>
      <div class="video-actions">
        <div class="react-section like" data-user="1">
          <label class="like-btn like" title="J'aime ce conenu">
            <input type="checkbox" name="like" id="like-check" title="J'aime ce conenu"/>
            <svg height="30" fill="#999">
              <use xlink:href="#thumb-up"></use>
            </svg>
            <span class="react-num" data-num="${video_data.likes}" data-num-formated="${video_data.likes_formated}"></span>
          </label>
          <label class="like-btn dislike">
            <input type="checkbox" name="like" id="dislike-check" title="Je n'aime pas ce conenu"/>
            <svg height="30" fill="#999">
              <use xlink:href="#thumb-down"></use>
            </svg>
            <span class="react-num" data-num=""></span>
          </label>
        </div>
        <div class="react-section">
          <button type="button" title="Partager" class="react-btn">
            <svg height="20" viewBox="0 0 24 24" fill="currentColor">
              <use xlink:href="#share-arrow"></use>
            </svg>
            <span>Partager</span>
          </button>
        </div>
      </div>
    </div>
    <div class="summary comment-toggle">
      <div class="desc-header">
        <h2 class="comment-toggle">
          Commentaires <span class="nbr-count">${video_comments.length + replies_num}</span>
        </h2>
      </div>
      <div class="desc-body">
        <div class="comments">
          <div class="single-comment">
            <div class="comment-content">
              <div class="left-c"></div>
              <form class="right-c">
                <textarea  title="Commenter" placeholder="Commenter" required></textarea>
                <button type="submit" title="Envoyer">
                  <svg height="24" width="24" fill="currentColor">
                    <use xlink:href="#send-icon"></use>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="video-description">
      <div class="desc-header">
        <h2>Description</h2>
        <span class="close-desc">&times;</span>
      </div>
      <hr />
      <div class="desc-body">
        <div class="desc-mobile-title">${video_data.titre}</div>
        <div class="desc-body-h">
          <span class="body-h-section">
            <div>${video_data.likes_formated}</div>
            <span>J'aime</span>
          </span>
          <span class="body-h-section">
            <div>${video_data.views}</div>
            <span>Vues</span>
          </span>
          <span class="body-h-section">
            <div>${video_data.ddmm}</div>
            <span>${video_data.year}</span>
          </span>
        </div>
        <div class="desc-body-text">${video_data.descr}</div>
      </div>
    </div>
    <div class="video-comments">
      <div class="desc-header">
        <h2>Commentaires <span class="nbr-count">${video_comments.length + replies_num}</span></h2>
        <span class="close-desc">&times;</span>
      </div>
      <hr />
      <div class="desc-body">
        <div class="comments">
        <div class="single-comment">
            <div class="comment-content">
              <div class="left-c"></div>
              <form class="right-c">
                <textarea  title="Commenter" placeholder="Commenter" required></textarea>
                <button type="submit" title="Envoyer">
                  <svg height="24" width="24" fill="currentColor">
                    <use xlink:href="#send-icon"></use>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  let video_details = document.querySelector(".video-details");
  video_details.innerHTML = video_details_html;
  let comment_section = video_details.querySelector('.video-comments .comments');
  video_comments.forEach(comment => {
    let single_comment = document.createElement('div');
    single_comment.classList.add("single-comment");
    let single_comment_html = `
            <div class="comment-content" id="comment-${comment.id}">
              <div class="left-c"></div>
              <div class="right-c">
                <h3 class="c-header">${comment.username}</h3>
                <div class="c-body">${comment.message}</div>
              </div>
            </div>
            <div class="comment-replies">
              <div class="desc-header">
                <h3>Reponses <span class="nbr-count">${comment_replies[comment.id].length || ''}</span></h3>
              </div>
              <div class="desc-body"></div>
            </div>
    `;
    single_comment.innerHTML = single_comment_html;
    let comment_replie = single_comment.querySelector('.comment-replies .desc-body');
    comment_replies[comment.id].forEach(reply => {
      let replies_html = `
        <div class="single-reply" id="reply-${reply.id}-from-${comment.id}">
          <div class="left-c"></div>
          <div class="right-c">
            <h4 class="c-header">${reply.username}</h4>
            <div class="c-body"><span class="reply-name">@${comment.username}</span> ${reply.message}</div>
          </div>
        </div>
        `
      comment_replie.innerHTML += replies_html;
    })
    comment_section.appendChild(single_comment);
  })
  update_textareas();
  let descr_toggles = document.querySelectorAll('.mobile-desc-toggle');
  let comment_toggles = document.querySelectorAll('.comment-toggle');
  let description = video_details.querySelector('.video-description');
  let comment_sect = video_details.querySelector('.video-comments');
  descr_toggles.forEach(toggle=>{
    description.classList.remove('active');
    comment_sect.classList.remove('active');
    toggle.addEventListener('click',()=>{
      description.classList.add('active');
    })
  })
  comment_toggles.forEach(toggle=>{
    description.classList.remove('active');
    comment_sect.classList.remove('active');
    toggle.addEventListener('click',()=>{
      comment_sect.classList.add('active');
    })
  })
  close_descs = video_details.querySelectorAll('.close-desc');
  console.log(close_descs.length);
  close_descs.forEach(close_desc=>{
    close_desc.addEventListener('click',()=>{
      comment_sect.classList.remove('active');
      description.classList.remove('active');
    })
  })
}
function update_textareas() {
  let textareas = document.querySelectorAll('textarea')
  textareas.forEach(textarea => {
    textarea.addEventListener("input", () => {
      textarea.style.removeProperty('--text-lines')
      textarea.style.setProperty('--text-lines', (textarea.value.split(/\r?\n|\r/).length + 1.1) + "em")
    })
  });
}

load_video_data(1);