import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'reflect-metadata';

// first load simple view with minimal dependencies on other modules
// for time when we will be loading other more heavy application modules
import(/* webpackChunkName: "preload" */ './app/preload')
	.then(({ default: PreloadComponent }) => PreloadComponent)
	.then((PreloadComponent) => {
		ReactDOM.render(React.createElement(PreloadComponent), document.getElementById('app'));

		function preloadProgress(ev: any) {
			console.log(ev.detail);
			ReactDOM.render(React.createElement(PreloadComponent, ev.detail), document.getElementById('app'));
		}

		document.addEventListener('chunk-progress-webpack-plugin', preloadProgress);

		return import(/* webpackChunkName: "app" */ './app/app.module')
			.then(({ AppModule }) => {
				const app = new AppModule();

				// loading other application modules
				return app.start().then(() => {
					document.removeEventListener('chunk-progress-webpack-plugin', preloadProgress);
				});
			});
	});
