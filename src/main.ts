import { App, Plugin, PluginSettingTab, requestUrl, Setting } from "obsidian";

const DEFAULT_SETTINGS = {
	autoFormat: true,
};

export default class MyPlugin extends Plugin {
	settings: typeof DEFAULT_SETTINGS;

	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.workspace.on("editor-paste", async (evt, editor) => {
				if (!this.settings.autoFormat) return;
				// 剪切板内容
				const clipboardText = evt.clipboardData?.getData("text/plain");
				if (!clipboardText) return;

				const url = URL.parse(clipboardText);
				if (!url) return;
				// 阻止默认粘贴行为
				evt.preventDefault();
				// 替换为markdown链接
				const select = editor.getSelection();
				if (select) {
					editor.replaceSelection(`[${select}](${url.href})`);
					return;
				}
				// 自动获取网页标题
				const from = editor.getCursor("from");

				const placeholder = "[Parsing URL...]";
				editor.replaceSelection(placeholder);

				const to = editor.getCursor("from");

				try {
					const res = await requestUrl(url.href);
					const contentType = res.headers["content-type"];

					if (contentType && contentType.startsWith("text/html")) {
						const html = res.text;
						const titleMatch = html.match(/<title>(.*?)<\/title>/);
						const title = titleMatch?.[1] ? titleMatch[1] : "no title";

						const finalLink = `[${title}](${url.href})`;
						editor.replaceRange(finalLink, from, to);
					} else if (contentType && contentType.startsWith("image")) {
						const finalLink = `![${url.pathname.replace(/.*\//, "")}](${
							url.href
						})`;

						editor.replaceRange(finalLink, from, to);
					} else {
						editor.replaceRange(clipboardText, from, to);
					}
				} catch {
					editor.replaceRange(clipboardText, from, to);
				}
			})
		);
		this.addSettingTab(new SettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Aoto Format")
			.setDesc("Enable auto format")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.autoFormat).onChange((value) => {
					this.plugin.settings.autoFormat = value;
					this.plugin.saveData(this.plugin.settings);
				});
			});
	}
}
