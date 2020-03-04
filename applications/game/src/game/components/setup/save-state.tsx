import * as React from 'react';
import { hot } from 'react-hot-loader';

// elements
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

/** Component public properties required to be provided by parent component. */
export interface ISaveStateExternalProps {
	classes: { formControl: any };
}

/** Internal component properties include properties injected via dependency injection. */
interface ISaveStateInternalProps {
	__: II18nTranslation;
}

type ISaveStateProps = ISaveStateExternalProps & ISaveStateInternalProps;

const diDecorator = connectToInjector<ISaveStateExternalProps, ISaveStateInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

function SaveStateComponent(props: ISaveStateProps): any {
	const {
		// prettier-ignore
		__,
		classes,
	} = props;

	const valid = true;

	const saveData = 'SAVEDATA';

	return (
		<>
			<FormControl
				fullWidth
			>
				<TextField
					// prettier-ignore
					className={classes.formControl}
					defaultValue={saveData}
					error={!valid}
					fullWidth
					helperText={`VALID: ${valid ? 'TRUE' : 'FALSE'}`}
					label={__('save data')}
					multiline
					variant="outlined"
				/>
			</FormControl>
			<FormControl>
				<Button
					// prettier-ignore
					className={classes.formControl}
					color="default"
					variant="contained"
				>
					{__('Restore')}
				</Button>
			</FormControl>
		</>
	);
}

export default hot(module)(diDecorator(SaveStateComponent));
