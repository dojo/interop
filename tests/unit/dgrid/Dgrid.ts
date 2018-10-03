import TestProjector from './TestProjector';
import harness from '@dojo/framework/testing/harness';
import DgridWrapper, {
	DgridWrapperProperties,
	SelectionData,
	SelectionMode,
	SelectionType
} from '../../../src/dgrid/DgridWrapper';

import { w } from '@dojo/framework/widget-core/d';

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

let projector: TestProjector;

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
			w('DgridInnerWrapper', {
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
		const properties: DgridWrapperProperties = {
			data: [],
			columns: {
				first: 'First',
				last: 'Last'
			},
			features: {
				pagination: true
			}
		};
		const h = harness(() => w(DgridWrapper, properties));
		h.expect(() =>
			w('DgridInnerWrapper', {
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
		properties.columns = {
			id: 'ID',
			first: 'First',
			last: 'Last'
		};
		h.expect(() =>
			w('DgridInnerWrapper', {
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
		properties.data = [
			{
				id: 1,
				first: 'first',
				last: 'last'
			}
		];
		h.expect(() =>
			w('DgridInnerWrapper', {
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
		properties.columns = [{ field: 'first', label: 'FIRST' }, { field: 'last', label: 'LAST' }];
		h.expect(() =>
			w('DgridInnerWrapper', {
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
		properties.columns = [{ field: 'first', label: 'fIrSt' }, { field: 'last', label: 'LAST' }];
		h.expect(() =>
			w('DgridInnerWrapper', {
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
		const properties: DgridWrapperProperties = {
			data: [],
			columns: {
				first: 'First',
				last: 'Last'
			},
			features: {
				pagination: true
			}
		};
		const h = harness(() => w(DgridWrapper, properties));
		h.expect(() =>
			w('DgridInnerWrapper', {
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
			} as DgridWrapperProperties)
		);
		properties.features = {
			pagination: false
		};
		h.expect(() =>
			w('DgridInnerWrapper', {
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
		properties.previousNextArrows = false;
		h.expect(() =>
			w('DgridInnerWrapper', {
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
		const projector = new TestProjector();
		projector.testProperties.features!.pagination = true;
		projector.sandbox();

		// Check to see if a dgrid grid rendered with pagination.
		const gridNode = projector.root.firstChild! as HTMLElement;
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
		const projector = new TestProjector();
		projector.testProperties.features!.pagination = true;
		projector.testProperties.columns = [];
		projector.sandbox();

		// Check to see if a dgrid grid rendered with pagination.
		const gridNode = projector.root.firstChild! as HTMLElement;
		assert.exists(gridNode);

		const cells = gridNode.querySelectorAll('.dgrid-cell');
		assert.strictEqual(cells.length, 0);

		const paginationNode = gridNode.querySelector('.dgrid-pagination');
		assert.exists(paginationNode);
	},

	'basic DOM render - null columns'() {
		const projector = new TestProjector();
		projector.testProperties.features!.pagination = true;
		projector.testProperties.columns = undefined;
		projector.sandbox();

		// Check to see if a dgrid grid rendered with pagination.
		const gridNode = projector.root.firstChild! as HTMLElement;
		assert.exists(gridNode);

		const cells = gridNode.querySelectorAll('.dgrid-cell');
		assert.strictEqual(cells.length, 0);

		const paginationNode = gridNode.querySelector('.dgrid-pagination');
		assert.exists(paginationNode);
	},

	'recreate grid on property change'() {
		const projector = new TestProjector();
		projector.testProperties.features!.pagination = true;
		projector.sandbox();

		// Check to see if a dgrid grid rendered with pagination.
		let gridNode = projector.root.firstChild! as HTMLElement;
		assert.exists(gridNode);
		const gridId = gridNode.id;

		let paginationNode = gridNode.querySelector('.dgrid-pagination');
		assert.exists(paginationNode);

		delete projector.testProperties.features;
		projector.invalidate();

		gridNode = projector.root.firstChild! as HTMLElement;
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
		const projector = new TestProjector();
		projector.testProperties.features!.pagination = true;
		projector.testProperties.columns = [{ field: 'first', label: 'First' }, { field: 'last', label: 'Last' }];
		projector.sandbox();

		// Check to see if a dgrid grid rendered with pagination.
		let gridNode = projector.root.firstChild! as HTMLElement;
		assert.exists(gridNode);
		const gridId = gridNode.id;

		let cells = gridNode.querySelectorAll('.dgrid-cell');
		assert.strictEqual(cells.length, 6);

		['First', 'Last', 'first 1', 'last 1'].forEach((text, i) => {
			assert.strictEqual(cells[i].textContent, text);
		});

		projector.testProperties.columns = [
			{ field: 'id', label: 'ID' },
			{ field: 'first', label: 'First' },
			{ field: 'last', label: 'Last' }
		];
		projector.invalidate();

		gridNode = projector.root.firstChild! as HTMLElement;
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

									projector.testProperties.previousNextArrows = false;
									projector.invalidate();
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
					const projector = new TestProjector();
					projector.testProperties.features!.pagination = true;

					for (let i = 3; i < 100; i++) {
						projector.testProperties.data.push({
							id: i,
							first: 'First' + i,
							last: 'Last' + i
						});
					}
					projector.testProperties.rowsPerPage = 5;
					projector.append(sandbox);
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

										projector.testProperties.previousNextArrows = false;
										projector.invalidate();
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

					const projector = new TestProjector();
					projector.testProperties.features!.pagination = true;
					for (let i = 3; i < 100; i++) {
						projector.testProperties.data.push({
							id: i,
							first: 'First' + i,
							last: 'Last' + i
						});
					}
					projector.testProperties.rowsPerPage = 5;
					projector.append(sandbox);
				});
			}
		}
	},

	'keyboard tab index'() {
		const projector = new TestProjector();
		projector.testProperties.features!.keyboard = true;
		projector.testProperties.tabIndex = 5;
		projector.sandbox();

		// Check to see if a dgrid grid rendered with pagination.
		const gridNode = projector.root.firstChild! as HTMLElement;
		assert.exists(gridNode);

		const cells = gridNode.querySelectorAll('th.dgrid-cell');
		assert.exists(cells);
		assert.strictEqual('5', cells[0].getAttribute('tabindex'));
	},

	selection: {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			projector = new TestProjector();
			projector.testProperties.features!.selection = SelectionType.row;
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
					projector.testProperties.selectionMode = SelectionMode.multiple;
					projector.append(sandbox);
				});
			},
			'basic selection render with null selection'() {
				return new Promise((resolve) => {
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						assert.strictEqual(Object.keys((event as any).grid.selection).length, 0);
						resolve();
					});
					projector.testProperties.selectionMode = SelectionMode.multiple;
					projector.testProperties.selection = undefined;
					projector.append(sandbox);
				});
			},
			'selection events'() {
				return new Promise((resolve) => {
					let selected = false;
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						(event as any).grid.select(1);
						(event as any).grid.deselect(1);
					});
					projector.testProperties.selectionMode = SelectionMode.multiple;
					projector.testProperties.onSelect = (selectedData: SelectionData) => {
						selected = true;
						assert.strictEqual(selectedData.type, SelectionType.row);
						assert.strictEqual(1, selectedData.data.length);
						assert.strictEqual(1, selectedData.data[0].item.id);
						assert.strictEqual('first 1', selectedData.data[0].item.first);
					};
					projector.testProperties.onDeselect = (selectedData: SelectionData) => {
						assert.isTrue(selected);
						assert.strictEqual(selectedData.type, SelectionType.row);
						assert.strictEqual(1, selectedData.data.length);
						assert.strictEqual(1, selectedData.data[0].item.id);
						assert.strictEqual('first 1', selectedData.data[0].item.first);
						resolve();
					};
					projector.append(sandbox);
				});
			},
			'selection events with selector'() {
				return new Promise((resolve) => {
					let selected = false;
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						(event as any).grid.select(1);
						(event as any).grid.deselect(1);
					});
					projector.testProperties.selectionMode = SelectionMode.multiple;
					projector.testProperties.features!.selector = true;
					(projector.testProperties.columns as any).selector = { selector: 'checkbox' };
					projector.testProperties.onSelect = (selectedData: SelectionData) => {
						selected = true;
						const inputs = document.querySelectorAll('td.dgrid-selector input');
						assert.isTrue((inputs[0] as HTMLInputElement).checked);
					};
					projector.testProperties.onDeselect = (selectedData: SelectionData) => {
						assert.isTrue(selected);
						const inputs = document.querySelectorAll('td.dgrid-selector input');
						assert.isFalse((inputs[0] as HTMLInputElement).checked);
						resolve();
					};
					projector.append(sandbox);
				});
			}
		}
	},

	cellselection: {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			projector = new TestProjector();
			projector.testProperties.features!.selection = SelectionType.cell;
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
					projector.testProperties.selectionMode = SelectionMode.multiple;
					projector.append(sandbox);
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
					projector.testProperties.selectionMode = SelectionMode.multiple;
					projector.testProperties.onSelect = (selectedData: SelectionData) => {
						selected = true;
						assert.strictEqual(selectedData.type, SelectionType.cell);
						assert.strictEqual(1, selectedData.data.length);
						assert.strictEqual(1, selectedData.data[0].item.id);
						assert.strictEqual('first 1', selectedData.data[0].item.first);
						assert.strictEqual('first', selectedData.data[0].field);
					};
					projector.testProperties.onDeselect = (selectedData: SelectionData) => {
						assert.isTrue(selected);
						assert.strictEqual(selectedData.type, SelectionType.cell);
						assert.strictEqual(1, selectedData.data.length);
						assert.strictEqual(1, selectedData.data[0].item.id);
						assert.strictEqual('first 1', selectedData.data[0].item.first);
						assert.strictEqual('first', selectedData.data[0].field);
						resolve();
					};
					projector.append(sandbox);
				});
			}
		}
	},

	tree: {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			projector = new TestProjector();
			projector.testProperties.features!.tree = true;
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
					projector.append(sandbox);
				});
			}
		}
	},

	'column hider': {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			projector = new TestProjector();
			projector.testProperties.features!.columnHider = true;
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
					projector.append(sandbox);
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
					projector.testProperties.onColumnStateChange = (data) => {
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
					projector.testProperties.onDeselect = (selectedData: SelectionData) => {
						assert.isTrue(selected);
						assert.strictEqual(selectedData.type, SelectionType.cell);
						assert.strictEqual(1, selectedData.data.length);
						assert.strictEqual(1, selectedData.data[0].item.id);
						assert.strictEqual('first 1', selectedData.data[0].item.first);
						assert.strictEqual('first', selectedData.data[0].field);
						resolve();
					};
					projector.append(sandbox);
				});
			}
		}
	},

	'column reorder': {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			projector = new TestProjector();
			projector.testProperties.features!.columnReorder = true;
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
					projector.append(sandbox);
				});
			}
		}
	},

	'column resizer': {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			projector = new TestProjector();
			projector.testProperties.features!.columnResizer = true;
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
					projector.append(sandbox);
				});
			}
		}
	},

	'column set': {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			projector = new TestProjector();
			projector.testProperties.features!.columnSet = true;
			projector.testProperties.columnSets = [
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
					projector.append(sandbox);
				});
			},

			'no column sets'() {
				return new Promise((resolve) => {
					sandbox.addEventListener('dgrid-refresh-complete', (event) => {
						resolve();
					});
					projector.testProperties.columnSets = undefined;
					projector.append(sandbox);
				});
			}
		}
	},

	'compound columns': {
		beforeEach() {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);

			projector = new TestProjector();
			projector.testProperties.features!.compoundColumns = true;
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
					projector.append(sandbox);
				});
			}
		}
	}
});
