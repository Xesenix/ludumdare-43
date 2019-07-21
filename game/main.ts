import { IPreloadProgress, preload } from 'lib/preload';
import ServiceWorkerModule from 'lib/service-worker/service-worker.module';

import PreloadComponent from './app/preloader';

window.addEventListener('load', () => { console.log('load'); });

const root: HTMLElement = document.getElementById('app') || document.body;
const progressFormatter = (loaded: number, total: number) => total > 0 ? `${(100 * loaded / total).toFixed(0)}%` : `${loaded}`;
const clearPreload = preload((progress: IPreloadProgress) => {
	console.log('progress', progress);
	root.innerHTML = '';
	root.appendChild(PreloadComponent(progress, progressFormatter));
}, document);

ServiceWorkerModule.run(window, console)
	.then(() => import(/* webpackChunkName: "app" */ './app/app.module'))
	.then(({ AppModule }) => {
		const app = new AppModule();

		// loading other application modules
		return app.start().then(clearPreload);
	});
