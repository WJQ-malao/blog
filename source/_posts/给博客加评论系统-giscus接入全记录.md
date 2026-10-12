---
title: 给静态博客加评论系统：Giscus 接入全记录
date: 2026-10-12 16:00:00
tags:
  - 博客搭建
  - Giscus
categories:
  - 技术
---

博客搭好了（[搭建过程看这篇](/2026/10/07/从零搭建我的个人博客/)），但没有评论区总觉得少了点什么。这篇文章记录我用 **Giscus** 给博客接入评论功能的全过程——零费用、零服务器，评论数据存在自己的 GitHub 仓库里。

<!-- more -->

## 为什么是 Giscus

Giscus 是一个开源评论插件，原理很妙：**把 GitHub 仓库的 Discussions（讨论区）变成你网站的评论区**。

- 免费、无广告（不像 Disqus 免费版塞广告）
- 评论数据存在你自己的仓库里，随时可导出，不被平台绑架
- 不需要服务器和数据库，和纯静态博客绝配

唯一的门槛：读者评论前需要登录 GitHub 账号。技术博客的读者大多有账号，可以接受。

## 第一步：开启仓库的 Discussions

评论的"存储柜"就是仓库自带的讨论区，默认是关闭的，要先打开：

仓库 → **Settings** → **General** → 往下滚到 **Features** 区域 → 勾选 **Discussions**。

![勾选 Discussions](/img/giscus/step1-enable-discussions.png)

勾选后出现的"Set up discussions"欢迎帖写不写都行，不影响功能。

## 第二步：安装 Giscus App

Giscus 需要权限才能往你的讨论区里写评论，去 GitHub 应用市场安装它：

打开 [github.com/apps/giscus](https://github.com/apps/giscus) → **Install** → 选 **Only select repositories** → 选中 `用户名/blog` → 确认。

![安装 Giscus App](/img/giscus/step2-install-app.png)

中间可能要求输一次密码确认（GitHub 的 sudo 安全机制）：

![确认密码](/img/giscus/step3-confirm-password.png)

> 想收回权限随时可收：Settings → Applications → Installed GitHub Apps → Uninstall。

## 第三步：生成嵌入代码

打开 [giscus.app](https://giscus.app/zh-CN) 的配置页：

1. 「仓库」输入框填 `用户名/blog`，显示绿色 ✓ 可用

![填写仓库名](/img/giscus/step4-config-repo.png)

2. 其余选项保持默认：映射方式 `pathname`、分类 `General`、主题跟随系统
3. 滚到页面底部，复制自动生成的 `<script>` 代码

![生成的嵌入代码](/img/giscus/step5-generated-script.png)

里面有两个关键参数是页面自动算出来的：`data-repo-id`（仓库 ID）和 `data-category-id`（分类 ID），不用手填。

## 第四步：嵌入文章页面

把那段 script 粘贴到主题的文章模板里（我的是 `themes/purple/layout/post.ejs`，放在正文下方），push 之后每篇文章底部就都有评论区了。

## 评论的完整链路

接入后整条链路是这样的：

```
读者打开文章 → giscus 按文章路径找对应的 Discussion
→ 找到：显示已有评论 ｜ 没找到：显示"还没有评论"
→ 读者登录 GitHub 授权一次 → 写评论提交
→ giscus bot 自动在仓库 Discussions 里建帖/回复
→ 所有人刷新可见
```

管理评论就在仓库的 **Discussions** 标签页里，删评、置顶、锁定都行。

## 经验总结

1. **三个开关缺一不可**：Discussions 开启 + App 安装 + 嵌入代码，漏一个评论区就加载不出来
2. **仓库必须公开**：私有仓库访客看不到评论
3. **文章和评论靠路径自动关联**：不用手动建帖，发新文章自动配对新讨论
4. 数据在 GitHub 上，网站换主题、换域名都不影响评论留存

至此我的博客功能基本完整了。下一步可能会给游戏厅加个全服排行榜——那才是真正的"加后台"，敬请期待。
