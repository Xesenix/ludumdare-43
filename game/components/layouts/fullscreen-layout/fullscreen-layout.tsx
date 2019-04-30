import { withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di/context';

// elements
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
// icons
import MenuIcon from '@material-ui/icons/Menu';

import { IMenuExternalProps, IMenuItemExternalProps } from 'menu/menu';

import { styles } from './fullscreen-layout.styles';

/** Component public properties required to be provided by parent component. */
export interface IFullscreenLayoutExternalProps {
	content: any;
	Menu: React.ComponentType<IMenuExternalProps>;
	loading: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IFullscreenLayoutInternalProps {
}

/** Internal component state. */
interface IFullscreenLayoutState {
	drawer: boolean;
}

const diDecorator = connectToInjector<IFullscreenLayoutExternalProps, IFullscreenLayoutInternalProps>({
});

type IFullscreenLayoutProps = IFullscreenLayoutExternalProps & IFullscreenLayoutInternalProps & WithStyles<typeof styles>;

class FullscreenLayoutComponent extends React.Component<IFullscreenLayoutProps, IFullscreenLayoutState> {
	constructor(props) {
		super(props);
		this.state = {
			drawer: false,
		};
	}

	public render(): any {
		const {
			// prettier-ignore
			classes,
			content = null,
			loading = false,
			Menu,
		} = this.props;

		return (
			<Paper className={classes.root} elevation={0}>
				<AppBar position="fixed">
					<Toolbar>
						<Hidden xsDown>
							<Menu
								key="fullscreen-menu"
								MenuItem={this.renderTopMenuItem}
							/>
						</Hidden>
						<Hidden smUp>
							<Fab
								className={classes.button}
								color="primary"
								onClick={this.toggleDrawer}
								variant="extended"
							>
								<MenuIcon/>
							</Fab>
						</Hidden>
					</Toolbar>
					{loading ? <LinearProgress/> : null}
				</AppBar>
				<Drawer
					anchor="left"
					onClose={this.toggleDrawer}
					open={this.state.drawer}
				>
					<Menu
						key="fullscreen-drawer-menu"
						MenuItem={this.renderTopMenuItem}
					/>
				</Drawer>
				{content}
			</Paper>
		);
	}

	private renderTopMenuItem = (props: IMenuItemExternalProps) => {
		const Icon = props.active && props.ActiveIcon ? props.ActiveIcon : props.Icon ? props.Icon : null;
		return (
			<Fab
				color={props.active && props.activeColor ? props.activeColor : props.color}
				onClick={props.onClick}
				component={props.component as any}
				variant="extended"
			>
				{Icon ? <Icon/> : null}
				{props.label}
			</Fab>
		);
	}

	private toggleDrawer = (): void => {
		this.setState({
			drawer: !this.state.drawer,
		});
	}
}

export default hot(module)(withStyles(styles)(diDecorator(FullscreenLayoutComponent)));
