import { withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di/context';

// elements
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
// icons
import MenuIcon from '@material-ui/icons/Menu';

import DrawerMenuButton from 'components/core/drawer-menu-button';
import TopMenuButton from 'components/core/top-menu-button';

import { IMenuExternalProps } from 'menu/menu';

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
					<Toolbar className={classes.topToolbar}>
						<Hidden smDown>
							<Menu
								key="fullscreen-menu"
								MenuItem={TopMenuButton}
							/>
						</Hidden>
						<Hidden mdUp>
							<TopMenuButton
								className={classes.topMenuButton}
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
							key="fullscreen-drawer-menu"
							MenuItem={DrawerMenuButton}
						/>
					</Drawer>
				</Hidden>
				{content}
			</Paper>
		);
	}

	private toggleDrawer = (): void => {
		this.setState({
			drawer: !this.state.drawer,
		});
	}
}

export default hot(module)(withStyles(styles)(diDecorator(FullscreenLayoutComponent)));
