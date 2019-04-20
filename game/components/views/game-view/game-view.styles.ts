import { createStyles, Theme } from '@material-ui/core';

export const styles = (theme: Theme) =>
	createStyles({
		root: {
			maxWidth: theme.layout.container.width,
			margin: '24px auto 24px',
			padding: '16px',
		},
		actionbar: {
			margin: '24px 0',
			padding: '24px',
		},
		consequences: {
			margin: '24px 0',
			padding: '16px',
		},
		resource: {
			alignSelf: 'start',
			padding: '4px',
		},
		negative: {
			color: '#c70000',
		},
		positive: {
			color: '#00c700',
		},
		box: {
			padding: '16px',
		},
	});
