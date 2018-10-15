# @dojo/interop

<!-- TODO: change and uncomment
[![Build Status](https://travis-ci.org/dojo/interop.svg?branch=master)](https://travis-ci.org/dojo/interop)
[![codecov](https://codecov.io/gh/dojo/interop/branch/master/graph/badge.svg)](https://codecov.io/gh/dojo/interop)
[![npm version](https://badge.fury.io/js/dojo-<< package-name >>.svg)](http://badge.fury.io/js/%40dojo%2Finterop)
-->

A package that provides various bindings to enable interoperability for external libraries and Dojo packages.

Note: the term "legacy Dojo" refers to 1.x versions of the Dojo Toolkit.

-----

- [Installation](#installation)
- [Features](#features)
  - [DijitWrapper](#dijitwrapper)
  - [ReduxInjector](#reduxinjector)
  - [DgridWrapper](#dgridwrapper)
- [How Do I Contribute?](#how-do-i-contribute)
  - [Code Style](#code-style)
- [Testing](#testing)
- [Licensing Information](#licensing-information)

## Installation

To use `@dojo/interop`, install the package using npm:

```shell
npm install @dojo/interop
```

## Features

### DijitWrapper

`DijitWrapper` is a mixin class that can convert a legacy Dojo based Dijit and allows it to integrate with the Dojo widget system.

The wrapper takes a Dijit constructor function as its input and returns a Dojo widget.  For example, to take the `dijit/Calendar`
and place it in a Dojo `App` widget would look something like this:

```ts
import * as CalendarDijit from 'dijit/Calendar';
import DijitWrapper from '@dojo/interop/dijit/DijitWrapper';
import { v, w } from '@dojo/framework/widget-core/d';
import WidgetBase from '@dojo/framework/widget-core/WidgetBase';

const Calendar = DijitWrapper(CalendarDijit);

class App extends WidgetBase {
  private _onCalendarChange(date: Date) {
    console.log('Date selected:', date);
  }

  protected render() {
    return v('div', { key: 'root' }, [
      w(Calendar, {
        key: 'calendar1',
        id: 'calendar1',
        onChange: this._onCalendarChange
      })
    ]);
  }
}

export default App;
```

The result, when displayed through a projector, is a Dijit Calendar which will log the new date to the console every time the date is changed.

It is also possible to use a Dijit container, like `dijit/layout/ContentPane`, but children of a wrapped Dijit widget can only be other
wrapped Dijits.  You cannot place virtual DOM children (nodes from `v()`) or other non-Dijit widgets as children.

The `DijitWrapper` takes an optional second argument, `tagName`, which should be used when the widget system needs to create a DOM node to root a widget.  By default it uses `div`.

For most existing legacy Dojo Dijits, the TypeScript typings can be found at [dojo/typings](https://github.com/dojo/typings) and can be installed via npm via `npm install dojo-typings`.  User-created Dijits may be used with the `DijitWrapper` provide they adhere to the minimum interface described in the `/dijit/interfaces.d.ts` that is part of this package.

### ReduxInjector

`ReduxInjector` can be used to bind a redux store and Dojo widgets using the `registry`. The value returned by `getProperties` is an object containing two properties:

* `store` - the actual Redux store passed as the first argument to the `ReduxInjector` constructor.
* `extraOptions` - an additional options object that can be passed as an optional second argument to the `ReduxInjector` constructor.

An injector can be defined in the registry, which is then provided to the `Projector` as one of its properties. This is demonstrated in the example below.

```typescript
import global from '@dojo/framework/shim/global';
import ProjectorMixin from '@dojo/framework/widget-core/mixins/Projector';
import ReduxInjector from '@dojo/interop/redux/ReduxInjector';
import Registry from '@dojo/framework/widget-core/Registry';

import TodoAppContainer from './containers/TodoAppContainer';
import { createStore } from 'redux';
import { todoReducer } from './reducers';

const defaultState = {
	todos: [],
	currentTodo: '',
	activeCount: 0,
	completedCount: 0
};

const registry = new Registry();
const store = createStore(todoReducer, defaultState);
registry.defineInjector('application-state', new ReduxInjector(store));

const Projector = ProjectorMixin(TodoAppContainer);
const projector = new Projector();
projector.setProperties({ registry });
projector.append();
```

### DgridWrapper

`DgridWrapper` is a Dojo widget that wraps [dgrid](https://github.com/SitePen/dgrid) widgets. This allows you to use 
dgrid widgets, which rely on legacy Dojo, in a Dojo application.
 
Because of the depencies on legacy Dojo, there is some special setup and configuration needed in your application. Run 
the following commands to add legacy Dojo dependencies to your project:

```bash
npm install --save dojo
npm install --save dgrid
npm install --save dojo-dstore
npm install --save-dev @types/dojo
```

To make the legacy Dojo modules availabe to your application, add the following 
`build-app` configuration to your `.dojorc` file:

```json
{
   "build-app": {
      "externals": {
         "dependencies": [
            { "from": "node_modules/@dojo/interop/dgrid/loaderConfig.js", "inject": true },
            { "from": "node_modules/dojo", "to": "dojo", "name": "dojo", "inject": "dojo.js", "type": "umd" },
            { "from": "node_modules/dijit", "to": "dijit", "name": "dijit", "type": "umd" },
            { "from": "node_modules/dgrid", "to": "dgrid", "name": "dgrid", "inject": "css/dgrid.css", "type": "umd" },
            { "from": "node_modules/dojo-dstore", "to": "dstore", "name": "dstore", "type": "umd" }
         ]
      }
   }
}
```

The `loaderConfig.js` file contains configuration options for the legacy Dojo loader.  If you want change that 
configuration, make a copy of 'node_modules/@dojo/interop/dgrid/loaderConfig.js' and update your .dojorc to reference 
the copy.

You are ready to use `DgridWrapper` in your application.  

```typescript
import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { w } from '@dojo/framework/widget-core/d';
import DgridWrapper from '@dojo/interop/dgrid/DgridWrapper';

class SampleGrid extends WidgetBase {
	private data = [
		{ first: 'Bob', last: 'Thomson', id: 1, hasChildren: true },
		{ first: 'Tom', last: 'Bobson', id: 2, hasChildren: true }
	];
	
	private columns = {
		first: 'First',
		last: 'Last'
	};
	
	protected render() {
		return w(DgridWrapper, {
			features: {
				keyboard: true,
				selection: true,
			},
			data: this.data,
			columns: this.columns,
		});
	}
}
```
`DgridWrapper` accepts the items to be rendered as an array of objects set in the `data` property. Refer to 
[DgridWrapperProperties](src/dgrid/DgridWrapper.ts) to see the other properties that `DgridWrapper` 
supports.  Use the `features` property to activate different dgrid mixins.  The properties in 
`DgridWrapperProperties` are passed to the dgrid widgets and mixins and the property names match the dgrid property 
names.  Refer to the [dgrid documentation]
(https://github.com/SitePen/dgrid/tree/master/doc) for information on each dgrid configuration property. 

The `DgridWrapper` supports a subset of all dgrid features. Currently the features supported include:
* [Pagination](https://github.com/SitePen/dgrid/blob/v1.2.1/doc/components/extensions/Pagination.md)
* [Keyboard](https://github.com/SitePen/dgrid/blob/v1.2.1/doc/components/mixins/Keyboard.md)
* [Selection](https://github.com/SitePen/dgrid/blob/v1.2.1/doc/components/mixins/Selection.md)
* [Selector](https://github.com/SitePen/dgrid/blob/v1.2.1/doc/components/mixins/Selector.md)
* [Tree](https://github.com/SitePen/dgrid/blob/v1.2.1/doc/components/mixins/Tree.md)
* [ColumnHider](https://github.com/SitePen/dgrid/blob/v1.2.1/doc/components/extensions/ColumnHider.md)
* [ColumnReorder](https://github.com/SitePen/dgrid/blob/v1.2.1/doc/components/extensions/ColumnReorder.md)
* [ColumnResizer](https://github.com/SitePen/dgrid/blob/v1.2.1/doc/components/extensions/ColumnResizer.md)
* [CompoundColumns](https://github.com/SitePen/dgrid/blob/v1.2.1/doc/components/extensions/CompoundColumns.md)
* [ColumnSets](https://github.com/SitePen/dgrid/blob/v1.2.1/doc/components/mixins/ColumnSet.md)

## How do I contribute?

We appreciate your interest!  Please see the [Dojo Meta Repository](https://github.com/dojo/meta#readme) for the
Contributing Guidelines.

### Code Style

This repository uses [`prettier`](https://prettier.io/) for code styling rules and formatting. A pre-commit hook is installed automatically and configured to run `prettier` against all staged files as per the configuration in the project's `package.json`.

An additional npm script to run `prettier` (with write set to `true`) against all `src` and `test` project files is available by running:

```bash
npm run prettier
```

## Testing

Test cases MUST be written using [Intern](https://theintern.github.io) using the Object test interface and Assert assertion interface.

90% branch coverage MUST be provided for all code submitted to this repository, as reported by istanbul’s combined coverage results for all supported platforms.

To test locally in node run:

`grunt test`

To test against browsers with a local selenium server run:

`grunt test:local`

To test against BrowserStack or Sauce Labs run:

`grunt test:browserstack`

or

`grunt test:saucelabs`

## Licensing information

© 2018 [JS Foundation](https://js.foundation/) & contributors. [New BSD](http://opensource.org/licenses/BSD-3-Clause) and [Apache 2.0](https://opensource.org/licenses/Apache-2.0) licenses.

<!-- doc-viewer-config
{
	"api": "docs/api.json"
}
-->
