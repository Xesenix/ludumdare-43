import { createStyles, Theme } from '@material-ui/core';

const title = {
	padding: '12px',
	borderRadius: '0',
	textAlign: 'center' as 'center', // if its not casted it complains about beeing type string
};

export const styles = (theme: Theme) =>
	createStyles({
		attackTitle: {
			...title,
			textTransform: 'capitalize',
			color: theme.palette.primary.contrastText,
			backgroundColor: theme.palette.primary.dark,
		},
		sacrificeTitle: {
			...title,
			color: theme.palette.secondary.contrastText,
			backgroundColor: theme.palette.secondary.dark,
		},
		attackContainer: {
			padding: '12px',
			borderRadius: '0',
			background: theme.palette.primary.main,
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
		sacrifice: {
			color: theme.palette.secondary.contrastText,
			backgroundColor: theme.palette.secondary.main,
		},
	});
