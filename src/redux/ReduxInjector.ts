import { Store } from 'redux';
import { Base } from '@dojo/widget-core/Injector';

/**
 * Injector for redux store
 */
export class ReduxInjector<S = any> extends Base<Store<S>> {

	/**
	 * Injected redux store
	 */
	protected store: Store<S>;

	/**
	 * Sets the store and attaches the injectors invalidate to the redux
	 * stores bind.
	 *
	 * @param store The store for the injector
	 */
	constructor(store: Store<S>) {
		super();
		this.store = store;
		this.store.subscribe(this.invalidate.bind(this));
	}

	/**
	 * Returns the value to be injected, in this case the Store
	 * that was passed when creating the Injector.
	 *
	 * @returns Returns the store
	 */
	public toInject(): Store<S> {
		return this.store;
	}
}

export default ReduxInjector;
