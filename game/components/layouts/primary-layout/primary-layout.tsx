import { withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di/context';

// elements
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
// icons
import MenuIcon from '@material-ui/icons/Menu';

import { IMenuItemProps, IMenuProps } from 'menu/menu';

import { styles } from './primary-layout.styles';

/** Component public properties required to be provided by parent component. */
export interface IPrimaryLayoutProps {
	content: any;
	Menu: React.ComponentType<IMenuProps>;
	loading: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IPrimaryLayoutInternalProps {
}

/** Internal component state. */
interface IPrimaryLayoutState {
	drawer: boolean;
}

const diDecorator = connectToInjector<IPrimaryLayoutProps, IPrimaryLayoutInternalProps>({
});

class PrimaryLayoutComponent extends React.Component<IPrimaryLayoutProps & IPrimaryLayoutInternalProps & WithStyles<typeof styles>, IPrimaryLayoutState> {
	constructor(props) {
		super(props);
		this.state = {
			drawer: false,
		};
	}

	public render(): any {
		const {
			classes,
			content = null,
			Menu,
			loading = false,
		} = this.props;

		return (
			<Grid container spacing={0} alignItems="center">
				<Grid item xs={12}>
					<AppBar position="fixed">
						<Toolbar className={classes.toolbar}>
							<Hidden xsDown>
								<Menu
									key="menu"
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
							key="drawer-menu"
							MenuItem={this.renderTopMenuItem}
						/>
					</Drawer>
					<Paper className={classes.root} elevation={0}>

						{content}
					</Paper>
				</Grid>
			</Grid>
		);
	}

	private renderTopMenuItem = (props: IMenuItemProps) => {
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

export default hot(module)(withStyles(styles)(diDecorator(PrimaryLayoutComponent)));
