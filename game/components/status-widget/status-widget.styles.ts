import { Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			padding: '12px',
			margin: '12px',
		},
		population: {
			width: '240px',
			textAlign: 'right',
			order: 3,
			[theme.breakpoints.down('xs')]: {
				textAlign: 'center',
				justifyItems: 'center',
			},
		},
		populationAmountLabel: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-end',
			alignItems: 'baseline',
			[theme.breakpoints.down('xs')]: {
				justifyContent: 'center',
			},
		},
		resources: {
			width: '160px',
			textAlign: 'left',
			order: 1,
			[theme.breakpoints.down('xs')]: {
				textAlign: 'center',
			},
		},
		resourcesAmountLabel: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'baseline',
			[theme.breakpoints.down('xs')]: {
				justifyContent: 'center',
			},
		},
		year: {
			order: 2,
			textAlign: 'center',
			[theme.breakpoints.down('xs')]: {
				padding: '0 24px 24px',
				order: 0,
			},
		},
		positiveChangeLabel: {
			color: '#00c700',
		},
		negativeChangeLabel: {
			color: '#c70000',
		},
	});
