let lang: string;

export function i18n(language: string) {
	if (language.startsWith("zh")) {
		lang = "zh";
	} else {
		lang = language;
	}
}

export function t(keys: Record<string, string>): string {
	return keys[lang] || keys["en"];
}
