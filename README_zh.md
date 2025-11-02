# Eazy Link for Obsidian (中文版)

[English Version](./README.md)

Eazy Link 是一款为 Obsidian 设计的插件，它能自动将 URL 转换为带标题的 Markdown 链接、格式化图片链接，或将链接应用到您选中的文本上，从而提升您的笔记效率。

![Eazy Link Demo](https://raw.githubusercontent.com/mnao/eazy-link-obsidian/master/demo.gif)

## 核心功能

- **自动获取网页标题**: 当您粘贴一个 URL 时，插件会智能地抓取该网页的标题，并将其作为链接的显示文本。
- **图片链接优化**: 若粘贴的是图片链接，插件能自动识别并将其转换为 Markdown 图片格式 (`![图片名](链接)`).
- **自定义链接文本**: 如果在粘贴 URL 之前您已选中一段文字，这段文字将被用作链接的标题，URL 则作为链接地址。
- **智能回退机制**: 在无法获取网页标题或处理链接的情况下，插件将直接粘贴原始 URL，确保您的工作流程不受影响。
