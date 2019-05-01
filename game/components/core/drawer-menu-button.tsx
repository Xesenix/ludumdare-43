import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { hot } from 'react-hot-loader';

// elements
import Fab from '@material-ui/core/Fab';

import { IMenuItemExternalProps } from 'menu/menu';
import { IAppTheme } from 'theme';

export const styles = (theme: Theme) => {
	const appTheme: IAppTheme = theme as IAppTheme;
	console.log('DrawerMenuButton:styles');
	return createStyles({
		root: {},
	});
};

const DrawerMenuButton = React.forwardRef((props: IMenuItemExternalProps & WithStyles < typeof styles > , ref) => {
	const Icon = props.active && props.ActiveIcon ? props.ActiveIcon : props.Icon ? props.Icon : null;

	return (
		<Fab
			classes={props.classes}
			color={props.active && props.activeColor ? props.activeColor : props.color}
			component={props.component as any}
			onClick={props.onClick}
			ref={ref}
			variant="extended"
		>
			{Icon ? <Icon/> : null}
			{props.label}
		</Fab>
	);
});

export default hot(module)(withStyles(styles, { name: 'DrawerMenuButton' })(DrawerMenuButton));
