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
    closePanel();
  }

  function buildPanel() {
    panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.innerHTML =
      '<button class="settings-item settings-parent">' +
        '<span class="settings-ico">🎨</span>' +
        '<span data-zh="风格" data-en="Style">' + (lang() === 'en' ? 'Style' : '风格') + '</span>' +
        '<span class="settings-arrow">›</span>' +
      '</button>' +
      '<div class="settings-sub">' +
        THEMES.map(function (t) {
          return '<button class="settings-item" data-id="' + t.id + '">' +
            '<span class="settings-dot" style="background:' + t.dot + '"></span>' +
            '<span>' + (lang() === 'en' ? t.en : t.zh) + '</span>' +
            '<span class="settings-check">' + (cur() === t.id ? '✓' : '') + '</span>' +
            '</button>';
        }).join('') +
      '</div>';
    document.body.appendChild(panel);

    // 点"风格"展开/收起子菜单
    panel.querySelector('.settings-parent').addEventListener('click', function () {
      panel.classList.toggle('sub-open');
    });
    // 点具体皮肤
    panel.querySelector('.settings-sub').addEventListener('click', function (e) {
      var b = e.target.closest('.settings-item[data-id]');
      if (b) apply(b.dataset.id);
    });
  }

  function renderChecks() {
    if (!panel) return;
    panel.querySelectorAll('.settings-item[data-id]').forEach(function (b) {
      b.querySelector('.settings-check').textContent = cur() === b.dataset.id ? '✓' : '';
    });
  }

  function closePanel() {
    if (panel) panel.classList.remove('open');
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('.settings-toggle');
    if (t) {
      e.preventDefault();
      if (!panel) buildPanel();
      var parentPanel = t.closest('.nav-overflow-panel');
      if (parentPanel) {
        // 在汉堡面板里点设置：子菜单与该项同一水平线，贴着面板左侧飞出
        var pr = parentPanel.getBoundingClientRect();
        var tr = t.getBoundingClientRect();
        panel.style.top = tr.top + 'px';
        panel.style.right = (window.innerWidth - pr.left + 10) + 'px';
        panel.style.left = 'auto';
      } else {
        // 其他位置（如手机端栏内）：锚定导航栏右下
        var nav = t.closest('nav');
        var r = nav ? nav.getBoundingClientRect() : t.getBoundingClientRect();
        panel.style.top = (r.bottom + 10) + 'px';
        panel.style.right = '16px';
        panel.style.left = 'auto';
      }
      panel.classList.toggle('open');
      return;
    }
    if (panel && !e.target.closest('.settings-panel')) closePanel();
  });
})();
