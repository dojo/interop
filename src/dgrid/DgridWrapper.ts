import { DNode } from '@dojo/framework/widget-core/interfaces';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { diffProperty } from '@dojo/framework/widget-core/decorators/diffProperty';
import { DgridWrapperProperties, constructionKeys } from './DgridWrapperProperties';
import { DgridInnerWrapper, DgridState } from './DgridInnerWrapper';
import { w } from '@dojo/framework/widget-core/d';
import { columnsDiff } from './diff';

const keyPrefix = 'dgridWrapper';

@diffProperty('columns', columnsDiff)
export class DgridWrapper extends WidgetBase<DgridWrapperProperties> {
	key = 0;
	gridState: DgridState;

	protected render(): DNode | DNode[] {
		const changedPropertyKeys = this.changedPropertyKeys;
		// Some properties require the dgrid grid to be destroyed and recreated because a different
		// combination of mixins is required.  Some properties when changed can be handled by an existing
		// grid.  Determine if a new grid is needed or not.  If a new grid is needed, generate a new
		// key and let the vdom throw away the old grid.
		if (changedPropertyKeys.indexOf('features') >= 0) {
			this.key++;
		} else {
			const gridConstructionKeys = changedPropertyKeys.filter((key) => {
				return constructionKeys.indexOf(key) >= 0;
			});
			if (gridConstructionKeys.length) {
				this.key++;
			}
		}
		return w(DgridInnerWrapper, {
			key: keyPrefix + this.key,
			...this.properties,
			gridState: this.gridState,
			onGridState: (gridState: DgridState) => {
				this.gridState = gridState;
			}
		});
	}
}

export default DgridWrapper;
