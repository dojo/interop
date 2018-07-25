import { assign } from '@dojo/framework/shim/object';
import { isWNode, v } from '@dojo/framework/widget-core/d';
import { Constructor, DNode, VNode, WNode } from '@dojo/framework/widget-core/interfaces';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import afterRender from '@dojo/framework/widget-core/decorators/afterRender';
import Base from '@dojo/framework/widget-core/meta/Base';
import { Dijit, DijitConstructor, DijitWrapperProperties, DijitWrapper as DijitWrapperClass } from './interfaces';

/**
 * An internal meta provider that provides the rendered DOM node on _root_ Dijits
 */
class DomNode extends Base {
	public get(key: string | number) {
		return this.getNode(key);
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
export function DijitWrapper<D extends Dijit>(
	Dijit: DijitConstructor<D>,
	tagName = 'div'
): Constructor<DijitWrapperClass<D>> {
	class DijitWrapper extends WidgetBase<Partial<D> & DijitWrapperProperties, WNode<DijitWrapperClass<D>>> {
		private _dijit: D | undefined;
		private _node: HTMLElement | undefined;

		/**
		 * Temporary logic until [dojo/widget-core#670](https://github.com/dojo/widget-core/issues/670) is delivered
		 * @param params The paramters for the Dijit
		 */
		private _updateDijit(params: { [param: string]: any }) {
			// not null assertion, because this can only be called when `_dijit` is assigned
			this._dijit!.set(params);
		}

		/**
		 * A reference to the Dijit constructor function for this class
		 */
		public static readonly Dijit = Dijit;

		/**
		 * The tag name to be used by this class when constructing a virutal DOM node for a Dijit
		 */
		public static readonly tagName = tagName;

		protected render() {
			const { bind, key = DEFAULT_KEY, onInstantiate, registry, ...params } = this.properties as DijitProperties;
			if (!this._dijit) {
				const dijit = (this._dijit = new DijitWrapper.Dijit(params as Partial<D>));
				onInstantiate && onInstantiate(dijit);
			} else {
				this._updateDijit(params);
			}
			const dijit = this._dijit!;
			if (!onInstantiate) {
				const node = this.meta(DomNode).get(key) as HTMLElement;
				if (node) {
					// We need to accommodate for the node changing, because it is theoretically impossible,
					// but have been unable to create the right conditions where this would actually occur
					/* istanbul ignore else */
					if (!this._node || this._node !== node) {
						dijit.placeAt(node, 'replace');
						/* istanbul ignore else */
						if (!this._node) {
							dijit.startup();
						}
						this._node = node;
					}
				}
			}

			return onInstantiate ? this.children : v(DijitWrapper.tagName, { key }, this.children);
		}

		protected onDetach(): void {
			this._dijit && this._dijit.destroy();
		}

		/**
		 * Decorates the properties of children, injecting an `onInstantiate` callback so that they add themselves to
		 * their enlosing parent.
		 * @param result The render returned, ready to be decorated
		 * @returns The post decorated values
		 */
		@afterRender()
		public decorateChildProperties(result: VNode | DNode[]) {
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

			Array.isArray(result)
				? result.forEach(decorateChild)
				: result.children && result.children.forEach(decorateChild);

			return result;
		}
	}

	return DijitWrapper;
}

export default DijitWrapper;
