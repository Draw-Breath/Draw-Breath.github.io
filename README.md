# DrawBreath 论文展示主页

论文：**Knowing When to Do Less: Adaptive AI Withdrawal in Children's Creative Drawing**

这是与下载的参考模板分开的独立静态网站。采用暖白、薄荷绿、珊瑚橙、奶油黄和淡紫色，以真实儿童绘画为视觉重点。页面正文使用英语，匹配论文和国际学术读者。

## 打开预览

最简单：双击本文件夹中的 `index.html`，即可在浏览器中阅读，查看图片并打开论文 PDF。

推荐本地预览方式：在本文件夹打开终端，运行：

```powershell
npm start
```

然后访问 `http://127.0.0.1:4173`。无需 `npm install`，也没有构建步骤。关闭终端或按 Ctrl+C 可结束服务。若端口被占用，可以设置 `PORT` 环境变量。

## 已实现

- 响应式桌面、平板和手机布局。
- 彩色画纸卡片与论文中的真实儿童绘画裁切。
- 滚动渐入、磨砂导航、页面阅读进度；支持系统“减少动态效果”设置。
- Stay / Observe / Withdraw 的交互式原理说明，包括取消淡出、淡出完成和重新唤回 AI。
- 六幅完整论文原图的查看器，支持方向键切换、Escape 关闭和焦点恢复。
- 摘要展开、研究问题、系统原则、研究结果、儿童绘画轨迹和引用复制。
- 本地论文 PDF 按钮和用户提供的 GitHub 代码数据链接。
- 原创 SVG 图标；本地图片和系统字体，无外部字体、CDN、分析或 AI API 依赖。

## 文件说明

| 文件 | 用途 |
| --- | --- |
| `index.html` | 全部论文文案、链接、结构和暂定 BibTeX |
| `styles.css` | 配色、排版、响应式布局和动效 |
| `script.js` | 导航、AI 状态演示、图片查看器、引用复制 |
| `assets/images/` | 从论文 PDF 图转换出的 WebP 与分享预览图 |
| `assets/paper/drawbreath-paper.pdf` | 原论文 PDF 的完整副本 |
| `assets/favicon.svg` | DrawBreath 图标 |
| `tools/prepare_assets.py` | 从相邻论文素材文件夹重新生成网页图片 |
| `tools/serve.cjs` | 不需要第三方依赖的本地预览服务器 |
| `tools/check-site.cjs` | Playwright 浏览器功能与布局检查 |
| `qa/` | 检查报告、桌面/手机截图和论文核对资料；不必发布 |

原论文与原模板均保留在相邻文件夹内。

## 论文内容依据

网页依据用户提供的 LaTeX 正文及 36 页 PDF 整理，未虚构作者、机构、DOI、录用状态或新增实验结果。

- 65 名六年级儿童，单条件研究，每人任务最长 15 分钟，初始 2 分钟独立作画。
- 77 次 Withdraw 模型判断，68 次发起淡出，65 次完成撤出，涉及 61 份任务记录。
- 80% 指 **52/65 次完成撤出后出现稳定续画**，不是儿童比例或创造力提升幅度。
- 92.3% 指 Q6 的 **60/65 名儿童**同意能够基于自己的想法继续绘画；Q5 的人数相同。
- 稳定续画是 90 秒观察窗口内、再次进入 AI 或任务结束前，至少 3 次落笔或擦除启动，跨度至少 10 秒。
- Stay 与 Observe 的内部判断不同，但侧栏可见状态相同。网页演示是简化说明，不调用真实模型，也不是研究系统的可运行复刻。
- 三个作品案例来自 Figure 6，展示 elaboration、revision 和 reorientation，不将它们当作总体比例类别。
- 保留单条件研究和时机解释的边界，不把观察结果写成因果或最优性结论。

## 后续编辑与发布

该文件夹可直接作为独立 GitHub Pages 仓库内容，无需构建。发布时上传 `index.html`、`styles.css`、`script.js`、`assets/` 和 `.nojekyll` 即可。当前只完成本地开发，没有上传或发布。

获得最终论文信息后，可在 `index.html` 中更新匿名作者、CHI 投稿状态和暂定引用。论文更新时替换 `assets/paper/drawbreath-paper.pdf` 即可，按钮链接无需改动。

网站正式地址确定后，应将 `og:image` 改为该域名下分享图的绝对 URL，并加入正确的 `og:url`、canonical 与 `citation_pdf_url`；当前未填入虚构的线上地址。

## 参考模板与许可

已下载并研究 [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template) 的 HTML 内容分区、样式、响应式组织、图片展示和引用复制设计。新主页独立编写 HTML/CSS/JS，借鉴其学术主页内容组织，并在页脚保留来源鸣谢。

参考模板注明 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本网页设计同样以该许可提供；论文 PDF、研究图、儿童作品、数据与代码不因此被重新授权，仍适用其原有许可及使用条件。

浏览器检查需要单独可用的 Playwright 和 Chromium；不影响网站运行。可通过 `NODE_PATH` 指向已安装的 Playwright，通过 `CHROMIUM_PATH` 指定 Chromium 后运行 `node tools/check-site.cjs`。图片重新生成需要 Python、Pillow 和 pypdfium2。
