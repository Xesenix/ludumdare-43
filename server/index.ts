import * as compression from 'compression';
import * as express from 'express';
import * as expressStaticGzip from 'express-static-gzip';
import * as fs from 'fs';
// import * as path from 'path';
// import * as spa from 'express-spa';

const app = process.env.APP;
const port = 8080;

const server = express();

server.use(compression());

const decompressedStats = {};
server.use(expressStaticGzip(`dist/${app}`, {
	/**
	 * Fix issue with downloading gziped content total progress missing on xhr request by adding additional
	 * x-decompressed-content-length header with size of full file as loaded values for xhr progress refere to
	 * content size after decompression.
	 */
	setHeaders(res, path, stat) {
		const decopressedPath = path.replace(/\.gz$/, '');

		if (!decompressedStats[decopressedPath]) {
			decompressedStats[decopressedPath] = fs.statSync(path.replace(/\.gz$/, ''));
		}
		// console.log(path, decompressedStats, stat);
		res.set('x-decompressed-content-length', decompressedStats[decopressedPath].size);
	},
} as any));

server.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
});
