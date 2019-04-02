import { JsExtractors } from 'gettext-extractor';
import xesBdf from 'xes-webpack-core';

xesBdf.i18n.extract({
	getJsParser: (xi18n) =>
		xi18n.createJsParser([
			JsExtractors.callExpression('__', {
				arguments: {
					text: 0,
					context: 2,
				},
			}),
			JsExtractors.callExpression('_$', {
				arguments: {
					text: 1,
					textPlural: 2,
					context: 4,
				},
			}),
		]),
});
