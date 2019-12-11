import { deepMixin } from '@dojo/framework/core/util';
import * as Grid from 'dgrid/Grid';
import * as declare from 'dojo/_base/declare';
import * as CellSelection from 'dgrid/CellSelection';
import * as Selector from 'dgrid/Selector';
import * as ColumnHider from 'dgrid/extensions/ColumnHider';
import * as ColumnReorder from 'dgrid/extensions/ColumnReorder';
import * as ColumnResizer from 'dgrid/extensions/ColumnResizer';
import * as CompoundColumns from 'dgrid/extensions/CompoundColumns';
import * as ColumnSet from 'dgrid/ColumnSet';
import * as Tree from 'dgrid/Tree';
import * as MemoryStore from 'dstore/Memory';
import * as TreeStore from 'dstore/Tree';
import * as Trackable from 'dstore/Trackable';
import * as StoreMixin from 'dgrid/_StoreMixin';
import * as OnDemandGrid from 'dgrid/OnDemandGrid';
import * as Keyboard from 'dgrid/Keyboard';
import * as Pagination from 'dgrid/extensions/Pagination';
import * as Selection from 'dgrid/Selection';
import { DNode, WidgetProperties } from '@dojo/framework/core/interfaces';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { diffProperty } from '@dojo/framework/core/decorators/diffProperty';
import { w, dom } from '@dojo/framework/core/vdom';
import { columnsDiff } from './diff';

export enum SelectionMode {
	none = 'none',
	multiple = 'multiple',
	single = 'single',
	extended = 'extended'
}

export interface Selections {
	[id: string]: boolean;
}

export interface DgridWrapperFeatures {
	// Setting pagination to true turns off infinite scrolling and displays rows in discrete pages.
	pagination?: boolean;
	// Add keyboard navigation capability.
	keyboard?: boolean;
	// Add selection capabilities to a grid.
	selection?: SelectionType;
	// Add selector column to the grid.  selection must be set as well.
	selector?: boolean;
	// Support hierarchical data
	// When tree is enabled, the items in the data array are expected to have the following properties:
	//  - hasChildren: boolean, true indicates this item has children
	//  - parent: ID, if this item is a child, parent is the ID of the parent item.
	tree?: boolean;
	// Enable the column hider extension.
	columnHider?: boolean;
	// Enable the column reorder extension.
	columnReorder?: boolean;
	// Enable the column resizer extension.
	columnResizer?: boolean;
	// Enable the compound column extension.
	compoundColumns?: boolean;
	// Enable the column set mixin.
	columnSet?: boolean;
}

export interface DgridWrapperProperties extends WidgetProperties {
	features?: DgridWrapperFeatures;

	// Grid properties
	columns?: ColumnSpec;
	subRows?: Array<Column[]>;

	// An array of data items that will be pushed into a Memory store and passed to the dgrid grid.
	data: {}[];

	// Grid Events
	// See https://github.com/SitePen/dgrid/blob/master/doc/usage/Working-with-Events.md
	onSort?: (sort: SortData) => void;
	onError?: (error: ErrorData) => void;

	// _StoreMixin properties
	// See https://github.com/SitePen/dgrid/blob/master/_StoreMixin.js for documentation and default values.
	noDataMessage?: string;
	loadingMessage?: string;

	// Pagination properties
	// See https://github.com/SitePen/dgrid/blob/master/extensions/Pagination.js for documentation and default values.
	rowsPerPage?: number;
	pagingTextBox?: boolean;
	previousNextArrows?: boolean;
	firstLastArrows?: boolean;
	pagingLinks?: number;
	pageSizeOptions?: number[];
	showLoadingMessage?: boolean;

	// Keyboard properties
	// See https://github.com/SitePen/dgrid/blob/master/Keyboard.js for documentation and default values.
	pageSkip?: number;
	tabIndex?: number;
	onCellFocusIn?: (focused: CellFocusData) => void;
	onCellFocusOut?: (focused: CellFocusData) => void;

	// Selection properties
	// See https://github.com/SitePen/dgrid/blob/master/Selection.js for documentation and default values.
	deselectOnRefresh?: boolean;
	allowSelectAll?: boolean;
	selection?: Selections;
	selectionMode?: SelectionMode;
	allowTextSelection?: boolean;
	onSelect?: (selected: SelectionData, selections: Selections) => void;
	onDeselect?: (deselected: SelectionData, selections: Selections) => void;

	// Tree properties
	// See https://github.com/SitePen/dgrid/blob/master/Tree.js for documentation and default values.
	collapseOnRefresh?: boolean;
	enableTreeTransitions?: boolean;
	treeIndentWidth?: number;

	// Column Hider properties
	// See https://github.com/SitePen/dgrid/blob/master/extensions/ColumnHider.js for documentation and default values.
	onColumnStateChange?: (columnChange: ColumnStateChangeData) => void;

	// Column Reorder properties
	// See https://github.com/SitePen/dgrid/blob/master/extensions/ColumnReorder.js for documentation and default values.
	onColumnReorder?: (columnReorder: ColumnReorderData) => void;

	// Column Resizer properties
	// See https://github.com/SitePen/dgrid/blob/master/extensions/ColumnResizer.js for documentation and default values.
	onColumnResize?: (columnResize: ColumnResizeData) => void;

	minWidth?: number;
	adjustLastColumn?: boolean;

	// Keep the scroll position
	keepScrollPosition?: boolean;

	columnSets?: Array<Array<Column[]>>;
}

// List of dgrid property names that must be passed to dgrid when a grid is constructed.
// These keys can not update an existing grid.  If they change, a new grid must be constructed.
export const constructionKeys = [
	'previousNextArrows',
	'firstLastArrows',
	'pagingLinks',
	'tabIndex',
	'allowSelectAll',
	'selection',
	'treeIndentWidth'
];

export interface Column {
	field?: string;
	id?: string | number;
	label?: string;
	className?: string;
	colSpan?: number;
	rowSpan?: number;
	sortable?: boolean;
	formatter?: string | Formatter;
	selector?: string;
	children?: Column[];
	showChildHeaders?: boolean;

	get?(item: any): any;
	set?(item: any): any;
	renderCell?(object: any, value: any, node: HTMLElement): HTMLElement | void;
	renderHeaderCell?(node: HTMLElement): HTMLElement | void;
}

export type ColumnSpec = { [key: string]: Column | string } | Column[];

export type Formatter = (value: any, object: any) => string;

export enum SelectionType {
	row = 'row',
	cell = 'cell'
}

export interface SelectionData {
	type: SelectionType;
	data: {
		// The data item used to render the selected row.
		item: any;
		// If the type is "cell", this contains the field name that corresponds to the selected cell.
		field?: string;
	}[];
}

export interface ColumnStateChangeData {
	field?: string;
	id?: string | number;
	hidden: boolean;
}

export interface ColumnResizeData {
	id?: string | number;
	field?: string;
	width?: number;
	parentType?: string;
}

export interface ColumnReorderData {
	subRow?: ColumnSpec;
	field?: string;
	id?: string | number;
}

export interface ErrorData {
	error?: Error | string;
}

export interface SortData {
	parentType?: string;
	sort?: { property: string; descending?: boolean }[];
}

export interface CellFocusData {
	row?: {};
	cell?: {};
	parentType?: string;
}

export interface DgridInnerWrapperProperties extends DgridWrapperProperties {
	// The inner wrapper can pass a state object to the outer wrapper widget so
	// a dgrid grid can be destroyed and recreated back to the same state when
	// desired.
	gridState?: DgridState;
	onGridState: (state: DgridState) => void;
}

/**
 * When a dgrid grid is destroyed some of its state will need to be restored when the next
 * grid is created.  This interface describes that state.
 */
export interface DgridState {
	currentPage?: number;
}

interface DgridGrid extends Grid, Pagination, Keyboard, Selection {}

interface DgridProperties
	extends Grid.KwArgs,
		StoreMixin.KwArgs,
		Pagination.KwArgs,
		OnDemandGrid.KwArgs,
		Selection.KwArgs,
		ColumnSet.KwArgs {
	selection?: Selections;
}

interface DgridSelectionEvent extends Event {
	rows?: { data: any }[];
	cells?: { data: any }[];
}

interface DgridColumnHiderEvent extends Event {
	grid: DgridGrid;
	column: Column;
	hidden: boolean;
}

interface DgridColumnReorderEvent extends Event {
	grid: DgridGrid;
	subRow: ColumnSpec;
	column: Column;
}

interface DgridColumnResizeEvent extends Event {
	grid: DgridGrid;
	columnId: string | number;
	width: number;
	parentType?: string;
}

interface DgridSortEvent extends Event {
	grid: DgridGrid;
	parentType?: string;
	sort?: { property: string; descending?: boolean }[];
}

interface DgridErrorEvent extends Event {
	grid: DgridGrid;
	error?: Error | string;
}

interface DgridCellFocusEvent extends Event {
	grid: DgridGrid;
	row?: {};
	cell?: {};
	parentType?: string;
}

function duplicate<T extends {}>(source: T): T {
	const target = Object.create(Object.getPrototypeOf(source));

	return deepMixin(target, source);
}

function buildSelectEvent(event: DgridSelectionEvent): SelectionData {
	const selectionType = event.rows ? SelectionType.row : SelectionType.cell;
	const data: SelectionData = {
		type: selectionType,
		data: []
	};
	if (selectionType === SelectionType.row) {
		event.rows &&
			(data.data = event.rows.map((rowData: any) => {
				return {
					item: rowData.data
				};
			}));
	} else {
		event.cells &&
			(data.data = event.cells.map((cellData: any) => {
				return {
					item: cellData.row.data,
					field: cellData.column.field
				};
			}));
	}

	return data;
}

function buildColumnStateChange({ column: { field, id }, hidden }: DgridColumnHiderEvent): ColumnStateChangeData {
	return {
		field,
		id,
		hidden
	};
}

function buildColumnReorder({ column: { field, id }, subRow }: DgridColumnReorderEvent): ColumnReorderData {
	return {
		field,
		id,
		subRow
	};
}

function buildColumnResize({
	grid: { columns },
	width,
	parentType,
	columnId
}: DgridColumnResizeEvent): ColumnResizeData {
	const { field, id } = columns[columnId];
	return {
		field,
		id,
		width,
		parentType
	};
}

function buildSort({ parentType, sort }: DgridSortEvent): SortData {
	return {
		parentType,
		sort
	};
}

function buildError({ error }: DgridErrorEvent): ErrorData {
	return {
		error
	};
}

function buildCellFocus({ row, cell, parentType }: DgridCellFocusEvent): CellFocusData {
	return {
		row,
		cell,
		parentType
	};
}

function duplicateColumnDef(columnsSpec: Grid.ColumnSpec): Grid.ColumnSpec {
	if (Array.isArray(columnsSpec)) {
		if (columnsSpec.length === 0) {
			return [];
		}
		return columnsSpec.map((columnSpec) => {
			return duplicate(columnSpec);
		});
	} else {
		return duplicate(columnsSpec);
	}
}

function duplicateColumnSets(columnSets: Array<Array<Grid.Column[]>>): Array<Array<Grid.Column[]>> {
	return columnSets.map((subRows) => {
		return subRows.map((subRow) => {
			return subRow.map((column) => duplicate(column));
		});
	});
}

function buildConstructor(properties: DgridInnerWrapperProperties, emitGridState: () => void): any {
	const {
		pagination = false,
		keyboard = false,
		selection = undefined,
		selector = false,
		tree = false,
		columnHider = false,
		columnReorder = false,
		columnResizer = false,
		compoundColumns = false,
		columnSet = false
	} = properties.features || {};

	let mixins: any[] = [];
	let overrides: any = {};
	if (pagination) {
		mixins.push(Grid);
		mixins.push(Pagination);

		overrides._updateNavigation = function _updateNavigation(total: number) {
			this.inherited(_updateNavigation, arguments);
			emitGridState();
		};
	} else {
		mixins.push(OnDemandGrid);
	}

	if (tree) {
		mixins.push(Tree);
	}

	if (keyboard) {
		mixins.push(Keyboard);
	}

	if (selection) {
		mixins.push(selection === SelectionType.row ? Selection : CellSelection);
		if (selector) {
			mixins.push(Selector);
		}
	}

	if (columnHider) {
		mixins.push(ColumnHider);
	}

	if (columnReorder) {
		mixins.push(ColumnReorder);
	}

	if (columnResizer) {
		mixins.push(ColumnResizer);
	}

	if (compoundColumns) {
		mixins.push(CompoundColumns);
	}

	if (columnSet) {
		mixins.push(ColumnSet);
	}

	return declare(mixins as any, overrides);
}

function buildCollection(properties: DgridProperties, data?: {}[], features?: DgridWrapperFeatures): any {
	const treeEnabled = features && features.tree;
	let mixins: any[] = [MemoryStore, Trackable];
	let overrides: any = {};

	if (treeEnabled) {
		mixins.push(TreeStore);
		overrides.getRootCollection = function() {
			return this.root.filter((item: any) => {
				return item.parent == null;
			});
		};
	}

	const Store = declare(mixins as any, overrides);
	let collection = new Store({
		data
	});
	if (treeEnabled) {
		collection = collection.getRootCollection();
	}
	return collection;
}

/**
 * Wrap a dgrid widget, so that it can exist inside of the Dojo 2 widgeting system.
 *
 * This widget will construct a dgrid widget based on DgridProperties but it will only react to
 * changes in DgridProperties#data.  If the other properties change, then this widget will need
 * to be destroyed and a new one created.
 */
export class DgridInnerWrapper extends WidgetBase<DgridInnerWrapperProperties> {
	private _grid!: DgridGrid;

	protected render(): DNode {
		let grid = this._grid;
		if (!grid) {
			grid = this._grid = this.initGrid();
			this.registerGridEvents();
		} else {
			this.setChangedGridProperites();
		}
		return dom({ node: grid.domNode });
	}

	protected onAttach(): void {
		const grid = this._grid;
		const handle = grid.on('dgrid-refresh-complete', () => {
			handle.remove();
			this.restoreGridState();
		});
		grid.startup();
	}

	protected onDetach(): void {
		// @dojo/framework expects this node to still be attached so we need to
		this._grid && this._grid.destroy();
	}

	private emitGridState(): void {
		this.properties.onGridState({
			currentPage: this._grid._currentPage
		});
	}

	private initGrid(): DgridGrid {
		const Constructor = buildConstructor(this.properties, this.emitGridState.bind(this));
		return new Constructor(this.filterProperties(this.properties));
	}

	private restoreGridState() {
		const { gridState } = this.properties;
		if (gridState) {
			const { currentPage } = gridState;
			if (currentPage && currentPage > 1 && this._grid.gotoPage) {
				this._grid.gotoPage(currentPage);
			}
		}
	}

	private filterProperties(properties: DgridWrapperProperties): DgridProperties {
		// Remove DgridWrapperProperties properties not used by dgrid.
		const { features, data, ...otherProperties } = properties;
		const newProperties: DgridProperties = otherProperties;
		const columnSet = features && features.columnSet;
		if (data != null) {
			newProperties.collection = buildCollection(newProperties, data, this.properties.features);
		}
		if (columnSet) {
			if (newProperties.columnSets != null) {
				newProperties.columnSets = duplicateColumnSets(newProperties.columnSets);
			} else {
				newProperties.columnSets = [];
			}
			delete newProperties.columns;
		} else {
			if (newProperties.columns != null) {
				newProperties.columns = duplicateColumnDef(newProperties.columns);
			}
			delete newProperties.columnSets;
		}
		if (newProperties.selection == null && 'selection' in newProperties) {
			newProperties.selection = {};
		}
		return newProperties;
	}

	private setChangedGridProperites(): void {
		// Set only the properties that changed to minimize how much DOM dgrid rebuild.
		const properties: any = this.properties;
		const changeProperties: any = {};
		this.changedPropertyKeys.forEach((key) => {
			changeProperties[key] = properties[key];
		});
		this._grid && this._grid.set(this.filterProperties(changeProperties));
	}

	private registerGridEvents(): void {
		const properties = this.properties;
		const grid = this._grid;
		if (properties.features) {
			const { selection, columnHider, columnReorder, columnResizer, keyboard } = properties.features;
			if (selection) {
				grid.on('dgrid-select', (event: DgridSelectionEvent) => {
					const onSelect = properties.onSelect;
					onSelect && onSelect(buildSelectEvent(event), grid.selection);
				});
				grid.on('dgrid-deselect', (event: DgridSelectionEvent) => {
					const onDeselect = properties.onDeselect;
					onDeselect && onDeselect(buildSelectEvent(event), grid.selection);
				});
			}
			if (columnHider) {
				grid.on('dgrid-columnstatechange', (event: DgridColumnHiderEvent) => {
					const onColumnStateChange = properties.onColumnStateChange;
					onColumnStateChange && onColumnStateChange(buildColumnStateChange(event));
				});
			}
			if (columnReorder) {
				grid.on('dgrid-columnreorder', (event: DgridColumnReorderEvent) => {
					const onColumnReorder = properties.onColumnReorder;
					onColumnReorder && onColumnReorder(buildColumnReorder(event));
				});
			}
			if (columnResizer) {
				grid.on('dgrid-columnresize', (event: DgridColumnResizeEvent) => {
					const onColumnResize = properties.onColumnResize;
					onColumnResize && onColumnResize(buildColumnResize(event));
				});
			}
			if (keyboard) {
				grid.on('dgrid-cellfocusin', (event: DgridCellFocusEvent) => {
					const onCellFocusIn = properties.onCellFocusIn;
					onCellFocusIn && onCellFocusIn(buildCellFocus(event));
				});

				grid.on('dgrid-cellfocusout', (event: DgridCellFocusEvent) => {
					const onCellFocusOut = properties.onCellFocusOut;
					onCellFocusOut && onCellFocusOut(buildCellFocus(event));
				});
			}
		}
		const { onSort, onError } = properties;

		if (onSort) {
			grid.on('dgrid-sort', (event: DgridSortEvent) => {
				onSort(buildSort(event));
			});
		}

		if (onError) {
			grid.on('dgrid-error', (event: DgridErrorEvent) => {
				onError(buildError(event));
			});
		}
	}
}

const keyPrefix = 'dgridWrapper';

@diffProperty('columns', columnsDiff)
export class DgridWrapper extends WidgetBase<DgridWrapperProperties> {
	private key = 0;
	private _gridState: DgridState | undefined;

	protected render(): DNode {
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
			key: `${keyPrefix}${this.key}`,
			...this.properties,
			gridState: this._gridState,
			onGridState: (gridState: DgridState) => {
				this._gridState = gridState;
			}
		});
	}
}

export default DgridWrapper;
