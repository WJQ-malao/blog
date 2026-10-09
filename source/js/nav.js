// 汉堡菜单：点击切换 + 电脑端悬停展开，点菜单项或空白处收起
document.addEventListener('click', function (e) {
  var t = e.target.closest('.menu-toggle');
  if (t) {
    e.preventDefault();
    t.closest('nav').classList.toggle('open');
    return;
  }
  var link = e.target.closest('nav a');
  if (link) {
    var nav = link.closest('nav');
    if (nav) nav.classList.remove('open');
    return;
  }
  if (!e.target.closest('nav')) {
    document.querySelectorAll('nav.open').forEach(function (n) { n.classList.remove('open'); });
  }
});

// 电脑端（>760px）鼠标悬停自动展开/收起
document.querySelectorAll('nav').forEach(function (nav) {
  nav.addEventListener('mouseenter', function () {
    if (window.innerWidth > 760) nav.classList.add('open');
  });
  nav.addEventListener('mouseleave', function () {
    if (window.innerWidth > 760) nav.classList.remove('open');
  });
});
