/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Pane from '../components/pane';
import ObjectInspector from '../components/objectinspector';

class SchemaDefinitionInspector extends Component {
	render() {
		const definition = this.props.currentSchemaDefinition;

		if ( !definition ) {
			return <Pane isEmpty="true">
				<p>Select a schema definition to inspect</p>
			</Pane>;
		}

		return <ObjectInspector
			header={[
				<span key="link">
					<a href={definition.urls.general} target="_blank" rel="noopener noreferrer">
						<b>{definition.type}</b>
					</a>
					:{this.props.currentSchemaDefinitionName}
				</span>
			]}
			lists={[
				{
					name: 'Properties',
					url: definition.urls.general,
					itemDefinitions: definition.properties
				},
				{
					name: 'Allowed attributes',
					url: definition.urls.allowAttributes,
					itemDefinitions: definition.allowAttributes
				},
				{
					name: 'Allowed children',
					url: definition.urls.allowChildren,
					itemDefinitions: definition.allowChildren
				},
				{
					name: 'Allowed in',
					url: definition.urls.allowIn,
					itemDefinitions: definition.allowIn
				}
			]}
		/>;
	}
}

const mapStateToProps = ( { editors, currentEditorName, schema: { currentSchemaDefinitionName, currentSchemaDefinition } } ) => {
	return { editors, currentEditorName, currentSchemaDefinitionName, currentSchemaDefinition };
};

export default connect( mapStateToProps, {} )( SchemaDefinitionInspector );