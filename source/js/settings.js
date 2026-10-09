(function () {
  var THEMES = [
    { id: 'purple', zh: '暗夜紫', en: 'Night', dot: '#8b5cf6' },
    { id: 'blue', zh: '深海蓝', en: 'Ocean', dot: '#4f8ff7' },
    { id: 'light', zh: '浅色模式', en: 'Light', dot: '#aab4cf' }
  ];
  var KEY = 'site-theme';
  function cur() { return localStorage.getItem(KEY) || 'purple'; }
  function lang() { return localStorage.getItem('site-lang') || 'en'; }

  var panel = null;

  function apply(id) {
    document.documentElement.dataset.theme = id;
    localStorage.setItem(KEY, id);
    renderChecks();
  }

  function buildPanel() {
    panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.innerHTML = THEMES.map(function (t) {
      return '<button class="settings-item" data-id="' + t.id + '">' +
        '<span class="settings-dot" style="background:' + t.dot + '"></span>' +
        '<span>' + (lang() === 'en' ? t.en : t.zh) + '</span>' +
        '<span class="settings-check">' + (cur() === t.id ? '✓' : '') + '</span>' +
        '</button>';
    }).join('');
    document.body.appendChild(panel);
    panel.addEventListener('click', function (e) {
      var b = e.target.closest('.settings-item');
      if (b) apply(b.dataset.id);
    });
  }

  function renderChecks() {
    if (!panel) return;
    panel.querySelectorAll('.settings-item').forEach(function (b) {
      b.querySelector('.settings-check').textContent = cur() === b.dataset.id ? '✓' : '';
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('.settings-toggle');
    if (t) {
      e.preventDefault();
      if (!panel) buildPanel();
      var r = t.getBoundingClientRect();
      panel.style.top = (r.bottom + window.scrollY + 10) + 'px';
      panel.style.left = Math.max(12, r.left + window.scrollX - 60) + 'px';
      panel.classList.toggle('open');
      return;
    }
    if (panel && !e.target.closest('.settings-panel')) panel.classList.remove('open');
  });
})();
