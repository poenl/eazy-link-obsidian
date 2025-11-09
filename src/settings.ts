import { App, PluginSettingTab, Setting } from 'obsidian'
import EasyLinkPlugin from './main'

export class SettingTab extends PluginSettingTab {
	plugin: EasyLinkPlugin

	constructor(app: App, plugin: EasyLinkPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this

		containerEl.empty()

		new Setting(containerEl)
			.setName('Aoto Format')
			.setDesc('Enable auto format')
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.autoFormat).onChange((value) => {
					this.plugin.settings.autoFormat = value
					this.plugin.saveData(this.plugin.settings)
				})
			})

		new Setting(containerEl)
			.setName('Placeholder Text')
			.setDesc('Placeholder text when parsing URL, {url} will be replaced with the URL')
			.addText((text) => {
				text.setValue(this.plugin.settings.placeholderText).onChange((value) => {
					this.plugin.settings.placeholderText = value
					this.plugin.saveData(this.plugin.settings)
				})
			})

		new Setting(containerEl)
			.setName('Placeholder Mode')
			.setDesc('Placeholder mode')
			.addDropdown((toggle) => {
				toggle
					.addOption('decoration', 'decoration')
					.addOption('text', 'text')
					.setValue(this.plugin.settings.placeholderMode)
					.onChange((value) => {
						this.plugin.settings.placeholderMode = value
						this.plugin.saveData(this.plugin.settings)
					})
			})
	}
}
