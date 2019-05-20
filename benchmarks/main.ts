import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppComponent from './app/app';

Promise.all([
	import('./benchmarks/data-update-increase'),
	import('./benchmarks/data-update-push-immutable'),
	import('./benchmarks/functions-creation-simple'),
	import('./benchmarks/functions-creation-complex'),
	import('./benchmarks/data-selectors'),
	import('./benchmarks/game-rules/game-rules'),
	import('./benchmarks/deep-copy'),
])
.then((suites) => {
	const root = document.getElementById('benchmarks');
	ReactDOM.render(
		React.createElement(AppComponent, { suites: suites.map(({ default: suit }) => suit) }),
		root,
	);
});
