// first load simple view with minimal dependencies on other modules
// for time when we will be loading other more heavy application modules
import(/* webpackChunkName: "preload" */ './app/preloader')
	.then(({ default: PreloadComponent }) => PreloadComponent)
	.then((PreloadComponent) => {
		const root: HTMLElement = document.getElementById('app');

		function preloadProgress(ev: any) {
			console.log(ev.detail);
			root.innerHTML = '';
			root.appendChild(PreloadComponent(ev.detail.resource || {}));
		}
		preloadProgress({ detail: {} });

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
