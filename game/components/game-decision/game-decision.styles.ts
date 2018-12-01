import { Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) =>
	createStyles({
		root: {
			'max-width': '800px',
			'margin': '24px auto 24px',
			'padding': '16px',
		},
		actionbar: {
			'margin': '24px 0',
			'padding': '16px',
		},
		consequences: {
			'margin': '24px 0',
			'padding': '16px',
		},
		resource: {
			'align-self': 'start',
			'padding': '4px',
		},
		negative: {
			color: '#c70000',
		},
		positive: {
			color: '#00c700',
		},
		box: {
			'padding': '16px',
		},
	});
