/**
 * A basic interface for Dojo 1 Dijit instances
 */
export interface Dijit {
	/**
	 * This is the _root_ of a Dijit instance, which maybe different than the `srcNodeRef`
	 */
	domNode: HTMLElement;

	/**
	 * A reference to the origina DOM node
	 */
	srcNodeRef: HTMLElement;

	/**
	 * Perform cleanup activities related to the Dijit instance
	 */
	destroy(preserveDom?: boolean): void;

	/**
	 * Complete the Dijit lifecycle on an already existing DOM node
	 */
	startup(): void;
}

/**
 * A generic interface for Dojo 1 Dijit constructor functions
 */
export interface DijitConstructor<T extends Dijit, P extends DijitParams> {
	new (params: DijitParams, srcNodeRef: string | Node): T;
}

export interface DijitParams {
	[param: string]: any;
}
