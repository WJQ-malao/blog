(function () {
  var state = { q: '', desc: true, page: 1, per: 10 };
  var posts = [];

  var I18N = {
    zh: { search: '搜索文章…', desc: '最新优先 ↓', asc: '最早优先 ↑', empty: '没有找到相关文章', prev: '← 上一页', next: '下一页 →' },
    en: { search: 'Search posts…', desc: 'Newest first ↓', asc: 'Oldest first ↑', empty: 'No posts found', prev: '← Prev', next: 'Next →' }
  };
  function lang() { return localStorage.getItem('site-lang') || 'en'; }
  function t() { return I18N[lang()] || I18N.zh; }

  var listEl = document.getElementById('postList');
  var pagerEl = document.getElementById('pager');
  var searchEl = document.getElementById('postSearch');
  var sortBtn = document.getElementById('sortBtn');

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function filtered() {
    var q = state.q.trim().toLowerCase();
    var arr = posts.filter(function (p) {
      if (!q) return true;
      return (p.title + ' ' + p.excerpt + ' ' + p.tags.join(' ') + ' ' + p.categories.join(' ')).toLowerCase().indexOf(q) >= 0;
    });
    arr.sort(function (a, b) {
      return state.desc ? (a.date < b.date ? 1 : -1) : (a.date > b.date ? 1 : -1);
    });
    return arr;
  }

  function cardHtml(p) {
    var meta = '<span>' + p.date + '</span>';
    if (p.categories.length) {
      meta += '<span class="dot">·</span>' + p.categories.map(function (c) { return '<span class="cat">' + esc(c) + '</span>'; }).join('');
    }
    meta += p.tags.map(function (t) { return '<span class="tag">#' + esc(t) + '</span>'; }).join('');
    return '<a class="card post-card" href="' + esc(p.path) + '">' +
      '<h2>' + esc(p.title) + '</h2>' +
      '<div class="meta">' + meta + '</div>' +
      '<p class="excerpt">' + esc(p.excerpt) + '…</p>' +
      '</a>';
  }

  function render() {
    searchEl.placeholder = t().search;
    sortBtn.textContent = state.desc ? t().desc : t().asc;

    var arr = filtered();
    var total = Math.max(1, Math.ceil(arr.length / state.per));
    if (state.page > total) state.page = total;
    var slice = arr.slice((state.page - 1) * state.per, state.page * state.per);

    listEl.innerHTML = slice.length
      ? slice.map(cardHtml).join('')
      : '<p class="empty-tip">' + t().empty + '</p>';

    if (total > 1) {
      var html = '';
      if (state.page > 1) html += '<a class="card pager-btn" href="javascript:;" data-page="' + (state.page - 1) + '">' + t().prev + '</a>';
      html += '<span class="pager-info">' + state.page + ' / ' + total + '</span>';
      if (state.page < total) html += '<a class="card pager-btn" href="javascript:;" data-page="' + (state.page + 1) + '">' + t().next + '</a>';
      pagerEl.innerHTML = html;
      pagerEl.style.display = 'flex';
    } else {
      pagerEl.innerHTML = '';
      pagerEl.style.display = 'none';
    }
  }

  searchEl.addEventListener('input', function () {
    state.q = searchEl.value;
    state.page = 1;
    render();
  });

  sortBtn.addEventListener('click', function () {
    state.desc = !state.desc;
    state.page = 1;
    render();
  });

  pagerEl.addEventListener('click', function (e) {
    var a = e.target.closest('[data-page]');
    if (a) { state.page = parseInt(a.dataset.page, 10); render(); }
  });

  // 语言切换时同步工具栏文字
  document.addEventListener('click', function (e) {
    if (e.target.closest('.lang-toggle')) setTimeout(render, 0);
  });

  fetch('/posts.json')
    .then(function (r) { return r.json(); })
    .then(function (data) { posts = data; render(); })
    .catch(function () { listEl.innerHTML = '<p class="empty-tip">加载失败</p>'; });
})();
