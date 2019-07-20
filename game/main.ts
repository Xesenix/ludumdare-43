import { IPreloadProgress, preload } from 'lib/preload';

// first load simple view with minimal dependencies on other modules
// for time when we will be loading other more heavy application modules
import(/* webpackChunkName: "preload" */ './app/preloader')
	.then(({ default: PreloadComponent }) => PreloadComponent)
	.then((PreloadComponent) => {
		const root: HTMLElement = document.getElementById('app') || document.body;
		const progressFormatter = (loaded: number, total: number) => total > 0 ? `${(100 * loaded / Math.min(total, 1)).toFixed(0)}%` : `${loaded}`;
		const clearPreload = preload((progress: IPreloadProgress) => {
			root.innerHTML = '';
			root.appendChild(PreloadComponent(progress, progressFormatter));
		}, document);

		return import(/* webpackChunkName: "app" */ './app/app.module')
			.then(({ AppModule }) => {
				const app = new AppModule();

				// loading other application modules
				return app.start().then(clearPreload);
			});
	});
