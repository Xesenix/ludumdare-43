import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppComponent from './app/app';

Promise.all([
	import('./suits/data-update-increase'),
	import('./suits/data-update-push-immutable'),
	import('./suits/functions-creation-simple'),
	import('./suits/functions-creation-complex'),
	import('./suits/data-selectors'),
])
.then((suites) => {
	const root = document.getElementById('benchmarks');
	ReactDOM.render(
		React.createElement(AppComponent, { suites: suites.map(({ default: suit }) => suit) }),
		root,
	);
});
