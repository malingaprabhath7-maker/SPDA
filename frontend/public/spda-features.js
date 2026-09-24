(function(){
  // ===== CSS inject =====
  var style = document.createElement('style');
  style.textContent = `
    .lang-switch{
      position:fixed; top:20px; right:26px; z-index:10;
      display:flex; gap:4px; padding:4px; border-radius:999px;
      background:rgba(255,255,255,0.08);
      border:1px solid rgba(255,255,255,0.18);
      -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px);
    }
    .lang-btn{
      border:0; background:transparent; color:#a7b3e6;
      padding:6px 16px; border-radius:999px;
      font-size:13px; font-family:inherit; cursor:pointer;
      transition:background .25s, color .25s;
    }
    .lang-btn:hover{ color:#fff; }
    .lang-btn.active{ background:rgba(140,170,255,0.35); color:#fff; }
    .login-btn{
      display:inline-block; margin-top:22px;
      padding:11px 40px; border-radius:999px;
      background:linear-gradient(135deg,#4f63ff,#8b5cf6);
      color:#fff; text-decoration:none;
      font-size:15px; font-family:inherit; letter-spacing:.3px;
      box-shadow:0 6px 22px rgba(99,102,255,0.45);
      transition:transform .2s, box-shadow .2s;
    }
    .login-btn:hover{ transform:translateY(-2px); box-shadow:0 10px 28px rgba(99,102,255,0.6); }
    body{ font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans Sinhala','Iskoola Pota',Arial,sans-serif; }
    @media (max-height:700px){
      .art{ width:min(50vw,52vh) !important; }
      .copy{ margin-top:18px !important; }
    }
  `;
  document.head.appendChild(style);

  // ===== Settings =====
  var LOGIN_URL = '/dashboard.html';   // Login -> React dashboard (frontend/dashboard.html)

  var LANG = {
    en: {
      title: 'Welcome to SPDA',
      tagline: 'Shaping the future of the Southern Province',
      login: 'Login'
    },
    si: {
      title: 'SPDA වෙත සාදරයෙන් පිළිගනිමු',
      tagline: 'දකුණු පළාතේ අනාගතය හැඩගැස්වීම',
      login: 'පිවිසෙන්න'
    }
  };

  function init(){
    // Language switch buttons
    var sw = document.createElement('div');
    sw.className = 'lang-switch';
    sw.innerHTML =
      '<button class="lang-btn" data-lang="si">සිංහල</button>' +
      '<button class="lang-btn" data-lang="en">English</button>';
    document.body.appendChild(sw);

    // Text elements (existing h1 / p inside .copy)
    var copy  = document.querySelector('.copy');
    var title = copy.querySelector('h1');
    var tag   = copy.querySelector('p');

    // Login button (tagline ekata pahalin)
    var login = document.createElement('a');
    login.className = 'login-btn';
    login.href = LOGIN_URL;
    copy.appendChild(login);

    function setLang(l){
      title.textContent = LANG[l].title;
      tag.textContent   = LANG[l].tagline;
      login.textContent = LANG[l].login;
      document.documentElement.lang = l;
      sw.querySelectorAll('.lang-btn').forEach(function(b){
        b.classList.toggle('active', b.dataset.lang === l);
      });
      try{ localStorage.setItem('spda-lang', l); }catch(e){}
    }

    sw.querySelectorAll('.lang-btn').forEach(function(b){
      b.addEventListener('click', function(){ setLang(b.dataset.lang); });
    });

    var saved = 'en';
    try{ saved = localStorage.getItem('spda-lang') || 'en'; }catch(e){}
    setLang(saved);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();