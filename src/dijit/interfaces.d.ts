import { DNode, WidgetProperties, WNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

/**
 * A basic interface for Dojo 1 Dijit instances
 */
export interface Dijit {
	/**
	 * Available in certain container widgets, used by the wrapper to append children to parent
	 */
	addChild?(child: object, insertIndex?: number): void;

	/**
	 * Perform cleanup activities related to the Dijit instance
	 */
	destroy(preserveDom?: boolean): void;

	/**
	 * Used to insert a _root_ dijit into the DOM created by the projector
	 */
	placeAt(reference: Node | string | DocumentFragment, position?: string | number): this;

	/**
	 * Used to set a param bag on an already instantiated dijit when updating properties
	 */
	set(values: { [param: string]: any }): this;

	/**
	 * Complete the Dijit lifecycle on an already existing DOM node
	 */
	startup(): void;
}

/**
 * A generic interface for Dojo 1 Dijit constructor functions
 */
export interface DijitConstructor<T extends Dijit> {
	new (params: Partial<T>, srcNodeRef?: string | Node): T;
}

/**
 * Additional DijitWrapperProperties
 */
export interface DijitWrapperProperties extends WidgetProperties {
	/**
	 * A property that if present causes the DijitWrapper to call method with the instantiated dijit, instead of
	 * attempting to generate a DOM node to attach the dijit to.  Designed to be injected by a parent dijit so it
	 * can append the child to itself.
	 */
	onInstantiate?(dijit: Dijit): void;
}

export class DijitWrapper<D extends Dijit> extends WidgetBase<Partial<D> & DijitWrapperProperties, WNode<DijitWrapper<Dijit>>> {
	/**
	 * A method that is decorated to be called after the render that will inject `onInstantiate` into children `DijitWrapper`s
	 * @param result The render result
	 */
	public decorateChildProperties(result: DNode | DNode[]): DNode | DNode[];
}
