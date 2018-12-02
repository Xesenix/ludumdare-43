import { Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) =>
	createStyles({
		root: {
			position: 'relative',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-end',
			minWidth: '260px',
			margin: '0 12px',
		},
		description: {
			margin: '0 auto 12px',
			flexGrow: 1,
		},
		unit: {
			display: 'flex',
			flexGrow: 1,
			padding: `12px`,
			margin: '0 auto 24px',
			flexDirection: 'column',
			justifyContent: 'flex-end',
		},
		unitNameLabel: {

		},
		unitAmountLabel: {

		},
		actions: {
			display: 'flex',
			justifyContent: 'space-between',
			backgroundColor: theme.palette.primary.main,
			borderRadius: '16px',
		},
		actionLabel: {
			color: theme.palette.primary.contrastText,
			alignSelf: 'center',
		},
		actionButton: {
			margin: '-8px',
		},
	});
