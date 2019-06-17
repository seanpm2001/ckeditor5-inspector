CKEditor 5 inspector
=====================================

[![Join the chat at https://gitter.im/ckeditor/ckeditor5](https://badges.gitter.im/ckeditor/ckeditor5.svg)](https://gitter.im/ckeditor/ckeditor5?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/%40ckeditor%2Fckeditor5-inspector.svg)](https://www.npmjs.com/package/@ckeditor/ckeditor5-inspector)
[![Build Status](https://travis-ci.org/ckeditor/ckeditor5-inspector.svg?branch=master)](https://travis-ci.org/ckeditor/ckeditor5-inspector)
[![Coverage Status](https://coveralls.io/repos/github/ckeditor/ckeditor5-inspector/badge.svg?branch=master)](https://coveralls.io/github/ckeditor/ckeditor5-inspector?branch=master)
<br>
[![Dependency Status](https://david-dm.org/ckeditor/ckeditor5-inspector/status.svg)](https://david-dm.org/ckeditor/ckeditor5-inspector)
[![devDependency Status](https://david-dm.org/ckeditor/ckeditor5-inspector/dev-status.svg)](https://david-dm.org/ckeditor/ckeditor5-inspector?type=dev)

The official [CKEditor 5](https://ckeditor.com/ckeditor-5) rich text editor instance inspector for developers.

![The inspector panel attached to the editor instance.](/sample/screenshot.png)

## Usage

Include the script to load the inspector:

```html
<script src="path/to/inspector.js"></script>
```

Call `CKEditorInspector.attach( editor )` when editor instance is ready:

```js
ClassicEditor
	.create( ... )
	.then( editor => {
		CKEditorInspector.attach( editor );
	} )
	.catch( error => {
		console.error( error );
	} );
```

**Note**: You can attach to multiple editors under unique names at a time. Then you can select the editor instance in the drop–down inside the inspector panel to switch context.

```js
CKEditorInspector.attach( {
	'header-editor': editor1,
	'footer-editor': editor2,
	// ...
} );
```

Call `CKEditorInspector.detach( name )` to detach the inspector from an editor instance.

**Tip**: `CKEditorInspector.attach()` returns the generated name of the editor if it was not provided.

```js
// Attach the inspector to two editor instances:
const generatedName = CKEditorInspector.attach( editor1 );
CKEditorInspector.attach( { myEditor: editor2 } );

// ...

// Detach from the instances:
CKEditorInspector.detach( generatedName );
CKEditorInspector.detach( 'myEditor' );
```

### Configuration

You can pass configuration options to the `CKEditorInspector.attach()` method as the last argument:

```js
CKEditorInspector.attach( editor, {
	// configuration options
} );

CKEditorInspector.attach( { 'editor-name': editor }, {
	// configuration options
} );
```

#### `isCollapsed`

To attach the inspector with a collapsed UI, use the `options.isCollapsed` option.

**Note**: This option works when `CKEditorInspector.attach()` is called for the first time only.

```js
CKEditorInspector.attach( { 'editor-name': editor }, {
	// Attach the inspector to the "editor" but the UI will be collapsed.
	isCollapsed: true
} );
```

## Compatibility

The inspector works with CKEditor 5 [v12.0.0](https://github.com/ckeditor/ckeditor5/releases/tag/v12.0.0)+.

## Development

To configure the environment:

```console
git clone git@github.com:ckeditor/ckeditor5-inspector.git
cd ckeditor5-inspector
yarn install
```

### Working with the code

Start the webpack file watcher:

```console
yarn dev
```

and open `http://path/to/ckeditor5-inspector/sample` in your web browser.

### Building

To build the production version of the inspector, run:

```console
yarn build
```

### Testing

To run tests, execute:

```console
yarn test
```

## Releasing

The release process is as follows (order matters):

**Note:** We recommend using `npm` for that.

```console
npm run changelog
npm run build
```

Run the sample and make sure global `CKEDITOR_INSPECTOR_VERSION` is right. Then:

```console
npm run release
```

## License

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html). For full details about the license, please check the `LICENSE.md` file.
