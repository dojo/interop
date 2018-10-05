import renderer from '@dojo/framework/widget-core/vdom';
import harness from '@dojo/framework/testing/harness';
import DgridWrapper, {
	DgridInnerWrapper,
	DgridWrapperProperties,
	SelectionData,
	SelectionMode,
	SelectionType
} from '../../../src/dgrid/DgridWrapper';

import { w } from '@dojo/framework/widget-core/d';

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

let renderProperties: DgridWrapperProperties;
function testProperties(): DgridWrapperProperties {
	return {
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
}

function render(mountPoint?: Node) {
	const r = renderer(() => {
		console.log(`Rendering: Properties: ${JSON.stringify(renderProperties)}`);
		return w(DgridWrapper, { ...renderProperties });
	});
	r.mount({
		sync: true,
		domNode: mountPoint as HTMLElement
	});
	return r;
}

registerSuite('dgrid/Dgrid VDOM', {
	'basic vdom render'() {
		const h = harness(() =>
			w(DgridWrapper, {
				data: [],
				columns: {
					first: 'First',
					last: 'Last'
				},
				features: {
					pagination: true
				}
			})
		);
		h.expect(() =>
			w(DgridInnerWrapper, {
				data: [],
				key: 'dgridWrapper0',
				columns: {
					first: 'First',
					last: 'Last'
				},
				gridState: undefined,
				onGridState: () => {},
				features: {
					pagination: true
				}
			} as any)
		);
	},

	'property update - no key change expected'() {
		renderProperties = {
			data: [],
			columns: {
				first: 'First',
				last: 'Last'
			},
			features: {
				pagination: true
			}
		};
		const h = harness(() => w(DgridWrapper, renderProperties));
		h.expect(() =>
			w(DgridInnerWrapper, {
				data: [],
				key: 'dgridWrapper0',
				columns: {
					first: 'First',
					last: 'Last'
				},
				gridState: undefined,
				onGridState: () => {},
				features: {
					pagination: true
				}
			} as any)
		);
		renderProperties.columns = {
			id: 'ID',
			first: 'First',
			last: 'Last'
		};
		h.expect(() =>
			w(DgridInnerWrapper, {
				data: [],
				key: 'dgridWrapper0',
				columns: {
					id: 'ID',
					first: 'First',
					last: 'Last'
				},
				gridState: undefined,
				onGridState: () => {},
				features: {
					pagination: true
				}
			} as any)
		);
		renderProperties.data = [
			{
				id: 1,
				first: 'first',
				last: 'last'
			}
		];
		h.expect(() =>
			w(DgridInnerWrapper, {
				data: [
					{
						id: 1,
						first: 'first',
						last: 'last'
					}
				],
				key: 'dgridWrapper0',
				columns: {
					id: 'ID',
					first: 'First',
					last: 'Last'
				},
				gridState: undefined,
				onGridState: () => {},
				features: {
					pagination: true
				}
			} as any)
		);
		renderProperties.columns = [{ field: 'first', label: 'FIRST' }, { field: 'last', label: 'LAST' }];
		h.expect(() =>
			w(DgridInnerWrapper, {
				data: [
					{
						id: 1,
						first: 'first',
						last: 'last'
					}
				],
				key: 'dgridWrapper0',
				columns: [{ field: 'first', label: 'FIRST' }, { field: 'last', label: 'LAST' }],
				gridState: undefined,
				onGridState: () => {},
				features: {
					pagination: true
				}
			} as any)
		);
		renderProperties.columns = [{ field: 'first', label: 'fIrSt' }, { field: 'last', label: 'LAST' }];
		h.expect(() =>
			w(DgridInnerWrapper, {
				data: [
					{
						id: 1,
						first: 'first',
						last: 'last'
					}
				],
				key: 'dgridWrapper0',
				columns: [{ field: 'first', label: 'fIrSt' }, { field: 'last', label: 'LAST' }],
				gridState: undefined,
				onGridState: () => {},
				features: {
					pagination: true
				}
			} as any)
		);
	},

	'property update - key change expected'() {
		renderProperties = {
			data: [],
			columns: {
				first: 'First',
				last: 'Last'
			},
			features: {
				pagination: true
			}
		};
		const h = harness(() => w(DgridWrapper, renderProperties));
		h.expect(() =>
			w(DgridInnerWrapper, {
				data: [],
				key: 'dgridWrapper0',
				columns: {
					first: 'First',
					last: 'Last'
				},
				gridState: undefined,
				onGridState: () => {},
				features: {
					pagination: true
				}
			} as any)
		);
		renderProperties.features = {
			pagination: false
		};
		h.expect(() =>
			w(DgridInnerWrapper, {
				data: [],
				key: 'dgridWrapper1',
				columns: {
					first: 'First',
					last: 'Last'
				},
				gridState: undefined,
				onGridState: () => {},
				features: {
					pagination: false
				}
			} as any)
		);
		renderProperties.previousNextArrows = false;
		h.expect(() =>
			w(DgridInnerWrapper, {
				data: [],
				key: 'dgridWrapper2',
				columns: {
					first: 'First',
					last: 'Last'
				},
				gridState: undefined,
				onGridState: () => {},
				features: {
					pagination: false
				},
				previousNextArrows: false
			} as any)
		);
	}
});

let sandbox: HTMLElement;

registerSuite('dgrid/Dgrid DOM', {
	'basic DOM render'() {
		renderProperties = testProperties();
		const root = document.createDocumentFragment();

		renderProperties.features!.pagination = true;
		render(root);

		// Check to see if a dgrid grid rendered with pagination.
		const gridNode = root.firstChild! as HTMLElement;
		assert.exists(gridNode);

		const cells = gridNode.querySelectorAll('.dgrid-cell');
		assert.strictEqual(cells.length, 6);

		['First', 'Last', 'first 1', 'last 1'].forEach((text, i) => {
			assert.strictEqual(cells[i].textContent, text);
		});

		const paginationNode = gridNode.querySelector('.dgrid-pagination');
		assert.exists(paginationNode);
	},

	'basic DOM render - no columns'() {
		renderProperties = testProperties();
		const root = document.createDocumentFragment();

		renderProperties.features!.pagination = true;
		renderProperties.columns = [];
		render(root);

		// Check to see if a dgrid grid rendered with pagination.
		const gridNode = root.firstChild! as HTMLElement;
		assert.exists(gridNode);

		const cells = gridNode.querySelectorAll('.dgrid-cell');
		assert.strictEqual(cells.length, 0);

		const paginationNode = gridNode.querySelector('.dgrid-pagination');
		assert.exists(paginationNode);
	},

	'basic DOM render - null columns'() {
		renderProperties = testProperties();
		const root = document.createDocumentFragment();

		renderProperties.features!.pagination = true;
		renderProperties.columns = undefined;
		render(root);

		// Check to see if a dgrid grid rendered with pagination.
		const gridNode = root.firstChild! as HTMLElement;
		assert.exists(gridNode);

		const cells = gridNode.querySelectorAll('.dgrid-cell');
		assert.strictEqual(cells.length, 0);

		const paginationNode = gridNode.querySelector('.dgrid-pagination');
		assert.exists(paginationNode);
	},

	'recreate grid on property change'() {
		renderProperties = testProperties();
		let root = document.createDocumentFragment();

		renderProperties.features!.pagination = true;
		render(root);

		// Check to see if a dgrid grid rendered with pagination.
		let gridNode = root.firstChild! as HTMLElement;
		assert.exists(gridNode);
		const gridId = gridNode.id;

		let paginationNode = gridNode.querySelector('.dgrid-pagination');
		assert.exists(paginationNode);

		delete renderProperties.features;
		root = document.createDocumentFragment();
		render(root);

		gridNode = root.firstChild! as HTMLElement;
		assert.notStrictEqual(gridNode.id, gridId);
		const cells = gridNode.querySelectorAll('.dgrid-cell');
		assert.strictEqual(cells.length, 6);

		['First', 'Last', 'first 1', 'last 1'].forEach((text, i) => {
			assert.strictEqual(cells[i].textContent, text);
		});

		paginationNode = gridNode.querySelector('.dgrid-pagination');
		assert.isNull(paginationNode);
	},

	'update grid on property change'() {
		console.log('Update grid');
		renderProperties = testProperties();
		let root = document.createDocumentFragment();

		renderProperties.features!.pagination = true;
		renderProperties.columns = [{ field: 'first', label: 'First' }, { field: 'last', label: 'Last' }];
		console.log('First render');
		const rendered = render(root);

		// Check to see if a dgrid grid rendered with pagination.
		let gridNode = root.firstChild! as HTMLElement;
		assert.exists(gridNode);
		const gridId = gridNode.id;

		let cells = gridNode.querySelectorAll('.dgrid-cell');
		assert.strictEqual(cells.length, 6);

		['First', 'Last', 'first 1', 'last 1'].forEach((text, i) => {
			assert.strictEqual(cells[i].textContent, text);
		});

		renderProperties.columns = [
			{ field: 'id', label: 'ID' },
			{ field: 'first', label: 'First' },
			{ field: 'last', label: 'Last' }
		];
		console.log('Invalidated');
		rendered.mount({
			sync: true,
			domNode: root as any
		});

		gridNode = root.firstChild! as HTMLElement;
		assert.strictEqual(gridNode.id, gridId);
		cells = gridNode.querySelectorAll('.dgrid-cell');
		assert.strictEqual(cells.length, 9);

		['ID', 'First', 'Last', '1', 'first 1', 'last 1', '2', 'first 2', 'last 2'].forEach((text, i) => {
			assert.strictEqual(cells[i].textContent, text);
		});
	},

	'DOM interactions': {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);
		},

		afterEach() {
			document.body.removeChild(sandbox);
		},

		tests: {
			'restore page 1'() {
				let refreshCount = 0;
				let gridId: string;
				return new Promise((resolve) => {
					sandbox.addEventListener('dgrid-refresh-complete', () => {
						refreshCount++;
						switch (refreshCount) {
							case 1: {
								// Give the grid time to call gotoPage().
								setTimeout(() => {
									let statusNode = document.getElementsByClassName('dgrid-status')[0];
									// Are we on page 2?
									assert.strictEqual(statusNode.textContent, '1 - 5 of 99 results');

									renderProperties.previousNextArrows = false;
									rendered.invalidate();
								}, 100);
								break;
							}
							case 2: {
								// Give the grid time to call gotoPage().
								setTimeout(() => {
									assert.notEqual(document.getElementsByClassName('dgrid')[0].id, gridId);
									let statusNode = document.getElementsByClassName('dgrid-status')[0];
									// Are we on page 2 again?
									assert.strictEqual(statusNode.textContent, '1 - 5 of 99 results');
									resolve();
								}, 100);
							}
						}
					});
					renderProperties = testProperties();
					renderProperties.features!.pagination = true;

					for (let i = 3; i < 100; i++) {
						renderProperties.data.push({
							id: i,
							first: 'First' + i,
							last: 'Last' + i
						});
					}
					renderProperties.rowsPerPage = 5;
					const rendered = render(sandbox);
				});
			},

			'restore page 2'() {
				let refreshCount = 0;
				let gridId: string;
				return new Promise((resolve) => {
					sandbox.addEventListener('dgrid-refresh-complete', () => {
						refreshCount++;
						switch (refreshCount) {
							case 1: {
								gridId = document.getElementsByClassName('dgrid')[0].id;
								const found = document.getElementsByClassName('dgrid-next');
								if (found && found.length) {
									(found[0] as HTMLElement).click();
									// Give the grid time to call gotoPage().
									setTimeout(() => {
										let statusNode = document.getElementsByClassName('dgrid-status')[0];
										// Are we on page 2?
										assert.strictEqual(statusNode.textContent, '6 - 10 of 99 results');

										renderProperties.previousNextArrows = false;
										rendered.invalidate();
									}, 100);
								} else {
									assert.fail('Could not advance grid page.');
								}
								break;
							}
							case 2: {
								// Give the grid time to call gotoPage().
								setTimeout(() => {
									assert.notEqual(document.getElementsByClassName('dgrid')[0].id, gridId);
									let statusNode = document.getElementsByClassName('dgrid-status')[0];
									// Are we on page 2 again?
									assert.strictEqual(statusNode.textContent, '6 - 10 of 99 results');
									resolve();
								}, 100);
							}
						}
					});

					renderProperties = testProperties();
					renderProperties.features!.pagination = true;
					for (let i = 3; i < 100; i++) {
						renderProperties.data.push({
							id: i,
							first: 'First' + i,
							last: 'Last' + i
						});
					}
					renderProperties.rowsPerPage = 5;
					const rendered = render(sandbox);
				});
			}
		}
	},

	'keyboard tab index'() {
		renderProperties = testProperties();
		const root = document.createDocumentFragment();

		renderProperties.features!.keyboard = true;
		renderProperties.tabIndex = 5;
		render(root);

		// Check to see if a dgrid grid rendered with pagination.
		const gridNode = root.firstChild! as HTMLElement;
		assert.exists(gridNode);

		const cells = gridNode.querySelectorAll('th.dgrid-cell');
		assert.exists(cells);
		assert.strictEqual('5', cells[0].getAttribute('tabindex'));
	},

	selection: {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			renderProperties = testProperties();
			renderProperties.features!.selection = SelectionType.row;
		},
		afterEach() {
			document.body.removeChild(sandbox);
		},
		tests: {
			'basic selection render'() {
				return new Promise((resolve) => {
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						(event as any).grid.select(1);
						(event as any).grid.deselect(1);
						resolve();
					});
					renderProperties.selectionMode = SelectionMode.multiple;
					render(sandbox);
				});
			},
			'basic selection render with null selection'() {
				return new Promise((resolve) => {
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						assert.strictEqual(Object.keys((event as any).grid.selection).length, 0);
						resolve();
					});
					renderProperties.selectionMode = SelectionMode.multiple;
					renderProperties.selection = undefined;
					render(sandbox);
				});
			},
			'selection events'() {
				return new Promise((resolve) => {
					let selected = false;
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						(event as any).grid.select(1);
						(event as any).grid.deselect(1);
					});
					renderProperties.selectionMode = SelectionMode.multiple;
					renderProperties.onSelect = (selectedData: SelectionData) => {
						selected = true;
						assert.strictEqual(selectedData.type, SelectionType.row);
						assert.strictEqual(1, selectedData.data.length);
						assert.strictEqual(1, selectedData.data[0].item.id);
						assert.strictEqual('first 1', selectedData.data[0].item.first);
					};
					renderProperties.onDeselect = (selectedData: SelectionData) => {
						assert.isTrue(selected);
						assert.strictEqual(selectedData.type, SelectionType.row);
						assert.strictEqual(1, selectedData.data.length);
						assert.strictEqual(1, selectedData.data[0].item.id);
						assert.strictEqual('first 1', selectedData.data[0].item.first);
						resolve();
					};
					render(sandbox);
				});
			},
			'selection events with selector'() {
				return new Promise((resolve) => {
					let selected = false;
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						(event as any).grid.select(1);
						(event as any).grid.deselect(1);
					});
					renderProperties.selectionMode = SelectionMode.multiple;
					renderProperties.features!.selector = true;
					(renderProperties.columns as any).selector = { selector: 'checkbox' };
					renderProperties.onSelect = (selectedData: SelectionData) => {
						selected = true;
						const inputs = document.querySelectorAll('td.dgrid-selector input');
						assert.isTrue((inputs[0] as HTMLInputElement).checked);
					};
					renderProperties.onDeselect = (selectedData: SelectionData) => {
						assert.isTrue(selected);
						const inputs = document.querySelectorAll('td.dgrid-selector input');
						assert.isFalse((inputs[0] as HTMLInputElement).checked);
						resolve();
					};
					render(sandbox);
				});
			}
		}
	},

	cellselection: {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			renderProperties = testProperties();
			renderProperties.features!.selection = SelectionType.cell;
		},
		afterEach() {
			document.body.removeChild(sandbox);
		},
		tests: {
			'basic selection render'() {
				return new Promise((resolve) => {
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						const grid = (event as any).grid;
						const firstCell = grid.domNode.querySelectorAll('td.dgrid-cell')[0];
						(event as any).grid.select(firstCell);
						(event as any).grid.deselect(firstCell);
						resolve();
					});
					renderProperties.selectionMode = SelectionMode.multiple;
					render(sandbox);
				});
			},
			'selection events'() {
				return new Promise((resolve) => {
					let selected = false;
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						const grid = (event as any).grid;
						const firstCell = grid.domNode.querySelectorAll('td.dgrid-cell')[0];
						(event as any).grid.select(firstCell);
						(event as any).grid.deselect(firstCell);
					});
					renderProperties.selectionMode = SelectionMode.multiple;
					renderProperties.onSelect = (selectedData: SelectionData) => {
						selected = true;
						assert.strictEqual(selectedData.type, SelectionType.cell);
						assert.strictEqual(1, selectedData.data.length);
						assert.strictEqual(1, selectedData.data[0].item.id);
						assert.strictEqual('first 1', selectedData.data[0].item.first);
						assert.strictEqual('first', selectedData.data[0].field);
					};
					renderProperties.onDeselect = (selectedData: SelectionData) => {
						assert.isTrue(selected);
						assert.strictEqual(selectedData.type, SelectionType.cell);
						assert.strictEqual(1, selectedData.data.length);
						assert.strictEqual(1, selectedData.data[0].item.id);
						assert.strictEqual('first 1', selectedData.data[0].item.first);
						assert.strictEqual('first', selectedData.data[0].field);
						resolve();
					};
					render(sandbox);
				});
			}
		}
	},

	tree: {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			renderProperties = testProperties();
			renderProperties.features!.tree = true;
		},
		afterEach() {
			document.body.removeChild(sandbox);
		},
		tests: {
			'basic tree render'() {
				return new Promise((resolve) => {
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						resolve();
					});
					render(sandbox);
				});
			}
		}
	},

	'column hider': {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			renderProperties = testProperties();
			renderProperties.features!.columnHider = true;
		},
		afterEach() {
			document.body.removeChild(sandbox);
		},
		tests: {
			'basic column hider render'() {
				return new Promise((resolve) => {
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						resolve();
					});
					render(sandbox);
				});
			},
			'column hider events'() {
				return new Promise((resolve) => {
					let selected = false;
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						const grid = (event as any).grid;
						grid.toggleColumnHiddenState('first');
						grid.toggleColumnHiddenState('first');
					});
					let eventCount = 0;
					renderProperties.onColumnStateChange = (data) => {
						eventCount++;
						switch (eventCount) {
							case 1: {
								assert.strictEqual(data.field, 'first');
								assert.strictEqual(data.id, 'first');
								assert.isTrue(data.hidden);
								break;
							}
							case 2: {
								assert.strictEqual(data.field, 'first');
								assert.strictEqual(data.id, 'first');
								assert.isFalse(data.hidden);
								resolve();
								break;
							}
						}
					};
					renderProperties.onDeselect = (selectedData: SelectionData) => {
						assert.isTrue(selected);
						assert.strictEqual(selectedData.type, SelectionType.cell);
						assert.strictEqual(1, selectedData.data.length);
						assert.strictEqual(1, selectedData.data[0].item.id);
						assert.strictEqual('first 1', selectedData.data[0].item.first);
						assert.strictEqual('first', selectedData.data[0].field);
						resolve();
					};
					render(sandbox);
				});
			}
		}
	},

	'column reorder': {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			renderProperties = testProperties();
			renderProperties.features!.columnReorder = true;
		},
		afterEach() {
			document.body.removeChild(sandbox);
		},
		tests: {
			'basic column reorder render'() {
				return new Promise((resolve) => {
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						resolve();
					});
					render(sandbox);
				});
			}
		}
	},

	'column resizer': {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			renderProperties = testProperties();
			renderProperties.features!.columnResizer = true;
		},
		afterEach() {
			document.body.removeChild(sandbox);
		},
		tests: {
			'basic column resizer render'() {
				return new Promise((resolve) => {
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						resolve();
					});
					render(sandbox);
				});
			}
		}
	},

	'column set': {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			renderProperties = testProperties();
			renderProperties.features!.columnSet = true;
			renderProperties.columnSets = [
				[[{ label: 'First', field: 'first' }]],
				[[{ label: 'Last', field: 'last' }]]
			];
		},
		afterEach() {
			document.body.removeChild(sandbox);
		},
		tests: {
			'basic column set render'() {
				return new Promise((resolve) => {
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						resolve();
					});
					render(sandbox);
				});
			},

			'no column sets'() {
				return new Promise((resolve) => {
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						resolve();
					});
					renderProperties.columnSets = undefined;
					render(sandbox);
				});
			}
		}
	},

	'compound columns': {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			renderProperties = testProperties();
			renderProperties.features!.compoundColumns = true;
		},
		afterEach() {
			document.body.removeChild(sandbox);
		},
		tests: {
			'basic column resizer render'() {
				return new Promise((resolve) => {
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						resolve();
					});
					render(sandbox);
				});
			}
		}
	}
});
