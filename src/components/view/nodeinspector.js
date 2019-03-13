/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Button from './../button';
import Pane from '../pane';
import Logger from '../../logger';
import editorEventObserver from '../editorobserver';
import {
	isViewElement,
	isViewText,
	isViewRoot,
	isViewAttributeElement,
	isViewContainerElement,
	isViewUiElement,
	isViewEmptyElement
} from './utils';
import { stringifyPropertyList } from '../utils';
import ObjectInspector from '../objectinspector';

class NodeInspector extends Component {
	editorEventObserverConfig( props ) {
		return {
			target: props.editor.editing.view,
			event: 'render'
		};
	}

	render() {
		const info = this.getInspectedEditorNodeInfo();

		if ( !info ) {
			return <Pane isEmpty="true">
				<p>Select a node in the tree to inspect</p>
			</Pane>;
		}

		return <ObjectInspector
			header={[
				<span key="link">
					<a href={info.url} target="_blank" rel="noopener noreferrer">
						<b>{info.type}</b>:
					</a>
					{ info.type === 'Text' ? <em>{info.name}</em> : info.name }
				</span>,
				<Button
					key="log"
					type="log"
					text="Log in console"
					onClick={() => Logger.log( info.editorNode )}
				/>
			]}
			lists={[
				{
					name: 'Attributes',
					url: info.url,
					items: info.attributes
				},
				{
					name: 'Properties',
					url: info.url,
					items: info.properties
				},
			]}
		/>;
	}

	getInspectedEditorNodeInfo() {
		const node = this.props.inspectedNode;
		const currentRootName = this.props.currentRootName;

		if ( !node ) {
			return null;
		}

		if ( !isViewRoot( node ) && !node.parent ) {
			return;
		}

		if ( node.root.rootName !== currentRootName ) {
			return;
		}

		const info = {
			editorNode: node,
			properties: [],
			attributes: []
		};

		if ( isViewElement( node ) ) {
			if ( isViewRoot( node ) ) {
				info.type = 'RootEditableElement';
				info.name = node.rootName;
				info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_rooteditableelement-RootEditableElement.html';
			} else {
				info.name = node.name;

				if ( isViewAttributeElement( node ) ) {
					info.type = 'AttributeElement';
					info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_attributeelement-AttributeElement.html';
				} else if ( isViewEmptyElement( node ) ) {
					info.type = 'EmptyElement';
					info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_emptyelement-EmptyElement.html';
				} else if ( isViewUiElement( node ) ) {
					info.type = 'UIElement';
					info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_uielement-UIElement.html';
				} else if ( isViewContainerElement( node ) ) {
					info.type = 'ContainerElement';
					info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_containerelement-ContainerElement.html';
				} else {
					info.type = 'Element';
					info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_element-Element.html';
				}
			}

			info.attributes.push( ...node.getAttributes() );
			info.properties.push(
				[ 'index', node.index ],
				[ 'isEmpty', node.isEmpty ],
				[ 'childCount', node.childCount ],
			);
		} else if ( isViewText( node ) ) {
			info.name = node.data;
			info.type = 'Text';
			info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_text-Text.html';

			info.properties.push(
				[ 'index', node.index ]
			);
		}

		info.properties = stringifyPropertyList( info.properties );
		info.attributes = stringifyPropertyList( info.attributes );

		return info;
	}
}

export default editorEventObserver( NodeInspector );
