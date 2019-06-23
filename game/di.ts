import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'reflect-metadata';

import ReportContainerComponent from 'lib/di/component/report-container';

import { AppModule } from './app/app.module';

const app = new AppModule();

app.boot().then(() => {
	ReactDOM.render(
		React.createElement(ReportContainerComponent, { app }),
		document.getElementById('app'),
	);
});
