/**
 * Original:
 * @see https://github.com/seleb/chunk-progress-webpack-plugin/blob/master/index.js
 */

class ChunkProgressWebpackPlugin {
	apply(compiler) {
		compiler.hooks.compilation.tap('chunk-progress-webpack-plugin', function (compilation) {
			compilation.mainTemplate.hooks.localVars.tap('add-progress-vars', function (source) {
				return [
					source,
					functionBody(addProgressVars)
				].join('\n');
			});
			compilation.mainTemplate.hooks.requireEnsure.tap('replace-require-ensure', function () {
				return functionBody(replaceRequireEnsure);
			});
		});
	}
}

module.exports = ChunkProgressWebpackPlugin;

// helper for returning contents of a function
function functionBody(fn) {
	const str = fn.toString();
	return str.slice(str.indexOf("{") + 1, str.lastIndexOf("}"));
}

function addProgressVars() {
	// chunk-progress-webpack-plugin add-progress-vars start
	var progress = {
		totalSize: 0,
		activeLoadCount: 0,
		activeLoads: {},
	};
	// chunk-progress-webpack-plugin add-progress-vars end
}

function replaceRequireEnsure(chunkId) {
	// chunk-progress-webpack-plugin replace-require-ensure start
	let installedChunkData = installedChunks[chunkId];
	if (installedChunkData !== 0) { // 0 means "already installed".
		if (installedChunkData) {
			promises.push(installedChunkData[2]);
		} else {
			// setup Promise in chunk cache
			let promise = new Promise(function (resolve, reject) {
				installedChunkData = installedChunks[chunkId] = [resolve, reject];
			});

			const url = jsonpScriptSrc(chunkId);
			progress.activeLoads[url] = 0;
			progress.activeLoadCount += 1;
			promises.push(installedChunkData[2] = promise);

			const timeout = setTimeout(function () {
				onScriptComplete({
					type: 'timeout',
					target: script
				});
			}, 120000);

			const totalSize = {

			}

			new Promise(function (resolve, reject) {
					const xhr = new XMLHttpRequest();
					xhr.open('HEAD', url);
					xhr.onload = resolve;
					xhr.onerror = reject;
					xhr.send();
				}).then(function (originalEvent) {
					// TODO: sned request to chunk-progress-webpack-plugin to add possibility to handle custom size headers
					// introduced change for handling gziped content
					const total = parseInt(originalEvent.target.getResponseHeader('x-decompressed-content-length') || originalEvent.target.getResponseHeader('content-length'), 10);
					totalSize[url] = total;
					progress.totalSize += total;
					// ---
					return new Promise(function (resolve, reject) {
						const xhr = new XMLHttpRequest();
						xhr.open('GET', url);
						xhr.onload = resolve;
						xhr.onerror = reject;
						xhr.onprogress = function (event) {
							const loaded = Object.values(progress.activeLoads).reduce(function (sum, num) {
								return num + sum;
							});
							progress.activeLoads[url] = event.loaded;
							document.dispatchEvent(new CustomEvent(
								'chunk-progress-webpack-plugin', {
									detail: {
										originalEvent,
										loaded: loaded,
										total: progress.totalSize,
										resource: {
											url: url,
											loaded: event.loaded,
											// use size from custom header instead of 0 value returned when event.lengthComputable === false
											total: event.lengthComputable ? event.total : totalSize[url],
										}
									}
								}));
						};
						xhr.send();
					});
				})
				.then(function (event) {
					return event.target.responseText;
				})
				.then(function (js) {
					const head = document.getElementsByTagName('head')[0];
					const script = document.createElement('script');
					script.textContent = js;
					head.appendChild(script);
				})
				.then(function () {
					onScriptComplete();
				})
				.catch(function (error) {
					onScriptComplete(error)
				});

			function onScriptComplete(event) {
				progress.activeLoadCount -= 1;
				if (progress.activeLoadCount <= 0) {
					progress.totalSize = 0;
					progress.activeLoadCount = 0;
					progress.activeLoads = {};
				}
				clearTimeout(timeout);
				const chunk = installedChunks[chunkId];
				if (chunk !== 0) {
					if (chunk) {
						const errorType = event && (event.type === 'load' ? 'missing' : event.type);
						const realSrc = event && event.target && event.target.src;
						const error = new Error('Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')');
						error.type = errorType;
						error.request = realSrc;
						chunk[1](error);
					}
					installedChunks[chunkId] = undefined;
				}
			}
		}
	}
	// chunk-progress-webpack-plugin replace-require-ensure end
}
