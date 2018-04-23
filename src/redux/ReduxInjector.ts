import { Store } from 'redux';

export interface ReduxInjectorPayload<S, O> {
	store: Store<S>;
	extraOptions?: O;
}

/**
 * Injector for redux store
 */
export function reduxInjectorFactory<S = any, O = any>(store: Store<S>, extraOptions?: O) {
	return (invalidator: () => void) => {
		store.subscribe(() => invalidator());
		return () => ({ store, extraOptions });
	};
}

export default reduxInjectorFactory;
