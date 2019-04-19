import { createStyles, Theme } from '@material-ui/core';

export const styles = (theme: Theme) =>
	createStyles({
		button: {
			margin: theme.spacing.unit,
		},
		extendedIcon: {
			marginRight: theme.spacing.unit,
		},
	});
