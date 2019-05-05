import { createStyles, Theme } from '@material-ui/core';

const changeLabel = {
	display: 'inline',
	alignSelf: 'center',
	marginLeft: '8px',
};

export const styles = (theme: Theme) =>
	createStyles({
		root: {
			background: 'transparent !important',
			position: 'relative',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-end',
			margin: '0 12px',
			flexGrow: 1,
			padding: `12px`,
		},
		description: {
			margin: '0 auto 12px',
			flexGrow: 1,
		},
		unitLabel: {},
		unitNameLabel: {},
		unitAmountLabel: {
			display: 'flex',
			justifyContent: 'center',
		},
		unitPositiveChangeLabel: {
			...changeLabel,
			color: '#00c700',
		},
		unitNegativeChangeLabel: {
			...changeLabel,
			color: '#c70000',
		},
	});
