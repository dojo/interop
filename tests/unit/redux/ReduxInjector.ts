const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import { ReduxInjector } from './../../../src/redux/ReduxInjector';
import { createStore } from 'redux';

registerSuite('ReduxInjector', {
	reduxInjector() {
		const store = createStore((state) => state);
		const injector = new ReduxInjector(store);
		let injectorInvalidated = false;
		injector.on('invalidate', () => {
			injectorInvalidated = true;
		});
		store.dispatch({ type: 'TEST' });
		assert.isTrue(injectorInvalidated);
	},
	get() {
		const store = createStore((state) => state);
		const injector = new ReduxInjector(store);
		assert.strictEqual(injector.get(), store);
	},
	set() {
		const store = createStore((state) => state);
		const injector = new ReduxInjector(store);
		assert.throws(() => {
			injector.set();
		}, TypeError, 'Cannot perform .set() on ReduxInjector');
	}
});
