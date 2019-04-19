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

import { styles } from './primary-layout.styles';

/** Component public properties required to be provided by parent component. */
export interface IPrimaryLayoutProps {
	content: any;
	menu: any;
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
			menu = null,
			loading = false,
		} = this.props;

		return (
			<Grid container spacing={0} alignItems="center">
				<Grid item xs={12}>
					<Paper className={classes.root} elevation={0}>
						<AppBar position="fixed">
							<Toolbar>
								<Hidden xsDown>{menu}</Hidden>
								<Hidden smUp>
									<Button color="primary" variant="extended" className={classes.button} onClick={this.toggleDrawer}>
										<MenuIcon />
									</Button>
								</Hidden>
							</Toolbar>
							{loading ? <LinearProgress /> : null}
						</AppBar>
						<Drawer anchor="left" open={this.state.drawer} onClose={this.toggleDrawer}>
							{menu}
						</Drawer>
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
