/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global require, window */

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Chai from 'chai'
import ChaiEnzyme from 'chai-enzyme'

Enzyme.configure( {
	adapter: new Adapter()
} );

Chai.use( ChaiEnzyme() );

window.expect = Chai.expect;
window.shallow = Enzyme.shallow;

const testsContext = require.context( '.', true, /\.js$/ );

testsContext.keys().forEach( testsContext );
