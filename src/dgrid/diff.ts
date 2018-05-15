import { Column, ColumnSpec } from 'dgrid/Grid';
import { PropertyChangeRecord } from '@dojo/framework/widget-core/interfaces';
import { auto } from '@dojo/framework/widget-core/diff';

export function columnsDiff(prevColumnSpec: ColumnSpec, newColumnSpec: ColumnSpec): PropertyChangeRecord {
	let changed = true;
	const prevIsArray = Array.isArray(prevColumnSpec);
	const newIsArrary = Array.isArray(newColumnSpec);

	if (prevIsArray === newIsArrary) {
		if (prevIsArray) {
			const prevColumnArray = <Column[]>prevColumnSpec;
			const newColumnArray = <Column[]>newColumnSpec;
			if (prevColumnArray.length === newColumnArray.length) {
				changed = prevColumnArray.some((previousColumnDef, i) => {
					return auto(previousColumnDef, newColumnArray[i]).changed;
				});
			}
		} else {
			changed = auto(prevColumnSpec, newColumnSpec).changed;
		}
	}

	return {
		changed,
		value: newColumnSpec
	};
}
