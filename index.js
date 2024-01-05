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
  // Exemple of video data
  class VideoData {
    constructor(titre, descr, views = 0, date = 0, channel, channel_profile = false, channel_subs = 0, liked, likes =0, disliked,dislikes =0, ) {
      this.titre = titre || "Untitled Video";
      this.descr = descr || "Aucune description";
      this.views = views;
      this.views_formated = (this.views === 0) ? 'Aucune vue':format_number(this.views, "fr");
      this.date = date || 0;
      this.formated_date = (this.date === 0) ? '-':formatTime((new Date().getTime() / 1000) - this.date);
      this.year = (this.date === 0) ? '-': Math.floor(new Date(this.date * 1000).getFullYear());
      this.ddmm = (this.date === 0) ? '-/-' : `${(leading_zero_formatter.format(Math.floor(new Date(this.date * 1000).getDate())))}/${(leading_zero_formatter.format(Math.floor(new Date(this.date * 1000).getMonth() + 1)))}`;
      this.channel = channel;
      this.channel_profile = channel_profile ? 
      `<img src="${channel_profile}" alt="${this.channel}'s profile"/>` : `<h3>${this.channel[0]}</h3>`;
      this.channel_subs = (channel_subs === 0) ? '-/-' : format_number(channel_subs, "fr");
      this.liked = liked,
      this.likes = likes;
      this.likes_formated = (this.likes !== 0) ? format_number(this.likes) : '';
      this.disliked = disliked,
      this.dislikes = dislikes,
      this.dislikes_formated = (this.dislikes !== 0) ? format_number(this.dislikes) : ''
    }
  }

  const video_data = new VideoData(
    "Pete & Bas - Stepped Into the Building",
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi fugit, aspernatur sapiente velit natus officia, recusandae nisi itaque deserunt illum quos corrupti suscipit quibusdam, exercitationem expedita! Aliquam, modi veritatis soluta exercitationem aspernatur voluptatibus est.",
    70000,
    1681410600,
    "Pete & Bas",
    "unnamed.jpg",
    65768,
    true,
    50890,
    false,
    0
  );
  // Définition des classes
  class CommentData {
    constructor(username, message, user_id, id) {
      this.id = id || (Date.now() * 1000) + Math.floor(Math.random() * 1000000);
      this.date = Date.now();
      this.username = username;
      this.message = message;
      this.level = 0;
      this.user_id = user_id;
    }
  }
  let all_comments = [].sort((a, b) => b.date - a.date);
  all_comments.push(new CommentData("John Doe", "J'aime trop ce contenu", 122, 150))
  class ReplyData extends CommentData {
    constructor(id, username, message, user_id, from, commentUsername) {
      super(username, message, user_id);
      this.id = id
      this.from = from;
      this.comment_username = commentUsername || this.findCommentUsername();
      this.level = 1;
    }

    findCommentUsername() {
      // Recherche du commentaire parent dans le tableau all_comments
      const parentComment = all_comments.find(comment => comment.id === this.from);
      return parentComment ? parentComment.username : `User_${this.from}`;
    }
  }
  all_comments.push(new ReplyData(157, "Mary Jane", "C'est vraiment une pépite", 151, 150))
  all_comments.push(new ReplyData(190, "John Doe", "Ouais tu l'as dit", 122, 157))

  // Exemple of current user
  let current_user = {
    id: 20,
    username: "Martin Ocho"
  }
  let video_comments = {}
  let comment_replies = {}
  let replies_num = {};


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
          <div class="channel-profile">${video_data.channel_profile}</div>
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
            <input type="checkbox" name="like" id="like-check" title="J'aime ce conenu"${!video_data.liked || ' checked'}/>
            <svg height="30" fill="#999">
              <use xlink:href="#thumb-up"></use>
            </svg>
            <span class="react-num" data-num="${video_data.likes}" data-num-formated="${video_data.likes_formated}"></span>
          </label>
          <label class="like-btn dislike">
            <input type="checkbox" name="like" id="dislike-check" title="Je n'aime pas ce conenu" ${!video_data.disliked || ' checked'}/>
            <svg height="30" fill="#999">
              <use xlink:href="#thumb-down"></use>
            </svg>
            <span class="react-num" data-num="${video_data.dislikes}" data-num-formated="${video_data.dislikes_formated}"></span>
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
          Commentaires <span class="nbr-count">${all_comments.length || ''}</span>
        </h2>
      </div>
      <div class="desc-body">
        <div class="comments">
          <div class="single-comment">
            <div class="comment-content">
              <div class="left-c"></div>
              <div class="right-c">
                <h3 class="c-header">${current_user.username}</h3>
                <div class="c-body">Cliquez pour afficher les commentaires</div>
              </div>
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
        <h2>Commentaires <span class="nbr-count all-comment-count"></span></h2>
        <span class="close-desc">&times;</span>
      </div>
      <hr />
      <div class="desc-body">
        <div class="comments">
        <div class="single-comment comment-form">
            <div class="comment-content">
              <div class="left-c"></div>
              <form class="right-c" method="post">
                <textarea  title="Commenter" placeholder="Commenter..." required></textarea>
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
  let like_check = document.getElementById('like-check')
  let dislike_check = document.getElementById('dislike-check');
  function update_react_num(num, node) {
    node.setAttribute("data-num", num);
    node.setAttribute("data-num-formated", (num > 0) ? format_number(num, "fr") : '');
  }
  like_check.addEventListener('change', e => {
    let react_num = e.target.parentNode.querySelector(".react-num")
    if (e.target.checked) {
      if (video_data.disliked) {
        dislike_check.checked = false;
        video_data.disliked = false;
        video_data.dislikes--
        update_react_num(video_data.dislikes, dislike_check.parentNode.querySelector(".react-num"))
      }
      video_data.likes++;
      video_data.liked = true;
    } else {
      if (video_data.liked) {
        video_data.likes--;
        video_data.liked = false;
      }
    }
    update_react_num(video_data.likes, react_num)
  })
  dislike_check.addEventListener('change', e => {
    let react_num = e.target.parentNode.querySelector(".react-num")
    if (e.target.checked) {
      if (video_data.liked) {
        like_check.checked = false;
        video_data.liked = false;
        video_data.likes--
        update_react_num(video_data.likes, like_check.parentNode.querySelector(".react-num"))
      }
      video_data.disliked = true;
      video_data.dislikes++;
    } else {
      if (video_data.disliked) {
        video_data.dislikes--;
        video_data.disliked = false;
      }
    }
    update_react_num(video_data.dislikes, react_num)
  })
  reload_replies();
  function reload_replies() {
    all_comments.forEach(comment => {
      if (comment.level === 0) {
        video_comments[comment.id] = comment;
      } else {
        comment_replies[comment.from] = [comment];
      }
    });

    for (const key in comment_replies) {
      const reply = comment_replies[key];
      const reply_id = reply[0].from;
      get_level_zero_of(reply_id, 0);
    }

    function get_level_zero_of(from, num) {
      const foundComment = all_comments.find(comment => comment.id === from);
      if (foundComment) {
        num++;
        if (foundComment.level === 0) {
          replies_num[from] = num;
          for (const cle in replies_num) {
            const element = replies_num[cle];
            if (document.getElementById(`comment-${cle}`)) {
              let nbr_el = document.getElementById(`comment-${cle}`).parentNode.querySelector('.nbr-count');
              nbr_el.innerText = `${element || 'Aucune'} réponses`;
            }
          }
        } else {
          get_level_zero_of(foundComment.from, num);
        }
      }
    }

    video_details.querySelector('.all-comment-count').textContent = all_comments.length || '';
  }

  let comment_form = video_details.querySelector('form.right-c');
  comment_form.addEventListener('submit', e => {
    e.preventDefault();
    process_form(comment_form, {
      id: Date.now() + Math.floor(Math.random() * 1000000),
      username: current_user.username,
      message: comment_form.querySelector("textarea").value.trim(),
      date: Date.now(),
      level: 0,
      user_id: current_user.id
    });
  });
  let comment_section = video_details.querySelector('.video-comments .comments');
  for (const id in video_comments) {
    const comment = video_comments[id];
    insert_comment(comment);
  }
  reload_replies();
  update_textareas();
  let descr_toggles = document.querySelectorAll('.mobile-desc-toggle');
  let comment_toggles = document.querySelectorAll('.comment-toggle');
  let description = video_details.querySelector('.video-description');
  let comment_sect = video_details.querySelector('.video-comments');
  descr_toggles.forEach(toggle => {
    description.classList.remove('active');
    comment_sect.classList.remove('active');
    toggle.addEventListener('click', () => {
      description.classList.add('active');
    })
  })
  comment_toggles.forEach(toggle => {
    description.classList.remove('active');
    comment_sect.classList.remove('active');
    toggle.addEventListener('click', () => {
      comment_sect.classList.add('active');
    })
  })
  close_descs = video_details.querySelectorAll('.close-desc');
  close_descs.forEach(close_desc => {
    close_desc.addEventListener('click', () => {
      comment_sect.classList.remove('active');
      description.classList.remove('active');
    })
  })
  function process_form(form, datas) {
    const comment_text = datas.message
    if (comment_text !== '') {
      if (datas.level > 0) {
        const new_replie = new ReplyData(datas.id, datas.username, datas.message, datas.user_id, datas.from, datas.comment_username
        );
        insert_reply(new_replie, form.parentNode);
      } else {
        const new_comment = new CommentData(datas.username, datas.message, datas.user_id, datas.id)
        insert_comment(new_comment);
      }
    }
    reload_replies();
  }
  function insert_comment(comment) {
    (!all_comments.includes(comment)) && all_comments.unshift(comment);
    let comment_div = document.createElement('div');
    comment_div.className = 'single-comment';
    let comment_html = `
    <div class="comment-content" id="comment-${comment.id}">
      <div class="left-c"></div>
      <div class="right-c">
        <h3 class="c-header">${comment.username}</h3>
        <div class="c-body">${comment.message}</div>
        <div class="c-actions">
          <button class="action-btn c-footer">Repondre</button>
        </div>
      </div>
    </div>
    <div class="comment-replies">
      <div class="desc-header">
        <h3><span class="nbr-count"></span></h3>
      </div>
      <div class="desc-body"></div>
    </div>
    `
    comment_div.innerHTML = comment_html
    let sibling = video_details.querySelector('.comment-form');
    sibling.parentNode.insertBefore(comment_div, sibling.nextSibling)
    sibling.querySelector('form').reset();
    handle_reply(comment, comment_div, comment_div);
    for (const key in comment_replies) {
      const reply = comment_replies[key][0];
      if (reply.from === comment.id) {
        insert_reply(reply, null, comment_div.querySelector('.comment-replies .desc-body'))
      }
    }
  }
  function handle_reply(comment, comment_div, sibling) {
    if (comment_div.parentNode.querySelector('.comment-replies textarea')) {
      comment_div.parentNode.querySelector('.comment-replies textarea').parentNode.parentNode.remove();
    }
    reload_replies();
    let reply_btn = sibling.querySelector('.c-footer');
    reply_btn.addEventListener('click', () => {
      insert_form(comment, comment_div, sibling);
    })
    if (comment.user_id === current_user.id && all_comments.includes(comment)) {
      let delete_btn = document.createElement('button')
      delete_btn.classList.add("c-delete")
      delete_btn.textContent = "Supprimer";
      reply_btn.parentNode.insertBefore(delete_btn, reply_btn.nextSibling)
      delete_btn.addEventListener('click', () => {
        delete_btn.textContent = "Suppression...";
        remove_comment(comment);
      })
    }
  }
  function insert_reply(reply, sibling_div, replies_div = null) {
    (!all_comments.includes(reply)) && all_comments.push(reply);
    let reply_div = document.createElement('div');
    reply_div.className = 'single-reply';
    reply_div.id = `reply-${reply.id}`;
    let replies_html = `
          <div class="left-c"></div>
          <div class="right-c">
            <h4 class="c-header">${reply.username}</h4>
            <div class="c-body"><span class="reply-name">@${reply.comment_username}</span> ${reply.message}</div>
            <div class="c-actions">
              <button class="action-btn c-footer">Repondre</button>
            </div>
          </div>
        `
    reply_div.innerHTML = replies_html
    reload_replies();
    for (const key in comment_replies) {
      const reply_2 = comment_replies[key][0];
      if (reply_2.from === reply.id) {
        insert_reply(reply_2, null, replies_div);
      }
    }
    if (!replies_div) {
      sibling_div.parentNode.insertBefore(reply_div, sibling_div.nextSibling);
      if (reply.level !== 2) {
        handle_reply(reply, reply_div.parentNode.parentNode, reply_div)
      } else {
        handle_reply(reply, reply_div.parentNode, reply_div)
      }
    } else {
      replies_div.appendChild(reply_div);
      if (reply.level !== 2) {
        handle_reply(reply, reply_div.parentNode, reply_div)
      } else {
        handle_reply(reply, reply_div, reply_div)
      }
    }
  }
  function insert_form(comment, comment_div, sibling_div) {
    if (comment_div.parentNode.querySelector('.comment-replies textarea')) {
      comment_div.parentNode.querySelector('.comment-replies textarea').parentNode.parentNode.remove();
    }
    let form_div = document.createElement('div');
    let reply_id = Date.now() + (Math.random() * 1000000)
    form_div.className = 'single-reply';
    form_div.id = `reply-${reply_id}`;
    let form_html = `
                    <div class="left-c"></div>
                    <form class="right-c" method="post">
                      <textarea  title="Ajouter une reponse..." placeholder="Ajouter une reponse..." required></textarea>
                      <button type="submit" title="Envoyer">
                        <svg height="24" width="24" fill="currentColor">
                          <use xlink:href="#send-icon"></use>
                        </svg>
                      </button>
                    </form>
                  `
    form_div.innerHTML = form_html;
    if (comment.level !== 0) {
      sibling_div.parentNode.insertBefore(form_div, sibling_div.nextSibling);
    } else {
      comment_div.querySelector('.comment-replies .desc-body').prepend(form_div)
    }
    comment_div.querySelector('textarea').focus();
    form_div.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      process_form(form_div.querySelector('form'), {
        id: Date.now() + Math.floor(Math.random() * 1000000),
        from: comment.id,
        date: Date.now(),
        username: current_user.username,
        comment_username: comment.username,
        message: htmlspecialchars(comment_div.querySelector("textarea").value.trim()),
        level: (comment.level === 2) ? 2 : (+comment.level + 1),
        user_id: current_user.id,
      });
    })
  }
  function remove_comment(id) {
    all_comments.forEach(comment => {
      if (comment.id === id.id) {
        for (const key in comment_replies) {
          if (Object.hasOwnProperty.call(comment_replies, key)) {
            const reply = comment_replies[key][0];
            if (reply.from === id.id) {
              remove_comment(reply);
            }
          }
        }
        all_comments.splice(all_comments.indexOf(comment), 1);
        reload_replies();
        delete_element(comment.id);
      }
    });
    function delete_element(id) {
      let dom_id = "comment-" + id;
      let reply_id = "reply-" + id;
      if (document.getElementById(dom_id)) {
        let element_to_remove = document.getElementById(dom_id).parentNode;
        element_to_remove.remove();
      }
      if (document.getElementById(reply_id)) {
        let element_to_remove = document.getElementById(reply_id);
        element_to_remove.remove();
      }
    }
  }


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
function htmlspecialchars(str) {
  var el = document.createElement("div");
  el.appendChild(document.createTextNode(str));
  return el.innerHTML;
}

load_video_data(1);