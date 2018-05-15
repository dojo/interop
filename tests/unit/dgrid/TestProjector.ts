import { ProjectorMixin } from '@dojo/framework/widget-core/mixins/Projector';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import DgridWrapperProperties from '../../../src/dgrid/DgridWrapperProperties';
import { w } from '@dojo/framework/widget-core/d';
import DgridWrapper from '../../../src/dgrid/DgridWrapper';
import { DNode } from '@dojo/framework/widget-core/interfaces';

export class TestProjector extends ProjectorMixin(WidgetBase) {
	testProperties: DgridWrapperProperties = {
		data: [
			{
				id: 1,
				first: 'first 1',
				last: 'last 1'
			},
			{
				id: 2,
				first: 'first 2',
				last: 'last 2'
			}
		],
		columns: {
			first: 'First',
			last: 'Last'
		},
		features: {}
	};

	render(): DNode | DNode[] {
		return w(DgridWrapper, { ...this.testProperties });
	}
}

export default TestProjector;
