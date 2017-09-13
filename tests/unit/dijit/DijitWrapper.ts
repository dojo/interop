import * as registerSuite from 'intern!object';
// import * as assert from 'intern/chai!assert';
import DijitWrapper from '../../../src/dijit/DijitWrapper';

import { w } from '@dojo/widget-core/d';

registerSuite({
	name: 'dijit/DijitWrapper',

	'wrap a Dijit'() {
		class MockDijit {
			public id: string;
			public srcNodeRef: HTMLElement;
			public domNode: HTMLElement;

			constructor(params: Object, srcRefNode?: string | Node) {
				//
			}

			public addChild() {
				//
			}

			public destroy(preserveDom = true) {
				//
			}

			public placeAt() {
				return this;
			}

			public set() {
				return this;
			}

			public startup() {
				//
			}
		}

		const MockDijitWidget = DijitWrapper(MockDijit);

		const wnode = w(MockDijitWidget, {
			id: 'foo'
		}, [ w(MockDijitWidget, {}) ]);

		console.log(wnode);
	}
});
