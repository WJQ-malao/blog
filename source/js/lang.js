(function () {
  var KEY = 'site-lang';

  function apply(lang) {
    document.querySelectorAll('[data-zh]').forEach(function (el) {
      var v = el.getAttribute('data-' + lang);
      if (v !== null) el.innerHTML = v;
    });
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    document.querySelectorAll('.lang-toggle').forEach(function (b) {
      b.textContent = lang === 'en' ? '中文' : 'English';
    });
    localStorage.setItem(KEY, lang);
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.lang-toggle')) {
      e.preventDefault();
      var cur = localStorage.getItem(KEY) === 'en' ? 'en' : 'zh';
      apply(cur === 'en' ? 'zh' : 'en');
    }
  });

  apply(localStorage.getItem(KEY) || 'en');
})();
