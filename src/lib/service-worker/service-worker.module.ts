import { IApplication } from 'lib/interfaces';

export default class ServiceWorkerModule {
	public static register(container: IApplication) {
		const console: Console = container.get<Console>('debug:console');
		const window: Window = container.get<Window>('window');
		console.debug('ServiceWorkerModule', process.env.SERVICE_WORKER);
		if (process.env.SERVICE_WORKER === 'true' && 'serviceWorker' in window.navigator) {
			console.log('ServiceWorkerModule:service worker setup');
			// Use the window load event to keep the page load performant
			window.addEventListener('load', () => {
				console.log('ServiceWorkerModule:service worker initialization');
				window.navigator.serviceWorker.register('/service-worker.js')
					.then(() => {
						console.log('ServiceWorkerModule:service worker ready');
					})
					.catch((err) => {
						console.log('ServiceWorkerModule:service worker error', err);
					});
			});
		}
	}
}
