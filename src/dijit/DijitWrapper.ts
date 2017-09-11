import { createHandle } from '@dojo/core/lang';
import { v } from '@dojo/widget-core/d';
import { Constructor, DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import Base from '@dojo/widget-core/meta/Base';
import { Dijit, DijitConstructor, DijitParams } from './interfaces';

class DomNode extends Base {
	public get(key: string) {
		this.requireNode(key);
		return this.nodes.get(key);
	}
}

/**
 * The wrapper class for a wrapped Dojo 1 Dijit
 */
export type DijitWrapper<P extends DijitParams> = Constructor<WidgetBase<P & WidgetProperties>>;

/**
 * Internal `key` constant
 */
const key = 'root';

/**
 * Wrap a Dojo 1 Dijit, so that it can exist inside of the Dojo 2 widgeting system.
 * @param Dijit The constructor function for the Dijit
 * @param tagName The tag name that should be used when creating the DOM for the dijit. Defaults to `div`
 */
export function DijitWrapper<D extends Dijit>(Dijit: DijitConstructor<D, Partial<D>>, tagName = 'div'): DijitWrapper<Partial<D>> {
	return class extends WidgetBase<Partial<D>> {
		private _dijit: D | undefined;

		protected render(): DNode {
			const node = this.meta(DomNode).get(key);
			if (node && !this._dijit) {
				const dijit = this._dijit = new Dijit(this.properties, node);
				dijit.startup();
				this.own(createHandle(() => {
					dijit.destroy();
					this._dijit = undefined;
				}));
			}
			return v(tagName, { key }, this.children);
		}
	};
}

export default DijitWrapper;
