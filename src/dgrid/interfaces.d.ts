interface Handle {
	remove(): void;
}

declare namespace dstore {
	export interface FetchArray<T> extends Array<T> {
		totalLength: number;
	}

	export interface FetchPromise<T> extends dojo.promise.Promise<T> {
		totalLength: dojo.promise.Promise<number>;
	}

	export interface ChangeEvent<T> {
		id: any;
		index?: number;
		previousIndex?: number;
		target: T;
		totalLength: number;
		type: string;
	}

	export interface Collection<T> {
		idProperty: string;
		Model: { new (...args: any[]): T };
		tracking?: Handle;

		add(object: T, options?: {}): dojo.promise.Promise<T>;
		emit(eventName: string, event: ChangeEvent<T>): boolean;
		fetch(): dstore.FetchPromise<T[]>;
		fetchRange(kwArgs: { start?: number; end?: number }): dstore.FetchPromise<T[]>;
		filter(query: string | {} | { (item: T, index: number): boolean }): this;
		forEach(callback: (item: T, index: number) => void, thisObject?: any): dojo.promise.Promise<T[]>;
		get(id: any): dojo.promise.Promise<T>;
		getIdentity(object: T): any;
		on(eventName: string, listener: (event: ChangeEvent<T>) => void): Handle;
		put(object: T, options?: {}): dojo.promise.Promise<T>;
		remove(id: any): dojo.promise.Promise<Object>;
		sort(property: string | { (a: T, b: T): number }, descending?: boolean): this;
		track?(): this;
	}

	export interface SyncCollection<T> extends Collection<T> {
		addSync(object: T, options?: {}): T;
		fetchSync(): dstore.FetchArray<T>;
		fetchRangeSync(kwArgs: { start?: number; end?: number }): dstore.FetchArray<T>;
		filter(query: string | {} | { (item: T, index: number): boolean }): this;
		getSync(id: any): T;
		putSync(object: T, options?: {}): T;
		removeSync(id: any): boolean;
		sort(property: string | { (a: T, b: T): number }, descending?: boolean): this;
		track?(): this;
	}
}

declare module 'dstore/Cache' {
	import Store = require('dstore/Store');

	interface Cache<T> extends Store<T> {
		cachingStore: dstore.Collection<T>;
		evict(id: any): void;
	}

	namespace Cache {
		export interface Constructor extends dojo._base.declare.__DeclareCreatedObject {
			new <T>(kwArgs?: Cache.KwArgs<T>): Cache<T>;
		}

		export interface KwArgs<T> extends Store.KwArgs {
			cachingStore?: dstore.Collection<T>;
		}
	}

	const Cache: Cache.Constructor;

	export = Cache;
}

declare module 'dstore/legacy/DstoreAdapter' {
	import Store = require('dstore/Store');

	interface DstoreAdapter<T> {
		constructor(collection: dstore.Collection<T>): DstoreAdapter<T>;
		get(id: any): any;
		put(object: T, options?: {}): any;
		remove(id: any): any;
		query(query: any, options?: {}): any;
	}

	namespace DstoreAdapter {
		export interface Constructor extends dojo._base.declare.__DeclareCreatedObject {
			new <T>(store: Store<T>): DstoreAdapter<Store<T>>;
		}
	}

	const DstoreAdapter: DstoreAdapter.Constructor;
	export = DstoreAdapter;
}

declare module 'dstore/Memory' {
	import Store = require('dstore/Store');

	interface Memory<T> extends Store<T>, dstore.SyncCollection<T> {
		data: T[];

		addSync(object: T, options?: {}): T;
		fetchSync(): dstore.FetchArray<T>;
		fetchRangeSync(kwArgs: { start?: number; end?: number }): dstore.FetchArray<T>;
		filter(query: string | {} | { (item: T, index: number): boolean }): this;
		getSync(id: any): T;
		putSync(object: T, options?: {}): T;
		removeSync(id: any): boolean;
		setData(data: T[]): void;
		sort(property: string | { (a: T, b: T): number }, descending?: boolean): this;
		track(): this;
		remove(id: any): dojo.promise.Promise<{}>;
	}

	namespace Memory {
		export interface Constructor extends dojo._base.declare.__DeclareCreatedObject {
			new <T>(kwArgs?: Memory.KwArgs<T>): Memory<T>;
		}

		export interface KwArgs<T> extends Store.KwArgs {
			data?: T[];
		}
	}

	const Memory: Memory.Constructor;

	export = Memory;
}

declare module 'dstore/Trackable' {
	interface Trackable<T> {
		currentRange: any[];
		track(): this;
	}

	namespace Trackable {
		export interface Constructor extends dojo._base.declare.__DeclareCreatedObject {
			new <T>(...args: any[]): Trackable<T>;
		}
	}

	const Trackable: Trackable.Constructor;

	export = Trackable;
}

declare module 'dstore/Tree' {
	interface Tree<T> {
		mayHaveChildren(object: T): boolean;
		getRootCollection(): dstore.Collection<T>;
		getChildren(object: T): dstore.Collection<T>;
	}

	namespace Tree {
		export interface Constructor extends dojo._base.declare.__DeclareCreatedObject {
			new <T>(...args: any[]): Tree<T>;
		}
	}

	const Tree: Tree.Constructor;

	export = Tree;
}

declare module 'dstore/Promised' {
	interface Promised<T> {
		get(id: any): dojo.promise.Promise<T>;
		put(object: T, options?: {}): dojo.promise.Promise<T>;
		add(object: T, options?: {}): dojo.promise.Promise<T>;
		remove(id: any): dojo.promise.Promise<boolean>;
		fetch(): dstore.FetchPromise<T>;
		fetchRange(args: { start?: number; end?: number }): dstore.FetchPromise<T>;
	}

	namespace Promised {
		export interface Constructor extends dojo._base.declare.__DeclareCreatedObject {
			new <T>(...args: any[]): Promised<T>;
		}
	}

	const Promised: Promised.Constructor;

	export = Promised;
}

declare module 'dstore/SimpleQuery' {
	interface SimpleQuery<T> {}

	namespace SimpleQuery {
		export interface Constructor extends dojo._base.declare.__DeclareCreatedObject {
			new <T>(...args: any[]): SimpleQuery<T>;
		}
	}

	const SimpleQuery: SimpleQuery.Constructor;

	export = SimpleQuery;
}

declare module 'dstore/Request' {
	import Store = require('dstore/Store');

	interface Request<T> extends Store<T> {
		headers: {};
		parse: (serializedObject: string) => {};
		target: string;
		ascendingPrefix: string;
		descendingPrefix: string;
		accepts: string;

		track(): this;
	}

	namespace Request {
		export interface Constructor extends dojo._base.declare.__DeclareCreatedObject {
			new <T>(kwArgs?: Request.KwArgs): Request<T>;
		}
		export interface KwArgs extends Store.KwArgs {
			headers?: typeof Request.prototype.headers;
			parse?: typeof Request.prototype.parse;
			target?: typeof Request.prototype.target;
			ascendingPrefix?: typeof Request.prototype.ascendingPrefix;
			descendingPrefix?: typeof Request.prototype.descendingPrefix;
			accepts?: typeof Request.prototype.accepts;
		}
	}

	const Request: Request.Constructor;

	export = Request;
}

declare module 'dstore/RequestMemory' {
	import Request = require('dstore/Request');
	import Cache = require('dstore/Cache');

	interface RequestMemory<T> extends Request<T>, Cache<T> {
		cachingStore: dstore.Collection<T>;
		evict(id: any): void;

		track(): this;
	}

	namespace RequestMemory {
		export interface Constructor extends dojo._base.declare.__DeclareCreatedObject {
			new <T>(kwArgs?: RequestMemory.KwArgs<T>): RequestMemory<T>;
		}

		export interface KwArgs<T> extends Request.KwArgs, Cache.KwArgs<T> {}
	}

	const RequestMemory: RequestMemory.Constructor;

	export = RequestMemory;
}

declare module 'dstore/Rest' {
	import Request = require('dstore/Request');

	interface Rest<T> extends Request<T> {}

	namespace Rest {
		export interface Constructor extends dojo._base.declare.__DeclareCreatedObject {
			new <T>(kwArgs?: Request.KwArgs): Rest<T>;
		}
	}

	const Rest: Rest.Constructor;

	export = Rest;
}

declare module 'dstore/Store' {
	interface Store<T> extends dstore.Collection<T> {
		idProperty: string;
		Model: { new (...args: any[]): T };
		total: dojo.promise.Promise<number>;

		add(object: T, options?: {}): dojo.promise.Promise<T>;
		emit(eventName: string, event: dstore.ChangeEvent<T>): boolean;
		fetch(): dstore.FetchPromise<T[]>;
		fetchRange(kwArgs: { start?: number; end?: number }): dstore.FetchPromise<T[]>;
		filter(query: string | {} | { (item: T, index: number): boolean }): this;
		forEach(callback: (item: T, index: number) => void, thisObject?: any): dojo.promise.Promise<T[]>;
		get(id: any): dojo.promise.Promise<T>;
		getIdentity(object: T): any;
		on(eventName: string, listener: (event: dstore.ChangeEvent<T>) => void): Handle;
		put(object: T, options?: {}): dojo.promise.Promise<T>;
		remove(id: any): dojo.promise.Promise<{}>;
		sort(property: string | { (a: T, b: T): number }, descending?: boolean): this;
	}

	namespace Store {
		export interface Constructor extends dojo._base.declare.__DeclareCreatedObject {
			new <T>(kwArgs?: Store.KwArgs): Store<T>;
		}

		export interface KwArgs {
			idProperty?: typeof Store.prototype.idProperty;
			Model?: typeof Store.prototype.Model;
		}
	}

	const Store: Store.Constructor;

	export = Store;
}

interface Dimensions {
	w?: number;
	h?: number;
}

declare namespace dgrid {
	export interface Constructor<T, U> extends dojo._base.declare.__DeclareCreatedObject {
		new (kwArgs?: U, srcNodeRef?: HTMLElement | string): T;

		createSubclass<T1, U1, T2, U2, T3, U3, T4, U4, X>(
			mixins: [Constructor<T1, U1>, Constructor<T2, U2>, Constructor<T3, U3>, Constructor<T4, U4>],
			props: X
		): Constructor<T & T1 & T2 & T3 & T4 & X, U & U1 & U2 & U3 & T4>;
		createSubclass<T1, U1, T2, U2, T3, U3, X>(
			mixins: [Constructor<T1, U1>, Constructor<T2, U2>, Constructor<T3, U3>],
			props: X
		): Constructor<T & T1 & T2 & T3 & X, U & U1 & U2 & U3>;
		createSubclass<T1, U1, T2, U2, X>(
			mixins: [Constructor<T1, U1>, Constructor<T2, U2>],
			props: X
		): Constructor<T & T1 & T2 & X, U & U1 & U2>;
		createSubclass<T1, U1, X>(mixins: [Constructor<T1, U1>], props: X): Constructor<T & T1 & X, U & U1>;
		createSubclass<T1, U1, X>(mixins: Constructor<T1, U1>, props: X): Constructor<T & T1 & X, U & U1>;
		createSubclass<T1, U1, T2, U2, T3, U3, T4, U4>(
			mixins: [Constructor<T1, U1>, Constructor<T2, U2>, Constructor<T3, U3>, Constructor<T4, U4>]
		): Constructor<T & T1 & T2 & T3 & T4, U & U1 & U2 & U3 & T4>;
		createSubclass<T1, U1, T2, U2, T3, U3>(
			mixins: [Constructor<T1, U1>, Constructor<T2, U2>, Constructor<T3, U3>]
		): Constructor<T & T1 & T2 & T3, U & U1 & U2 & U3>;
		createSubclass<T1, U1, T2, U2>(
			mixins: [Constructor<T1, U1>, Constructor<T2, U2>]
		): Constructor<T & T1 & T2, U & U1 & U2>;
		createSubclass<T1, U1>(mixins: [Constructor<T1, U1>]): Constructor<T & T1, U & U1>;
		createSubclass<T1, U1>(mixins: Constructor<T1, U1>): Constructor<T & T1, U & U1>;
		createSubclass<X>(mixins: any, props: X): Constructor<T & X, U>;
	}
}

declare module 'dgrid/CellSelection' {
	import Selection = require('dgrid/Selection');
	import Grid = require('dgrid/Grid');

	interface CellSelection extends Selection {
		isSelected(target: Grid.CellArg, columnId?: string): boolean;
		clearSelection(): void;
	}

	interface CellSelectionConstructor extends dgrid.Constructor<CellSelection, Selection.KwArgs> {}

	const CellSelection: CellSelectionConstructor;

	export = CellSelection;
}

declare module 'dgrid/ColumnSet' {
	import Grid = require('dgrid/Grid');

	interface ColumnSet {
		styleColumnSet(columnsetId: string, css: string): Handle;
	}

	namespace ColumnSet {
		export interface KwArgs extends Grid.KwArgs {
			columnSets?: Array<Array<Grid.Column[]>>;
		}
	}

	interface ColumnSetConstructor extends dgrid.Constructor<ColumnSet, ColumnSet.KwArgs> {}

	const ColumnSet: ColumnSetConstructor;

	export = ColumnSet;
}

declare module 'dgrid/Editor' {
	import Grid = require('dgrid/Grid');
	import OnDemandGrid = require('dgrid/OnDemandGrid');

	interface Editor {
		edit(cell: Grid.Cell<any> | HTMLElement | Event): void;
	}

	namespace Editor {
		export interface Column extends Grid.Column {
			autoSave?: boolean;
			autoSelect?: boolean;
			dismissOnEnter?: boolean;
			editor?: string | dojo._base.declare.__DeclareCreatedObject;
			editOn?: string;
			editorArgs?: Object;

			canEdit?(object: any, value: any): boolean;
		}
		export type ColumnSpec = { [key: string]: Column | string } | Column[];
		export interface KwArgs extends OnDemandGrid.KwArgs {
			columns?: ColumnSpec;
			subRows?: Array<Column[]>;
		}
	}

	interface EditorConstructor extends dgrid.Constructor<Editor, Editor.KwArgs> {}

	const Editor: EditorConstructor;

	export = Editor;
}

declare module 'dgrid/Grid' {
	import List = require('dgrid/List');

	interface Grid extends List {
		columns: { [key: string]: Grid.Column };
		hasNeutralSort: boolean;
		cellNavigation: boolean;
		formatterScope: any;
		_currentPage: number;

		column(target: any): Grid.Column;
		cell(target: Grid.CellArg, columnId?: string): Grid.Cell<any>;
		left(target: Grid.Cell<any> | Grid.CellArg, steps?: number): Grid.Cell<any>;
		right(target: Grid.Cell<any> | Grid.CellArg, steps?: number): Grid.Cell<any>;
		styleColumn(columnId: string, css: string): Handle;
		updateSortArrow(sort: any, updateSort?: boolean): void;
	}

	namespace Grid {
		export type CellArg = List.RowArg;
		export interface Cell<T> {
			row: List.Row<T>;
			column: Column;
			element: HTMLElement;
		}
		export interface Column {
			field?: string;
			id?: string | number;
			label?: string;
			className?: string;
			colSpan?: number;
			rowSpan?: number;
			sortable?: boolean;
			formatter?: string | Formatter;

			get?(item: any): any;
			set?(item: any): any;
			renderCell?(object: any, value: any, node: HTMLElement): HTMLElement | void;
			renderHeaderCell?(node: HTMLElement): HTMLElement | void;
		}
		export type ColumnSpec = { [key: string]: Column | string } | Column[];
		export type Formatter = (value: any, object: any) => string;
		export interface KwArgs extends List.KwArgs {
			columns?: ColumnSpec;
			subRows?: Array<Column[]>;
			formatterScope?: any;
			hasNeutralSort?: boolean;
			cellNavigation?: boolean;
		}
	}

	interface GridConstructor extends dgrid.Constructor<Grid, Grid.KwArgs> {
		appendIfNode(parent: HTMLElement, subNode?: any): void;
	}

	const Grid: GridConstructor;

	export = Grid;
}

declare module 'dgrid/GridFromHtml' {
	import Grid = require('dgrid/Grid');

	interface GridFromHtml extends Grid {}

	interface GridFromHtmlConstructor extends dgrid.Constructor<GridFromHtml, Grid.KwArgs> {
		utils: {
			getBoolFromAttr(node: Node, attr: string): boolean;
			getNumFromAttr(node: Node, attr: string): number;
			getPropsFromNode(node: Node): any;
			getColumnFromCell(node: Node): Grid.Column;
		};
	}

	const GridFromHtml: GridFromHtmlConstructor;

	export = GridFromHtml;
}

declare module 'dgrid/GridWithColumnSetsFromHtml' {
	import Grid = require('dgrid/Grid');
	import GridFromHtml = require('dgrid/GridFromHtml');
	import ColumnSet = require('dgrid/ColumnSet');

	interface GridWithColumnSetsFromHtml extends GridFromHtml, ColumnSet {}

	namespace GridWithColumnSetsFromHtml {
		export interface KwArgs extends Grid.KwArgs, ColumnSet.KwArgs {}
	}

	interface GridWithColumnSetsFromHtmlConstructor
		extends dgrid.Constructor<GridWithColumnSetsFromHtml, GridWithColumnSetsFromHtml.KwArgs> {}

	const GridWithColumnSetsFromHtml: GridWithColumnSetsFromHtmlConstructor;

	export = GridWithColumnSetsFromHtml;
}

declare module 'dgrid/Keyboard' {
	interface Keyboard {
		cellNavigation: boolean;
		pageSkip: number;
		keyMap: Keyboard.KeyMap;
		headerKeyMap: Keyboard.KeyMap;

		addKeyHandler(key: number, callback: Function, isHeader?: boolean): Handle;
		focus(target: any): void;
		focusHeader(target: any): void;
	}

	namespace Keyboard {
		export interface KeyMap {
			[key: number]: Function;
		}

		export interface KwArgs {
			cellNavigation?: boolean;
			pageSkip?: number;
			keyMap?: KeyMap;
			headerKeyMap?: KeyMap;
		}
	}

	interface KeyboardConstructor extends dgrid.Constructor<Keyboard, Keyboard.KwArgs> {
		defaultHeaderKeyMap: Keyboard.KeyMap;
		defaultKeyMap: Keyboard.KeyMap;

		moveFocusVertical: (event: KeyboardEvent, steps: number) => void;
	}

	const Keyboard: KeyboardConstructor;

	export = Keyboard;
}

declare module 'dgrid/List' {
	interface List {
		readonly domNode: HTMLElement;

		tabableHeader: boolean;
		showHeader: boolean;
		showFooter: boolean;
		maintainOddEven: boolean;
		cleanAddedRules: boolean;
		addUiClasses: boolean;
		highlightDuration: number;
		resizeThrottleDelay: number;
		resizeThrottleMethod: List.ThrottleMethod;
		sort: any;

		create(params: any, srcNodeRef?: HTMLElement): void;
		buildRendering(): void;
		postCreate(): void;

		get(key: string): any;

		set(key: string, value: any): this;
		set(kwArgs: any): this;

		addCssRule(selector: string, css: string): Handle;
		adjustRowIndices(firstRow: HTMLElement): void;
		cleanup(): void;
		configStructure(): void;
		destroy(): void;
		down(row: List.Row<any> | List.RowArg, steps?: number): List.Row<any>;
		getScrollPosition(): { x: number; y: number };
		highlightRow(rowElement: HTMLElement | List.Row<any>, delay?: number): void;
		insertRow(object: any, parent: HTMLElement, beforeNode: Node, i: number, options?: any): HTMLElement;

		on(eventType: string, listener: Function): Handle;

		_onNotification(rows?: any[], object?: any, from?: number, to?: number): void;
		refresh(): void;
		removeRow(rowElement: any, preserveDom?: boolean): void;
		renderArray(results: any[], beforeNode?: Node, options?: any): HTMLElement;
		renderHeader(): void;
		renderRow(value: any, options?: Object): HTMLElement;

		row(target: List.RowArg): List.Row<any>;
		resize(): void;
		scrollTo(options: { x?: number; y?: number }): void;
		startup(): void;
		up(row: List.Row<any> | List.RowArg, steps?: number): List.Row<any>;
	}

	namespace List {
		export type RowArg = Event | HTMLElement | Object | string | number;
		export interface Row<T> {
			id: string;
			data: T;
			element: HTMLElement;

			remove(): void;
		}

		export interface KwArgs {
			tabableHeader?: boolean;
			showHeader?: boolean;
			showFooter?: boolean;
			maintainOddEven?: boolean;
			cleanAddedRules?: boolean;
			addUiClasses?: boolean;
			highlightDuration?: number;
			resizeThrottleDelay?: number;
			resizeThrottleMethod?: ThrottleMethod;
			sort?: any;
		}

		export type ThrottleFunction = (callback: Function, delay: number) => Function;
		export type ThrottleMethod = 'debounce' | 'throttle' | 'throttleDelayed' | ThrottleFunction;
	}

	interface ListConstructor extends dgrid.Constructor<List, List.KwArgs> {}

	const List: ListConstructor;

	export = List;
}

declare module 'dgrid/OnDemandGrid' {
	import Grid = require('dgrid/Grid');
	import OnDemandList = require('dgrid/OnDemandList');

	interface OnDemandGrid extends Grid, OnDemandList {
		refresh(options?: any): dojo.promise.Promise<any[]>;
	}

	namespace OnDemandGrid {
		export interface KwArgs extends Grid.KwArgs, OnDemandList.KwArgs {}
	}

	interface OnDemandGridConstructor extends dgrid.Constructor<OnDemandGrid, OnDemandGrid.KwArgs> {}

	const OnDemandGrid: OnDemandGridConstructor;
	export = OnDemandGrid;
}

declare module 'dgrid/OnDemandList' {
	import List = require('dgrid/List');
	import StoreMixin = require('dgrid/_StoreMixin');

	interface OnDemandList extends List, StoreMixin {
		refresh(options?: any): dojo.promise.Promise<any[]>;
	}

	namespace OnDemandList {
		export interface KwArgs extends List.KwArgs, StoreMixin.KwArgs {
			minRowsPerPage?: number;
			maxRowsPerPage?: number;
			maxEmptySpace?: number;
			bufferRows?: number;
			farOffRemoval?: number;
			queryRowsOverlap?: number;
			pagingMethod?: string;
			pagingDelay?: number;
			keepScrollPosition?: boolean;
			rowHeight?: number;
		}
	}

	interface OnDemandListConstructor extends dgrid.Constructor<OnDemandList, OnDemandList.KwArgs> {}

	const OnDemandList: OnDemandListConstructor;

	export = OnDemandList;
}

declare module 'dgrid/Selection' {
	import List = require('dgrid/List');

	interface Selection {
		selectionMode: Selection.Mode;
		selection: { [key: string]: boolean };

		select(row: List.Row<any> | List.RowArg, toRow?: List.Row<any> | List.RowArg, value?: boolean): void;
		deselect(row: List.Row<any> | List.RowArg, toRow?: List.Row<any> | List.RowArg): void;
		clearSelection(exceptId?: any, dontResetLastSelected?: boolean): void;
		selectAll(): void;
		isSelected(row: List.Row<any> | List.RowArg): boolean;
	}

	namespace Selection {
		export type Mode = 'none' | 'multiple' | 'single' | 'extended';
		export interface KwArgs {
			selectionDelegate?: string;
			selectionEvents?: string;
			selectionTouchEvents?: string;
			deselectOnRefresh?: boolean;
			allowSelectAll?: boolean;
			selectionMode?: Mode;
			allowTextSelection?: boolean;
		}
	}

	interface SelectionConstructor extends dgrid.Constructor<Selection, Selection.KwArgs> {}

	const Selection: SelectionConstructor;

	export = Selection;
}

declare module 'dgrid/Selector' {
	import Selection = require('dgrid/Selection');

	export = Selection;
}

declare module 'dgrid/_StoreMixin' {
	interface StoreMixin {
		get(key: string): any;

		revert(): void;
		save(): dojo.promise.Promise<{ [key: string]: any }>;
		updateDirty(id: string, field: string, value: any): void;
	}

	namespace StoreMixin {
		export interface KwArgs {
			collection?: dstore.Collection<any>;
			shouldTrackCollection?: boolean;
			getBeforePut?: boolean;
			noDataMessage?: string;
			loadingMessage?: string;
		}
	}

	interface StoreMixinConstructor extends dgrid.Constructor<StoreMixin, StoreMixin.KwArgs> {}

	const StoreMixin: StoreMixinConstructor;

	export = StoreMixin;
}

declare module 'dgrid/Tree' {
	import List = require('dgrid/List');
	import Grid = require('dgrid/Grid');

	interface Tree {
		expand(target: List.Row<any> | List.RowArg, expand?: boolean): dojo.promise.Promise<any>;
		shouldExpand(row: List.Row<any>, level: number, previouslyExpanded: boolean): boolean;
	}

	namespace Tree {
		export interface Column extends Grid.Column {
			expandOn?: string;
			renderExpando?: boolean | RenderExpando;
		}
		export type ColumnSpec = { [key: string]: Column | string } | Column[];
		export interface KwArgs extends Grid.KwArgs {
			columns?: ColumnSpec;
			subRows?: Array<Column[]>;
			collapseOnRefresh?: boolean;
			enableTreeTransitions?: boolean;
			treeIndentWidth?: number;
		}
		export type RenderExpando = (
			level: number,
			mayHaveChildren: boolean,
			expanded: boolean,
			item: any
		) => HTMLElement;
	}

	interface TreeConstructor extends dgrid.Constructor<Tree, Tree.KwArgs> {}

	const Tree: TreeConstructor;

	export = Tree;
}

declare module 'dgrid/extensions/ColumnHider' {
	import List = require('dgrid/List');
	import Grid = require('dgrid/Grid');

	interface ColumnHider {
		columns: { [key: string]: ColumnHider.Column };

		column(target: any): ColumnHider.Column;
		cell(target: Grid.CellArg, columnId?: string): ColumnHider.Cell<any>;
		left(target: ColumnHider.Cell<any> | Grid.CellArg, steps?: number): ColumnHider.Cell<any>;
		right(target: ColumnHider.Cell<any> | Grid.CellArg, steps?: number): ColumnHider.Cell<any>;

		toggleColumnHiddenState(id: string, hidden?: boolean): void;
	}

	namespace ColumnHider {
		export interface Cell<T> {
			row: List.Row<T>;
			column: Column;
			element: HTMLElement;
		}
		export interface Column extends Grid.Column {
			hidden?: boolean;
			unhidable?: boolean;
		}
		export type ColumnSpec = { [key: string]: Column | string } | Column[];
		export interface KwArgs extends Grid.KwArgs {
			columns?: ColumnSpec;
		}
	}

	interface ColumnHiderConstructor extends dgrid.Constructor<ColumnHider, ColumnHider.KwArgs> {}

	const ColumnHider: ColumnHiderConstructor;

	export = ColumnHider;
}

declare module 'dgrid/extensions/ColumnReorder' {
	import List = require('dgrid/List');
	import Grid = require('dgrid/Grid');

	interface ColumnReorder {
		columnDndConstructor: Function;
	}

	namespace ColumnReorder {
		export interface ColumnDndSource extends dojo.dnd.Source {}
		export interface ColumnDndSourceConstructor extends dojo._base.declare.__DeclareCreatedObject {}

		export interface Cell<T> {
			row: List.Row<T>;
			column: Column;
			element: HTMLElement;
		}
		export interface Column extends Grid.Column {
			reorderable?: boolean;
		}
		export type ColumnSpec = { [key: string]: Column | string } | Column[];
		export interface KwArgs extends Grid.KwArgs {
			columnDndConstructor?: Function;
			columns?: ColumnSpec;
			subRows?: Array<Column[]>;
		}
	}

	interface ColumnReorderConstructor extends dgrid.Constructor<ColumnReorder, ColumnReorder.KwArgs> {
		ColumnDndSource: ColumnReorder.ColumnDndSourceConstructor;
	}

	const ColumnReorder: ColumnReorderConstructor;

	export = ColumnReorder;
}

declare module 'dgrid/extensions/ColumnResizer' {
	import List = require('dgrid/List');
	import Grid = require('dgrid/Grid');

	interface ColumnResizer {
		adjustLastColumn: boolean;
		minWidth: number;

		resizeColumnWidth(columnId: string, width: number): void;
	}

	namespace ColumnResizer {
		export interface Cell<T> {
			row: List.Row<T>;
			column: Column;
			element: HTMLElement;
		}
		export interface Column extends Grid.Column {
			resizable?: boolean;
			width?: number;
		}
		export type ColumnSpec = { [key: string]: Column | string } | Column[];
		export interface KwArgs extends Grid.KwArgs {
			adjustLastColumn?: boolean;
			minWidth?: number;
			columns?: ColumnSpec;
			subRows?: Array<Column[]>;
		}
	}
	interface ColumnResizerConstructor extends dgrid.Constructor<ColumnResizer, ColumnResizer.KwArgs> {}

	const ColumnResizer: ColumnResizerConstructor;

	export = ColumnResizer;
}

declare module 'dgrid/extensions/CompoundColumns' {
	import List = require('dgrid/List');
	import Grid = require('dgrid/Grid');

	interface CompoundColumns {
		adjustLastColumn: boolean;
		minWidth: number;

		resizeColumnWidth(columnId: string, width: number): void;
	}

	namespace CompoundColumns {
		export interface Cell<T> {
			row: List.Row<T>;
			column: Column;
			element: HTMLElement;
		}
		export interface Column extends Grid.Column {
			children?: Column[];
			showChildHeaders?: boolean;
		}
		export type ColumnSpec = { [key: string]: Column | string } | Column[];
		export interface KwArgs extends Grid.KwArgs {
			adjustLastColumn?: boolean;
			minWidth?: number;
			columns?: ColumnSpec;
			subRows?: Array<Column[]>;
		}
	}

	interface CompoundColumnsConstructor extends dgrid.Constructor<CompoundColumns, CompoundColumns.KwArgs> {}

	const CompoundColumns: CompoundColumnsConstructor;

	export = CompoundColumns;
}

declare module 'dgrid/extensions/DijitRegistry' {
	interface DijitRegistry {
		minSize: number;
		maxSize: number;
		layoutPriority: number;
		showTitle: boolean;

		buildRendering(): void;
		destroyRecursive(): void;
		getChildren(): any[];
		getParent(): any;
		isLeftToRight(): boolean;
		placeAt(reference: any, position?: string | number): any;
		resize(dim?: Dimensions): void;
		watch(...args: any[]): void;
	}

	namespace DijitRegistry {
		export interface KwArgs {
			minSize?: number;
			maxSize?: number;
			layoutPriority?: number;
			showTitle?: boolean;
		}
	}

	interface DijitRegistryConstructor extends dgrid.Constructor<DijitRegistry, DijitRegistry.KwArgs> {}

	const DijitRegistry: DijitRegistryConstructor;

	export = DijitRegistry;
}

declare module 'dgrid/extensions/DnD' {
	import List = require('dgrid/List');

	interface Dnd {
		dndSourceType: string;
		dndParams: any;
		dndConstructor: Function;
	}

	namespace Dnd {
		export interface GridSource extends dojo.dnd.Source {
			grid: List;
		}
		export interface GridSourceConstructor extends dojo._base.declare.__DeclareCreatedObject {}

		export interface KwArgs {
			dndSourceType?: string;
			dndParams?: any;
			dndConstructor?: Function;
		}
	}

	interface DndConstructor extends dgrid.Constructor<Dnd, Dnd.KwArgs> {
		GridSource: Dnd.GridSource;
	}

	const Dnd: DndConstructor;

	export = Dnd;
}

declare module 'dgrid/extensions/Pagination' {
	import StoreMixin = require('dgrid/_StoreMixin');

	interface Pagination extends StoreMixin {
		rowsPerPage: number;
		pagingTextBox: boolean;
		previousNextArrows: boolean;
		firstLastArrows: boolean;
		pagingLinks: number;
		pageSizeOptions: number[];
		showLoadingMessage: boolean;
		i18nPagination: any;

		gotoPage(page: number): dojo.promise.Promise<any>;
	}

	namespace Pagination {
		export interface KwArgs extends StoreMixin.KwArgs {
			rowsPerPage?: number;
			pagingTextBox?: boolean;
			previousNextArrows?: boolean;
			firstLastArrows?: boolean;
			pagingLinks?: number;
			pageSizeOptions?: number[];
			showLoadingMessage?: boolean;
			i18nPagination?: any;
		}
	}

	interface PaginationConstructor extends dgrid.Constructor<Pagination, Pagination.KwArgs> {}

	const Pagination: PaginationConstructor;

	export = Pagination;
}

declare module 'dgrid/extensions/SingleQuery' {
	import StoreMixin = require('dgrid/_StoreMixin');
	export = StoreMixin;
}

declare module 'dgrid/util/has-css3' {
	import dojoHas = require('dojo/has');
	export = dojoHas;
}

declare module 'dgrid/util/misc' {
	namespace util {
		export let defaultDelay: number;
		export function throttle<T extends Function>(callback: T, context?: any, delay?: number): T;
		export function throttleDelayed<T extends Function>(callback: T, context?: any, delay?: number): T;
		export function debounce<T extends Function>(callback: T, context?: any, delay?: number): T;
		export function each<T, U>(
			arrayOrObject: T[],
			callback: (this: U, item: T, index: number, arrayOrObject: T[]) => void,
			context: U
		): void;
		export function each<T>(
			arrayOrObject: T[],
			callback: (item: T, index: number, arrayOrObject: T[]) => void
		): void;
		export function each<T>(
			arrayOrObject: {},
			callback: (this: T, item: any, index: number, arrayOrObject: {}) => void,
			context: T
		): void;
		export function each(arrayOrObject: {}, callback: (item: any, index: number, arrayOrObject: {}) => void): void;

		export interface CssRuleHandle extends Handle {
			get(prop: string): string;
			set(prop: string, value: string): void;
		}

		export function addCssRule(selector: string, css: string): CssRuleHandle;
		export function escapeCssIdentifier(id: string, replace?: string): void;
	}

	export = util;
}

declare module 'dgrid/util/touch' {
	namespace touch {
		export let tapRadius: number;
		export let dbltapTime: number;

		export function selector(selector: any, eventType: any, children: any): Function;
		export function countCurrentTouches(event: Event, node: Element): number;

		export function tap(target: Element, listener: any): Handle;
		export function dbltap(target: Element, listener: any): Handle;
	}

	export = touch;
}
