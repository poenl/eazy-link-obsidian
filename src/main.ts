import { Editor, Plugin, requestUrl, moment } from 'obsidian'
import { loadingField, showLoading, removeLoading } from './loading'
import { EditorView } from '@codemirror/view'
import { SettingTab } from './settings'
import { i18n } from './lang'

const DEFAULT_SETTINGS = {
	autoFormat: true,
	placeholderText: '[Parsing URL...]',
	placeholderMode: 'decoration' //文本、装饰
}
const IGNORE_REG = [/<$/, /^\[.*\]:\s*/]

export default class EasyLinkPlugin extends Plugin {
	settings: typeof DEFAULT_SETTINGS

	async onload() {
		await this.loadSettings()
		i18n(moment.locale())
		this.registerEditorExtension(loadingField)

		this.registerEvent(
			this.app.workspace.on('editor-paste', async (evt, editor: Editor) => {
				// @ts-expect-error, not typed
				const editorView = editor.cm as EditorView

				if (!this.settings.autoFormat) return
				// 剪切板内容
				const clipboardText = evt.clipboardData?.getData('text/plain')
				if (!clipboardText) return

				const url = URL.parse(clipboardText)
				if (!url) return
				// 阻止默认粘贴行为
				evt.preventDefault()
				// 替换为markdown链接
				const select = editor.getSelection()
				if (select) {
					editor.replaceSelection(`[${select}](${url.href})`)
					return
				}

				const from = editor.getCursor('from')
				// 处理需要跳过的情况
				const lineText = editor.getLine(from.line)
				for (let index = 0; index < this.ignore.length; index++) {
					const reg = this.ignore[index]
					if (lineText.match(reg)) {
						editor.replaceSelection(clipboardText)
						return
					}
				}
				// 插入占位符
				const placeholder = this.settings.placeholderText.replace('{url}', url.href)
				if (this.settings.placeholderMode === 'decoration') {
					showLoading(editorView, from.ch, from.ch, placeholder)
				} else if (this.settings.placeholderMode === 'text') {
					editorView.dispatch({
						changes: {
							from: from.ch,
							to: from.ch,
							insert: placeholder
						}
					})
					// 移动光标
					editor.setCursor({
						line: from.line,
						ch: from.ch + placeholder.length
					})
				}

				const to = editor.getCursor('from')

				// 自动获取网页标题
				try {
					const res = await requestUrl(url.href)
					const contentType = res.headers['content-type']

					if (contentType && contentType.startsWith('text/html')) {
						const html = res.text
						const titleMatch = html.match(/<title>(.*?)<\/title>/)
						const title = titleMatch?.[1] ? titleMatch[1] : 'no title'

						const finalLink = `[${title}](${url.href})`
						editor.replaceRange(finalLink, from, to)
					} else if (contentType && contentType.startsWith('image')) {
						const finalLink = `![${url.pathname.replace(/.*\//, '')}](${url.href})`

						editor.replaceRange(finalLink, from, to)
					} else {
						editor.replaceRange(clipboardText, from, to)
					}
				} catch {
					editor.replaceRange(clipboardText, from, to)
				} finally {
					removeLoading(editorView, from.ch, from.ch)
				}
			})
		)

		this.addSettingTab(new SettingTab(this.app, this))
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}

	// 需要跳过的情况
	ignore: RegExp[] = IGNORE_REG
}
