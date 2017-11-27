import { Store } from 'redux';
import { Injector } from '@dojo/widget-core/Injector';

export interface ReduxInjectorPayload<S, O> {
	store: Store<S>;
	extraOptions?: O;
}

/**
 * Injector for redux store
 */
export class ReduxInjector<S = any, O = any> extends Injector<ReduxInjectorPayload<S, O>> {
	/**
	 * Sets the store and attaches the injectors invalidate to the redux
	 * stores bind.
	 *
	 * @param store The store for the injector
	 * @param extraOptions Additional options returned alongside the store with `getProperties`
	 */
	constructor(store: Store<S>, extraOptions?: O) {
		super({ store, extraOptions });
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
