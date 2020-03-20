/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	SET_COMMANDS_CURRENT_COMMAND_NAME,
	UPDATE_COMMANDS_STATE
} from './actions';

import {
	SET_EDITORS,
	SET_CURRENT_EDITOR_NAME,
	SET_ACTIVE_TAB
} from '../../data/actions';

import { stringify } from '../../components/utils';

export default function modelReducer( globalState, commandsState, action ) {
	// Performance optimization: don't create the commands state unless necessary.
	if ( globalState.ui.activeTab !== 'Commands' ) {
		return commandsState;
	}

	if ( !commandsState ) {
		return getBlankCommandsState( globalState, commandsState );
	}

	switch ( action.type ) {
		case SET_COMMANDS_CURRENT_COMMAND_NAME:
			return { ...commandsState, currentCommandName: action.currentCommandName };

		// * SET_ACTIVE_TAB – Because of the performance optimization at the beginning, update the state
		// if we're back in the commands tab.
		// * UPDATE_MODEL_STATE – An action called by the editorEventObserver for the model document change.
		case SET_ACTIVE_TAB:
		case UPDATE_COMMANDS_STATE:
			return { ...commandsState, treeDefinition: getCommandsTreeDefinition( globalState, commandsState ) };

		// Actions related to the external state.
		case SET_EDITORS:
		case SET_CURRENT_EDITOR_NAME:
			return getBlankCommandsState( globalState, commandsState );

		default:
			return commandsState;
	}
}

function getBlankCommandsState( globalState, commandsState = {} ) {
	return {
		...commandsState,

		currentCommandName: null,
		treeDefinition: getCommandsTreeDefinition( globalState, commandsState )
	};
}

function getCommandsTreeDefinition( globalState ) {
	const list = [];

	for ( const [ name, command ] of globalState.currentEditor.commands ) {
		const attributes = [];

		if ( command.value !== undefined ) {
			attributes.push( [ 'value', stringify( command.value, false ) ] );
		}

		list.push( {
			name,
			type: 'element',
			children: [],
			node: name,
			attributes,

			presentation: {
				isEmpty: true,
				cssClass: [
					'ck-inspector-tree-node_tagless',
					command.isEnabled ? '' : 'ck-inspector-tree-node_disabled'
				].join( ' ' )
			}
		} );
	}

	return list.sort( ( a, b ) => a.name > b.name ? 1 : -1 );
}
