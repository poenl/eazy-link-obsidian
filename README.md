# Eazy Link for Obsidian

[中文版](./README_zh.md)

Eazy Link is a plugin for Obsidian designed to boost your note-taking efficiency by automatically converting URLs into titled Markdown links, formatting image links, or applying links to your selected text.

![Eazy Link Demo](https://raw.githubusercontent.com/mnao/eazy-link-obsidian/master/demo.gif)

## Core Features

- **Automatic Title Fetching**: When you paste a URL, the plugin intelligently fetches the webpage's title and uses it as the link's display text.
- **Image Link Optimization**: If you paste an image link, the plugin automatically recognizes and converts it into Markdown image format (`![Image Name](link)`).
- **Custom Link Text**: If you have text selected before pasting a URL, that text will be used as the link's title, with the URL as its destination.
- **Smart Fallback**: If the plugin fails to fetch a title or process the link, it will paste the original URL, ensuring your workflow is not interrupted.
