import { createStyles, Theme } from '@material-ui/core';

export const styles = (theme: Theme) =>
	createStyles({
		root: {
			padding: '12px',
		},
		item: {
			padding: '8px',
		},
		negative: {
			color: '#c70000',
		},
		positive: {
			color: '#00c700',
		},
	});
