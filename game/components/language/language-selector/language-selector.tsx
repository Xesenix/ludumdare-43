import * as React from 'react';
import { hot } from 'react-hot-loader';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { LanguageType } from 'lib/interfaces';

import { ILanguageSelectorViewProps, languageDIDecorator } from '../decorator';

function LanguageSelectorComponent(props: ILanguageSelectorViewProps) {
	const {
		// prettier-ignore
		__,
		bindToStore,
		update,
	} = props;
	const { language } = bindToStore([
		// prettier-ignore
		'language',
	]);
	// tslint:disable:jsx-no-lambda
	return (
		<Select
			onChange={(event) => update(event.target.value as any as LanguageType)}
			value={language}
		>
			<MenuItem value={'en'}>{__('english')}</MenuItem>
			<MenuItem value={'pl'}>{__('polish')}</MenuItem>
		</Select>
	);
}

export default hot(module)(languageDIDecorator<{}>(LanguageSelectorComponent));
