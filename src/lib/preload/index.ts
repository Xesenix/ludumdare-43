
export interface IPreloadProgress {
	[key: string]: {
		url: string;
		loaded: number;
		total: number;
	};
}

/**
 * Will handle preloading of modules split by webpack.
 * Requires chunk-progress-webpack-plugin to work.
 *
 * @param renderProgress function rendering preload view
 * @param root dome node for rendering progress component
 */
export function preload(renderProgress: (progress: IPreloadProgress) => void, document: Document) {
	let animationFrameHandler;
	const progress: IPreloadProgress = {};
	function preloadProgress(ev: any) {
		if (ev.detail.resource.url) {
			progress[ev.detail.resource.url] = Object.assign(progress[ev.detail.resource.url] || {}, ev.detail.resource);
		}
		animationFrameHandler = requestAnimationFrame(() => {
			if (animationFrameHandler) {
				renderProgress(progress);
			}
		});
	}
	preloadProgress({ detail: { resource: {} } });

	document.addEventListener('chunk-progress-webpack-plugin', preloadProgress);

	return () => {
		document.removeEventListener('chunk-progress-webpack-plugin', preloadProgress);
		cancelAnimationFrame(animationFrameHandler);
		animationFrameHandler = null;
	};
}
