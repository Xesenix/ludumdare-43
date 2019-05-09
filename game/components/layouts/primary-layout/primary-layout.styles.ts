import { createStyles, Theme } from '@material-ui/core';

import { IAppTheme } from 'theme';

export const styles = (theme: Theme) => {
	const appTheme: IAppTheme = theme as IAppTheme;
	return createStyles({
		root: {
			minHeight: '600px',
			padding: '64px 0 24px',
			position: 'relative',
			...appTheme.layout.primary.root,
		},
	});
};
