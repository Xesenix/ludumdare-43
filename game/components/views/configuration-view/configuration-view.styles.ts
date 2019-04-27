import { createStyles, Theme } from '@material-ui/core';

import { IAppTheme } from 'theme';

export const styles = (theme: Theme) => {
	const appTheme: IAppTheme = theme as IAppTheme;
	return createStyles({
		root: {
			display: 'block',
			padding: '24px',
		},
		margin: {
			margin: appTheme.spacing.unit,
		},
		icon: {
			display: 'inline-flex',
			width: '48px',
			height: '48px',
			'justify-content': 'center',
			'align-items': 'center',
			color: appTheme.palette.text.primary,
		},
		scroll: {
			padding: '0 24px',
			height: '56px',
			display: 'inline-flex',
			alignItems: 'center',
			overflow: 'hidden',
			[appTheme.breakpoints.down('sm')]: {
				height: '28px',
			},
		},
		formControl: {
			margin: appTheme.spacing.unit,
			minWidth: 120,
		},
		section: {
			padding: '24px 0',
			maxWidth: appTheme.layout.container.width,
			margin: '0 auto',
		},
	});
};
