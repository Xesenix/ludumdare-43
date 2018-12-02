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
			width: '160px',
		},
		resources: {
			width: '160px',
		},
		year: {
			flexGrow: 1,
		},
	});
