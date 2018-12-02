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
		label: {

		},
		actions: {
			display: 'flex',
			justifyContent: 'space-between',
			backgroundColor: theme.palette.primary.main,
			borderRadius: '16px',
		},
		actionLabelContainer: {
			display: 'flex',
			flexDirection: 'row',
			alignSelf: 'center',
			alignItems: 'center',
		},
		actionLabel: {
			color: theme.palette.primary.contrastText,
			margin: '0 8px',
		},
		actionButton: {
			margin: '-8px',
		},
	});
