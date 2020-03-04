import { createStyles, makeStyles, Theme } from '@material-ui/core';

import { IAppTheme } from 'theme';

export const styles = (theme: Theme) => {
	const appTheme: IAppTheme = theme as IAppTheme;

	return createStyles({
		root: {
			margin: '0 auto',
			padding: '16px',
			...appTheme.layout.container.wrapper,
		},
		actionbar: {
			margin: '24px 0',
			padding: '24px',
		},
		consequences: {
			margin: '24px 0',
			padding: '16px',
		},
		resource: {
			alignSelf: 'start',
			padding: '4px',
		},
		negative: {
			color: '#c70000',
		},
		positive: {
			color: '#00c700',
		},
		box: {
			padding: '16px',
		},
	});
};

export const useStyles = makeStyles((theme: Theme) => {
	const appTheme: IAppTheme = theme as IAppTheme;

	return createStyles({
		root: {
			margin: '0 auto',
			padding: '16px',
			...appTheme.layout.container.wrapper,
		},
	});
});
