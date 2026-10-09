// 构建时生成 posts.json：全部文章的清单（标题/日期/链接/摘要/分类/标签）
hexo.extend.generator.register('posts-json', function (locals) {
  const posts = locals.posts.sort('-date').toArray().map(p => ({
    title: p.title,
    date: p.date.format('YYYY-MM-DD'),
    path: '/' + p.path,
    excerpt: (p.content || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 120),
    categories: p.categories.toArray().map(c => c.name),
    tags: p.tags.toArray().map(t => t.name)
  }));
  return {
    path: 'posts.json',
    data: JSON.stringify(posts)
  };
});
