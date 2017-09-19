import { createHandle } from '@dojo/core/lang';
import { assign } from '@dojo/shim/object';
import { isHNode, isWNode, v } from '@dojo/widget-core/d';
import { Constructor, DNode, HNode, WNode } from '@dojo/widget-core/interfaces';
import { afterRender, WidgetBase } from '@dojo/widget-core/WidgetBase';
import Base from '@dojo/widget-core/meta/Base';
import { Dijit, DijitConstructor, DijitWrapperProperties, DijitWrapper as DijitWrapperClass } from './interfaces';

/**
 * An internal meta provider that provides the rendered DOM node on _root_ Dijits
 */
class DomNode extends Base {
	public get(key: string) {
		this.requireNode(key);
		return this.nodes.get(key);
	}
}

/**
 * Used to make it easier to peel off some values when spreading the `widget.properties` to dijit params
 */
interface DijitProperties extends DijitWrapperProperties {
	[param: string]: any;
}

/**
 * Internal `key` constant
 */
const DEFAULT_KEY = 'root';

/**
 * Wrap a Dojo 1 Dijit, so that it can exist inside of the Dojo 2 widgeting system.
 * @param Dijit The constructor function for the Dijit
 * @param tagName The tag name that should be used when creating the DOM for the dijit. Defaults to `div`.
 */
export function DijitWrapper<D extends Dijit>(Dijit: DijitConstructor<D>, tagName = 'div'): Constructor<DijitWrapperClass<D>> {
	class DijitWrapper extends WidgetBase<Partial<D> & DijitWrapperProperties, WNode<DijitWrapperClass<D>>> {
		private _dijit: D | undefined;
		private _node: HTMLElement | undefined;

		/**
		 * Temporary logic until [dojo/widget-core#670](https://github.com/dojo/widget-core/issues/670) is delivered
		 * @param params The paramters for the Dijit
		 */
		private _updateDijit(params: { [param: string]: any; }) {
			// not null assertion, because this can only be called when `_dijit` is assigned
			this._dijit!.set(params);
		}

		protected render() {
			const { bind, key = DEFAULT_KEY, onInstantiate, registry, ...params } = this.properties as DijitProperties;
			if (!this._dijit) {
				const dijit = this._dijit = new Dijit(params as Partial<D>);
				onInstantiate && onInstantiate(dijit);
				this.own(createHandle(() => dijit.destroy(true)));
			}
			else {
				this._updateDijit(params);
			}
			const dijit = this._dijit!;
			if (!onInstantiate) {
				const node = this.meta(DomNode).get(key);
				if (node) {
					// We need to accommodate for the node changing, because it is theoretically impossible,
					// but have been unable to create the right conditions where this would actually occur
					/* istanbul ignore else */
					if (!this._node || (this._node !== node)) {
						dijit.placeAt(node, 'replace');
						/* istanbul ignore else */
						if (!this._node) {
							dijit.startup();
						}
						this._node = node;
					}
				}
			}

			return onInstantiate ? this.children : v(tagName, { key }, this.children);
		}

		/**
		 * Decorates the properties of children, injecting an `onInstantiate` callback so that they add themselves to
		 * their enlosing parent.
		 * @param result The render returned, ready to be decorated
		 * @returns The post decorated values
		 */
		@afterRender()
		public decorateChildProperties(result: HNode | DNode[]) {
			if (!this._dijit || !this._dijit.addChild) {
				return result;
			}
			const dijit = this._dijit;
			const addChild = dijit.addChild!;

			function decorateChild(child: DNode, idx: number) {
				if (isWNode(child) && !(child.properties as DijitWrapperProperties).onInstantiate) {
					assign(child.properties, {
						onInstantiate(instance: Dijit) {
							addChild.call(dijit, instance, idx);
						}
					});
				}
			}

			Array.isArray(result) ? result.forEach(decorateChild) : result.children.forEach(decorateChild);

			return result;
		}
	};

	return DijitWrapper;
}

export default DijitWrapper;
