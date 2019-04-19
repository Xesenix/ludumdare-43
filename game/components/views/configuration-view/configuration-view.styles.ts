import { createStyles, Theme } from '@material-ui/core';

export const styles = (theme: Theme) =>
	createStyles({
		root: {
			display: 'block',
			padding: '24px',
		},
		margin: {
			margin: theme.spacing.unit,
		},
		icon: {
			display: 'inline-flex',
			width: '48px',
			height: '48px',
			'justify-content': 'center',
			'align-items': 'center',
			color: theme.palette.text.primary,
		},
		scroll: {
			padding: '0 24px',
			height: '56px',
			display: 'inline-flex',
			alignItems: 'center',
			overflow: 'hidden',
			[theme.breakpoints.down('sm')]: {
				height: '28px',
			},
		},
		formControl: {
			margin: theme.spacing.unit,
			minWidth: 120,
		},
		section: {
			padding: '24px 0',
			maxWidth: '800px',
			margin: '0 auto',
		},
	});
