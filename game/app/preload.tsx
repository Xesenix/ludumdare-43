import * as React from 'react';
import { hot } from 'react-hot-loader';

function PreloadComponent({ loaded = 0, total = 0 }) {
	return (<div className="preload">
			<div className="content">
				<h1>Collecting tools</h1>
				<h2>Please wait while application is loading</h2>
				{ total > 0
					? <h3>{loaded} / {total}</h3>
					: null
				}
			</div>
		</div>
	);
}

export default hot(module)(PreloadComponent);
