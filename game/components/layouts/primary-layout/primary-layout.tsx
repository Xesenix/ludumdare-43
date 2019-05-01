import { withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di/context';

// elements
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
// icons
import MenuIcon from '@material-ui/icons/Menu';

import DrawerMenuButton from 'components/core/drawer-menu-button';
import TopMenuButton from 'components/core/top-menu-button';

import { IMenuExternalProps } from 'menu/menu';

import { styles } from './primary-layout.styles';

/** Component public properties required to be provided by parent component. */
export interface IPrimaryLayoutExternalProps {
	content: any;
	Menu: React.ComponentType<IMenuExternalProps>;
	loading: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IPrimaryLayoutInternalProps {
}

/** Internal component state. */
interface IPrimaryLayoutState {
	drawer: boolean;
}

const diDecorator = connectToInjector<IPrimaryLayoutExternalProps, IPrimaryLayoutInternalProps>({
});

type IPrimaryLayoutProps = IPrimaryLayoutExternalProps & IPrimaryLayoutInternalProps & WithStyles<typeof styles>;

class PrimaryLayoutComponent extends React.PureComponent<IPrimaryLayoutProps, IPrimaryLayoutState> {
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
			<Grid container spacing={0} alignItems="center">
				<Grid item xs={12}>
					<AppBar position="fixed">
						<Toolbar className={classes.topToolbar}>
							<Hidden smDown>
								<Menu
									key="menu"
									MenuItem={TopMenuButton}
								/>

							</Hidden>
							<Hidden mdUp>
								<TopMenuButton
									color="primary"
									onClick={this.toggleDrawer}
									variant="extended"
									Icon={MenuIcon}
								/>
							</Hidden>
						</Toolbar>
						{loading ? <LinearProgress/> : null}
					</AppBar>

					<Hidden mdUp>
						<Drawer
							anchor="left"
							onClose={this.toggleDrawer}
							open={this.state.drawer}
						>
							<Menu
								key="drawer-menu"
								MenuItem={DrawerMenuButton}
							/>
						</Drawer>
					</Hidden>
					<Paper className={classes.root} elevation={0}>
						{content}
					</Paper>
				</Grid>
			</Grid>
		);
	}

	private toggleDrawer = (): void => {
		this.setState({
			drawer: !this.state.drawer,
		});
	}
}

export default hot(module)(withStyles(styles)(diDecorator(PrimaryLayoutComponent)));
