/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';

/**
 * A class which instances represent positions (selection, markers) in the tree.
 */
export default class TreePosition extends Component {
	render() {
		const definition = this.props.definition;

		const classes = [
			'ck-inspector-tree__position',
			definition.type === 'selection' ? 'ck-inspector-tree__position_selection' : '',
			definition.type === 'marker' ? 'ck-inspector-tree__position_marker' : '',
			definition.isEnd ? 'ck-inspector-tree__position_end' : ''
		].join( ' ' );

		return <span className={classes}>&#8203;</span>;
	}
}
