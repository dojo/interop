import { Store } from 'redux';
import { Injector } from '@dojo/widget-core/Injector';

/**
 * Injector for redux store
 */
export class ReduxInjector<S = any> extends Injector<Store<S>> {
	/**
	 * Sets the store and attaches the injectors invalidate to the redux
	 * stores bind.
	 *
	 * @param store The store for the injector
	 */
	constructor(store: Store<S>) {
		super(store);
		store.subscribe(() => {
			this.emit({ type: 'invalidate' });
		});
	}

	/**
	 * Stores cannot be set on instances of `ReduxInjector`.
	 */
	public set(): never {
		throw new TypeError('Cannot perform .set() on ReduxInjector');
	}
}

export default ReduxInjector;
