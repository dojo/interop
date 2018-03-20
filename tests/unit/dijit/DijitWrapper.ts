const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import harness from '@dojo/test-extras/harness';
import { stub } from 'sinon';
import DijitWrapper from '../../../src/dijit/DijitWrapper';

import { v, w } from '@dojo/widget-core/d';

class MockDijit {
	public id: string;
	public srcNodeRef: HTMLElement;
	public domNode: HTMLElement;

	constructor(params: Object, srcRefNode?: string | Node) {}

	public destroy(preserveDom = false) {}

	public placeAt(node: HTMLElement, reference?: string | number) {
		if (reference !== 'replace') {
			throw new Error('Expected "replace" as reference');
		}
		return this;
	}

	public set() {
		return this;
	}

	public startup() {}
}

class ContainerMockDijit extends MockDijit {
	public addChild() {}
}

registerSuite('dijit/DijitWrapper', {
	'a wrapped dijit should create an empty vnode'() {
		const h = harness(() => w(DijitWrapper(MockDijit), {}));
		h.expect(() => v('div', { key: 'root' }, []));
	},

	'a wrapped dijit with children dijit should render children'() {
		const ContainerDijitWidget = DijitWrapper(ContainerMockDijit);
		const MockDijitWidget = DijitWrapper(MockDijit);
		const h = harness(() =>
			w(ContainerDijitWidget, {}, [
				w(MockDijitWidget, { key: 'foo' }),
				w(MockDijitWidget, { key: 'bar' }),
				w(MockDijitWidget, { key: 'baz' })
			])
		);

		h.expect(() =>
			v('div', { key: 'root' }, [
				w(MockDijitWidget, { key: 'foo', onInstantiate: () => {} }),
				w(MockDijitWidget, { key: 'bar', onInstantiate: () => {} }),
				w(MockDijitWidget, { key: 'baz', onInstantiate: () => {} })
			])
		);
	},

	'a wrapped dijit should render supplied key'() {
		const h = harness(() => w(DijitWrapper(MockDijit), { key: 'foo' }));
		h.expect(() => v('div', { key: 'foo' }, []));
	},

	'a contained dijit with children should render flat array of its children'() {
		const ContainerDijitWidget = DijitWrapper(ContainerMockDijit);
		const MockDijitWidget = DijitWrapper(MockDijit);
		const onInstantiate = stub();
		const h = harness(() =>
			w(ContainerDijitWidget, { onInstantiate }, [
				w(MockDijitWidget, { key: 'foo' }),
				w(MockDijitWidget, { key: 'bar' }),
				w(MockDijitWidget, { key: 'baz' })
			])
		);

		h.expect(() => [
			w(MockDijitWidget, { key: 'foo', onInstantiate: () => {} }),
			w(MockDijitWidget, { key: 'bar', onInstantiate: () => {} }),
			w(MockDijitWidget, { key: 'baz', onInstantiate: () => {} })
		]);
	},

	'a dijit wrapper should use tag name provided when rendering'() {
		const h = harness(() => w(DijitWrapper(MockDijit, 'span'), {}));
		h.expect(() => v('span', { key: 'root' }, []));
	},

	'mixed in classes hold reference to Dijit constructor and tagName'() {
		// IE11 has some strange GC behaviours which sometimes deferences the constructor, thereby holding a
		// direct reference should avoid this issue.  See: https://github.com/dojo/interop/issues/10
		const DijitWidget = DijitWrapper(MockDijit, 'span');
		assert.strictEqual(
			(DijitWidget as any).Dijit,
			MockDijit,
			'The constructor should equal the passed constructor'
		);
		assert.strictEqual((DijitWidget as any).tagName, 'span', 'The tag name should equal the passed tag name');
	}
});
