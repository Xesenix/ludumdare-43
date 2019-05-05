import { createStyles } from '@material-ui/core';

import { IAppTheme } from 'theme';

export const styles = (theme: IAppTheme) => {
	return createStyles({
		root: {
			minHeight: '600px',
			padding: '64px 0 24px',
			...theme.layout.fullscreen.root,
		},
	});
};
