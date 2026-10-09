// 移动端汉堡菜单：点 ☰ 展开/收起，点菜单项或空白处收起
document.addEventListener('click', function (e) {
  var t = e.target.closest('.menu-toggle');
  if (t) {
    e.preventDefault();
    t.closest('nav').classList.toggle('open');
    return;
  }
  var link = e.target.closest('.nav-links a');
  if (link) {
    var nav = link.closest('nav');
    if (nav) nav.classList.remove('open');
    return;
  }
  if (!e.target.closest('nav')) {
    document.querySelectorAll('nav.open').forEach(function (n) { n.classList.remove('open'); });
  }
});
