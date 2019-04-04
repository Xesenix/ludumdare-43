import 'reflect-metadata';

import { AppModule } from './app/app.module';

if (process.env.SERVICE_WORKER === 'true' && 'serviceWorker' in navigator) {
	// Use the window load event to keep the page load performant
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/service-worker.js');
	});
}

const app = new AppModule();

app.boot();
