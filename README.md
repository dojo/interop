# @dojo/interop

<!-- TODO: change and uncomment
[![Build Status](https://travis-ci.org/dojo/interop.svg?branch=master)](https://travis-ci.org/dojo/interop)
[![codecov](https://codecov.io/gh/dojo/interop/branch/master/graph/badge.svg)](https://codecov.io/gh/dojo/interop)
[![npm version](https://badge.fury.io/js/dojo-<< package-name >>.svg)](http://badge.fury.io/js/%40dojo%2Finterop)
-->

Package that provides various bindings to enable interoperability for external libraries and Dojo 2 packages.

## Features

### DijitWrapper

`DijitWrapper` is a mixin class that can convert a Dojo 1 based Dijit and allow it to integrate to the Dojo 2 widgeting system.

The wrapper takes a Dijit constructor function as its input and returns a Dojo 2 widget.  For example, to take the `dijit/Calendar`
and place it a Dojo 2 `App` widget would look something like this:

```ts
import * as CalendarDijit from 'dijit/Calendar';
import DijitWrapper from '@dojo/interop/dijit/DijitWrapper';
import { v, w } from '@dojo/widget-core/d';
import WidgetBase from '@dojo/widget-core/WidgetBase';

const Calendar = DijitWrapper(CalendarDijit);

class App extends WidgetBase {
  private _onCalendarChange = (date: Date) => {
    console.log('Date selected:', date);
  }

  render() {
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

This would result, when displayed through a projector, the Dijit Calendar which every time the date changed, it would log the new date
to the console.

It is also possible to use a Dijit container, like `dijit/layout/ContentPane`, but children of a wrapped Dijit widget can only other
wrapped Dijits.  You cannot place virtual DOM children (node from `v()`) or other non Dijit widgets as children.

The `DijitWrapper` takes an optional second argument, which is the `tagName` that should be used when the widgeting system needs to create a DOM node to root a widget.  By default it uses `div`.

For most existing Dojo 1 Dijits, the typings can be found at [dojo/typings](https://github.com/dojo/typings) and can be installed via npm via `npm install dojo-typings`.  User created Dijits should be able to be used with the `DijitWrapper` though they need to ensure that they adhere to the minimum interface described in the `/dijit/interfaces.d.ts` that is part of this package.

### ReduxInjector

*Coming Soon*

## How do I use this package?

To use `@dojo/interop`, install the package using npm:

```
npm install @dojo/interop
```

## How do I contribute?

We appreciate your interest!  Please see the [Dojo 2 Meta Repository](https://github.com/dojo/meta#readme) for the
Contributing Guidelines and Style Guide.

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

TODO: If third-party code was used to write this library, make a list of project names and licenses here

* [Third-party lib one](https//github.com/foo/bar) ([New BSD](http://opensource.org/licenses/BSD-3-Clause))

© [JS Foundation](https://js.foundation/) & contributors. [New BSD](http://opensource.org/licenses/BSD-3-Clause) and [Apache 2.0](https://opensource.org/licenses/Apache-2.0) licenses.
