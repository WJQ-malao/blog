// 汉堡菜单：点 ☰ 打开，再点 ☰ 或点击其他位置才关闭
document.addEventListener('click', function (e) {
  var t = e.target.closest('.menu-toggle');
  if (t) {
    e.preventDefault();
    t.closest('nav').classList.toggle('open');
    return;
  }
  var link = e.target.closest('nav a');
  if (link && !link.classList.contains('settings-toggle')) {
    var nav = link.closest('nav');
    if (nav) nav.classList.remove('open');
    return;
  }
  if (!e.target.closest('nav')) {
    document.querySelectorAll('nav.open').forEach(function (n) { n.classList.remove('open'); });
  }
});
