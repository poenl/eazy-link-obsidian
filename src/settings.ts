import { App, PluginSettingTab, Setting } from 'obsidian'
import EasyLinkPlugin from './main'
import { t } from './lang'
import manifest from '../manifest.json'

export class SettingTab extends PluginSettingTab {
	plugin: EasyLinkPlugin

	constructor(app: App, plugin: EasyLinkPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this

		containerEl.empty()

		new Setting(containerEl).setName(manifest.name).setHeading()

		new Setting(containerEl)
			.setName(t({ en: 'Placeholder Text', zh: '占位符文本' }))
			.setDesc(
				t({
					en: 'The placeholder text before the URL is parsed, {url} represents the pasted URL',
					zh: 'URL解析完成前的占位符文本，{url}表示粘贴的URL'
				})
			)
			.addText((text) => {
				text.setValue(this.plugin.settings.placeholderText).onChange((value) => {
					this.plugin.settings.placeholderText = value
					this.plugin.saveData(this.plugin.settings)
				})
			})

		new Setting(containerEl)
			.setName(t({ en: 'Placeholder Mode', zh: '占位符模式' }))
			.setDesc(
				t({
					en: 'Control the display mode of the placeholder, if using text mode, the undo will restore to the placeholder state',
					zh: '控制占位符的显示方式，如果使用文本模式，撤销时将恢复到占位符状态'
				})
			)
			.addDropdown((toggle) => {
				toggle
					.addOption('decoration', t({ en: 'Decoration', zh: '装饰' }))
					.addOption('text', t({ en: 'Text', zh: '文本' }))
					.setValue(this.plugin.settings.placeholderMode)
					.onChange((value) => {
						this.plugin.settings.placeholderMode = value
						this.plugin.saveData(this.plugin.settings)
					})
			})
	}
}
