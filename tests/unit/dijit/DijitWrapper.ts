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
		const widget = harness(DijitWrapper(MockDijit));
		widget.expectRender(v('div', { key: 'root' }, []), 'should have created an empty node');
		widget.destroy();
	},

	'a wrapped dijit with children dijit should render children'() {
		const ContainerDijitWidget = DijitWrapper(ContainerMockDijit);
		const MockDijitWidget = DijitWrapper(MockDijit);
		const widget = harness(ContainerDijitWidget);
		widget.setChildren([
			w(MockDijitWidget, { key: 'foo' }),
			w(MockDijitWidget, { key: 'bar' }),
			w(MockDijitWidget, { key: 'baz' })
		]);

		widget.expectRender(
			v('div', { key: 'root' }, [
				w(MockDijitWidget, { key: 'foo', onInstantiate: widget.listener } as any),
				w(MockDijitWidget, { key: 'bar', onInstantiate: widget.listener } as any),
				w(MockDijitWidget, { key: 'baz', onInstantiate: widget.listener } as any)
			])
		);
	},

	'a wrapped dijit should render supplied key'() {
		const widget = harness(DijitWrapper(MockDijit));
		widget.setProperties({
			key: 'foo'
		});
		widget.expectRender(v('div', { key: 'foo' }, []), 'should have created an empty node');
		widget.destroy();
	},

	'a contained dijit with children should render flat array of its children'() {
		const ContainerDijitWidget = DijitWrapper(ContainerMockDijit);
		const MockDijitWidget = DijitWrapper(MockDijit);
		const widget = harness(ContainerDijitWidget);
		const onInstantiate = stub();
		widget.setProperties({
			onInstantiate
		});
		widget.setChildren([
			w(MockDijitWidget, { key: 'foo' }),
			w(MockDijitWidget, { key: 'bar' }),
			w(MockDijitWidget, { key: 'baz' })
		]);

		widget.expectRender([
			w(MockDijitWidget, { key: 'foo', onInstantiate: widget.listener } as any),
			w(MockDijitWidget, { key: 'bar', onInstantiate: widget.listener } as any),
			w(MockDijitWidget, { key: 'baz', onInstantiate: widget.listener } as any)
		]);
		widget.destroy();
	},

	'a dijit wrapper should use tag name provided when rendering'() {
		const widget = harness(DijitWrapper(MockDijit, 'span'));
		widget.expectRender(v('span', { key: 'root' }, []));
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
