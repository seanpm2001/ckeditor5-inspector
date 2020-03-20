/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	isViewElement,
	isViewAttributeElement,
	isViewRoot,
	isViewEmptyElement,
	isViewUiElement,
	getViewPositionDefinition
} from '../utils';

import { compareArrays } from '../../utils';
import { stringify } from '../../components/utils';

export function getEditorViewRoots( editor ) {
	if ( !editor ) {
		return null;
	}

	return [ ...editor.editing.view.document.roots ];
}

export function getEditorViewRanges( editor ) {
	const ranges = [];
	const selection = editor.editing.view.document.selection;

	for ( const range of selection.getRanges() ) {
		ranges.push( {
			type: 'selection',
			start: getViewPositionDefinition( range.start ),
			end: getViewPositionDefinition( range.end )
		} );
	}

	return ranges;
}

export function getEditorViewTreeDefinition( { currentEditor, currentRootName, ranges } ) {
	if ( !currentRootName ) {
		return null;
	}

	const document = currentEditor.editing.view.document;
	const root = document.getRoot( currentRootName );

	return [
		getViewNodeDefinition( root, [ ...ranges ] )
	];
}

function getViewNodeDefinition( node, ranges ) {
	const nodeDefinition = {};

	Object.assign( nodeDefinition, {
		index: node.index,
		path: node.getPath(),
		node,
		positionsBefore: [],
		positionsAfter: []
	} );

	if ( isViewElement( node ) ) {
		fillElementDefinition( nodeDefinition, ranges );
	} else {
		fillViewTextNodeDefinition( nodeDefinition, ranges );
	}

	return nodeDefinition;
}

function fillElementDefinition( elementDefinition, ranges ) {
	const element = elementDefinition.node;

	Object.assign( elementDefinition, {
		type: 'element',
		children: [],
		positions: []
	} );

	elementDefinition.name = element.name;

	if ( isViewAttributeElement( element ) ) {
		elementDefinition.elementType = 'attribute';
	} else if ( isViewRoot( element ) ) {
		elementDefinition.elementType = 'root';
	} else if ( isViewEmptyElement( element ) ) {
		elementDefinition.elementType = 'empty';
	} else if ( isViewUiElement( element ) ) {
		elementDefinition.elementType = 'ui';
	} else {
		elementDefinition.elementType = 'container';
	}

	// Regardless of other rendering options, empty elements need no closing tags. They will never
	// host any children or selection.
	if ( isViewEmptyElement( element ) ) {
		elementDefinition.presentation = {
			isEmpty: true
		};
	}

	if ( isViewUiElement( element ) ) {
		elementDefinition.children.push( {
			type: 'comment',
			text: [
				'&lt;!--',
				'The View UI element content has been skipped. ',
				'<a href="https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_uielement-UIElement.html" target="_blank">',
				'Find out why',
				'</a>.',
				' --&gt;'
			].join( '' )
		} );
	}

	for ( const child of element.getChildren() ) {
		elementDefinition.children.push( getViewNodeDefinition( child, ranges, ) );
	}

	fillViewElementDefinitionPositions( elementDefinition, ranges );

	elementDefinition.attributes = getNodeAttrs( element );
}

function fillViewTextNodeDefinition( textNodeDefinition, ranges ) {
	Object.assign( textNodeDefinition, {
		type: 'text',
		startOffset: 0,
		text: textNodeDefinition.node.data,
		positions: []
	} );

	for ( const range of ranges ) {
		const positions = getRangePositionsInViewNode( textNodeDefinition, range );

		textNodeDefinition.positions.push( ...positions );
	}
}

function fillViewElementDefinitionPositions( elementDefinition, ranges ) {
	for ( const range of ranges ) {
		const positions = getRangePositionsInViewNode( elementDefinition, range );

		for ( const position of positions ) {
			const offset = position.offset;

			if ( offset === 0 ) {
				const firstChild = elementDefinition.children[ 0 ];

				if ( firstChild ) {
					firstChild.positionsBefore.push( position );
				} else {
					elementDefinition.positions.push( position );
				}
			} else if ( offset === elementDefinition.children.length ) {
				const lastChild = elementDefinition.children[ elementDefinition.children.length - 1 ];

				if ( lastChild ) {
					lastChild.positionsAfter.push( position );
				} else {
					elementDefinition.positions.push( position );
				}
			} else {
				// Go backward when looking for a child that will host the end position.
				// Go forward when looking for a child that will host the start position.
				//
				//		<p></p>
				//		[<p></p>]
				//		<p></p>
				//
				// instead of
				//
				//		<p></p>[
				//		<p></p>
				//		]<p></p>
				//
				let childIndex = position.isEnd ? 0 : elementDefinition.children.length - 1;
				let child = elementDefinition.children[ childIndex ];

				while ( child ) {
					if ( child.index === offset ) {
						child.positionsBefore.push( position );
						break;
					}

					if ( child.index + 1 === offset ) {
						child.positionsAfter.push( position );

						break;
					}

					childIndex += position.isEnd ? 1 : -1;
					child = elementDefinition.children[ childIndex ];
				}
			}
		}
	}
}

function getRangePositionsInViewNode( nodeDefinition, range ) {
	const nodePath = nodeDefinition.path;
	const startPath = range.start.path;
	const endPath = range.end.path;
	const positions = [];

	if ( isPathPrefixingAnother( nodePath, startPath ) ) {
		positions.push( {
			offset: startPath[ startPath.length - 1 ],
			isEnd: false,
			presentation: range.presentation,
			type: range.type,
			name: range.name
		} );
	}

	if ( isPathPrefixingAnother( nodePath, endPath ) ) {
		positions.push( {
			offset: endPath[ endPath.length - 1 ],
			isEnd: true,
			presentation: range.presentation,
			type: range.type,
			name: range.name
		} );
	}

	return positions;
}

function isPathPrefixingAnother( pathA, pathB ) {
	if ( pathA.length === pathB.length - 1 ) {
		const comparison = compareArrays( pathA, pathB );

		if ( comparison === 'prefix' ) {
			return true;
		}
	}

	return false;
}

function getNodeAttrs( node ) {
	const attrs = [ ...node.getAttributes() ].map( ( [ name, value ] ) => {
		return [ name, stringify( value, false ) ];
	} );

	return new Map( attrs );
}
