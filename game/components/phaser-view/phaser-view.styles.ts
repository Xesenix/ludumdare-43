import { createStyles, Theme } from '@material-ui/core';

export const styles = (theme: Theme) =>
	createStyles({
		root: {
			minHeight: '300px',
			padding: '0',
			display: 'flex',
			justifyContent: 'center',
			backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey['900'] : theme.palette.grey['500'],
		},
	});
