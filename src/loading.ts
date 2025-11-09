import { StateEffect, StateField } from '@codemirror/state'
import { Decoration, DecorationSet, EditorView, WidgetType } from '@codemirror/view'

let placeholder: string
class LoadingWidget extends WidgetType {
	toDOM(view: EditorView): HTMLElement {
		const div = document.createElement('span')
		div.innerText = placeholder!
		div.style.color = 'gray'
		return div
	}
}

const showLoadingEffect = StateEffect.define<{ from: number; to: number }>()
const removeLoadingEffect = StateEffect.define<{ from: number; to: number }>()

export const loadingField = StateField.define<DecorationSet>({
	create() {
		return Decoration.none
	},
	update(value, tr) {
		value = value.map(tr.changes)
		for (const effect of tr.effects) {
			if (effect.is(showLoadingEffect)) {
				const widget = Decoration.widget({
					widget: new LoadingWidget()
				})
				value = value.update({
					add: [widget.range(effect.value.from, effect.value.to)]
				})
			} else if (effect.is(removeLoadingEffect)) {
				value = value.update({
					filter: (from, to) => {
						return from !== effect.value.from && to !== effect.value.to
					}
				})
			}
		}
		return value
	},
	provide: (f) => EditorView.decorations.from(f)
})

export function showLoading(view: EditorView, from: number, to: number, placeholderText: string) {
	placeholder = placeholderText
	view.dispatch({
		effects: showLoadingEffect.of({ from, to })
	})
}

export function removeLoading(view: EditorView, from: number, to: number) {
	view.dispatch({
		effects: removeLoadingEffect.of({ from, to })
	})
}
