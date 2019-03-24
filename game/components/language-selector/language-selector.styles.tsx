import { createStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';

export const styles = (theme: Theme) =>
	createStyles({
		formControl: {
			margin: theme.spacing.unit,
			minWidth: 120,
		},
	});
