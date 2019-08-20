const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import { stub } from 'sinon';
import { reduxInjectorFactory } from './../../../src/redux/ReduxInjector';
import { createStore } from 'redux';

registerSuite('reduxInjectorFactory', {
	reduxInjector() {
		const store = createStore((state) => state || {});
		const injectorFactory = reduxInjectorFactory(store);
		const invalidatorStub = stub();
		injectorFactory(invalidatorStub);
		store.dispatch({ type: 'TEST' });
		assert.isTrue(invalidatorStub.calledOnce);
	},
	get() {
		const store = createStore((state) => state || {});
		const extraOptions = {};
		const invalidatorStub = stub();
		const injector = reduxInjectorFactory(store, extraOptions)(invalidatorStub);
		assert.deepEqual(injector(), { store, extraOptions });
	}
});
