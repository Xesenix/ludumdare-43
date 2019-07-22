import { IPreloadProgress, preload } from 'lib/preload';
import ServiceWorkerModule from 'lib/service-worker/service-worker.module';

import IEComponent from './app/ie';
import PreloadComponent from './app/preloader';

window.addEventListener('load', () => {
	const root: HTMLElement = document.getElementById('app') || document.body;
	console.log(window.navigator.userAgent);
	const oldIE = window.navigator.userAgent.indexOf('MSIE ') >= 0;
	const newIE = window.navigator.userAgent.indexOf('Trident/') >= 0;
	if (oldIE || newIE) {
		root.innerHTML = '';
		root.appendChild(IEComponent());
	} else {
		const progressFormatter = (loaded: number, total: number) => total > 0 ? `${(100 * loaded / total).toFixed(0)}%` : `${loaded}`;
		const labelFormatter = (label: string) => label.replace(/(\.[a-z0-9]*)/, '');
		const clearPreload = preload((progress: IPreloadProgress) => {
			root.innerHTML = '';
			root.appendChild(PreloadComponent(progress, progressFormatter, labelFormatter));
		}, document);

		ServiceWorkerModule.run(window, console)
			.then(() => import(/* webpackChunkName: "app" */ './app/app.module'))
			.then(({ AppModule }) => {
				const app = new AppModule(root, document, window);

				// loading other application modules
				return app.start().then(clearPreload);
			});
	}
});
