export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Decap CMS 点击登录后跳转到这里 → 带去 GitHub 授权页
    if (url.pathname === '/auth') {
      const authUrl = 'https://github.com/login/oauth/authorize' +
        '?client_id=' + env.CLIENT_ID +
        '&scope=repo';
      return Response.redirect(authUrl, 302);
    }

    // GitHub 授权完成后回调这里 → 用 code 换 token → 回传给 CMS
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('missing code', { status: 400 });

      const resp = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: env.CLIENT_ID,
          client_secret: env.CLIENT_SECRET,
          code: code
        })
      });
      const data = await resp.json();
      if (!data.access_token) {
        return new Response('oauth failed: ' + JSON.stringify(data), { status: 500 });
      }

      const token = data.access_token;
      const html = '<!doctype html><html><body><script>(function(){' +
        'var msg = "authorization:github:success:" + JSON.stringify({ token: ' + JSON.stringify(token) + ', provider: "github" });' +
        'if (window.opener) { window.opener.postMessage(msg, "*"); }' +
        '})();</script>授权成功，正在返回……</body></html>';
      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    // 其他路径 → 正常返回静态网站
    return env.ASSETS.fetch(request);
  }
};
