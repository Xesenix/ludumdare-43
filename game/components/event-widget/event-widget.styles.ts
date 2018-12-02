import { Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) =>
	createStyles({
		attackTitle: {
			padding: '12px',
			borderRadius: '0',
			color: theme.palette.primary.contrastText,
			backgroundColor: theme.palette.primary.dark,
			textTransform: 'capitalize',
			textAlign: 'center',
		},
		attackContainer: {
			padding: '12px',
			borderRadius: '0',
			backgroundColor: theme.palette.primary.main,
		},
		powerContainer: {
			order: 0,
			[theme.breakpoints.down('xs')]: {
				marginTop: '12px',
				order: 2,
				textAlign: 'center',
			},
		},
		consequencesContainer: {
			order: 1,
		},
		label: {
			color: theme.palette.primary.contrastText,
			textAlign: 'center',
		},
		amountDescription: {
			color: theme.palette.primary.contrastText,
			textAlign: 'center',
		},
		powerDescription: {
			color: theme.palette.primary.contrastText,
		},
		sacrafice: {
			color: theme.palette.secondary.contrastText,
			backgroundColor: theme.palette.secondary.main,
		},
	});
