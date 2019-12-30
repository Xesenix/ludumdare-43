import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { IAppTheme } from 'theme';

export const useStyles = makeStyles((theme: Theme) => {
	const appTheme: IAppTheme = theme as IAppTheme;

	return createStyles({
		root: {
			...appTheme.layout.container.wrapper,
		},
		formControl: {
			margin: '4px',
		},
	});
});
