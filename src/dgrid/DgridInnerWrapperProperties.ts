import { DgridWrapperProperties } from './DgridWrapperProperties';
import { DgridState } from './DgridInnerWrapper';

export interface DgridInnerWrapperProperties extends DgridWrapperProperties {
	// The inner wrapper can pass a state object to the outer wrapper widget so
	// a dgrid grid can be destroyed and recreated back to the same state when
	// desired.
	gridState?: DgridState;
	onGridState: (state: DgridState) => void;
}
