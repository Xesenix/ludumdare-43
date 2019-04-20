import { withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di/context';

// elements
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
// icons
import MenuIcon from '@material-ui/icons/Menu';

import { styles } from './fullscreen-layout.styles';

/** Component public properties required to be provided by parent component. */
export interface IFullscreenLayoutProps {
	content: any;
	menu: any;
	loading: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IFullscreenLayoutInternalProps {
}

/** Internal component state. */
interface IFullscreenLayoutState {
	drawer: boolean;
}

const diDecorator = connectToInjector<IFullscreenLayoutProps, IFullscreenLayoutInternalProps>({
});

class FullscreenLayoutComponent extends React.Component<IFullscreenLayoutProps & IFullscreenLayoutInternalProps & WithStyles<typeof styles>, IFullscreenLayoutState> {
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
			menu = null,
			loading = false,
		} = this.props;

		return (
			<Paper className={classes.root} elevation={0}>
				<AppBar position="fixed">
					<Toolbar>
						<Hidden xsDown>{menu}</Hidden>
						<Hidden smUp>
							<Button
								className={classes.button}
								color="primary"
								onClick={this.toggleDrawer}
								variant="extendedFab"
							>
								<MenuIcon/>
							</Button>
						</Hidden>
					</Toolbar>
					{loading ? <LinearProgress/> : null}
				</AppBar>
				<Drawer
					anchor="left"
					onClose={this.toggleDrawer}
					open={this.state.drawer}
				>
					{menu}
				</Drawer>
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
