import { withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

import { connectToInjector } from 'lib/di/context';
import { filterByKeys } from 'lib/utils/filter-keys';
import { IMenuExternalProps } from 'menu/menu';

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

import { styles } from './fullscreen-layout.styles';

/** Component public properties required to be provided by parent component. */
export interface IFullscreenLayoutExternalProps {
	content: any;
	Menu: React.ComponentType<IMenuExternalProps>;
	loading: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IFullscreenLayoutInternalProps {
	dispatchSetDrawerOpenAction: (value: boolean) => void;
	store: Store<IFullscreenLayoutState>;
}

/** Internal component state. */
interface IFullscreenLayoutState {
	drawerOpen: boolean;
}

const diDecorator = connectToInjector<IFullscreenLayoutExternalProps, IFullscreenLayoutInternalProps>({
	dispatchSetDrawerOpenAction: {
		dependencies: ['ui:actions@setDrawerOpen'],
		value: (setDrawerOpen: (value: boolean) => void) => Promise.resolve(setDrawerOpen),
	},
	store: {
		dependencies: ['data-store'],
	},
});

type IFullscreenLayoutProps = IFullscreenLayoutExternalProps & IFullscreenLayoutInternalProps & WithStyles<typeof styles>;

class FullscreenLayoutComponent extends React.Component<IFullscreenLayoutProps, IFullscreenLayoutState> {
	private unsubscribeDataStore?: any;

	private filter = filterByKeys<IFullscreenLayoutState>([
		// prettier-ignore
		'drawerOpen',
	]);


	constructor(props) {
		super(props);

		this.state = this.filter(props.store.getState());
	}

	public componentDidMount(): void {
		this.bindToStore();
	}

	public componentDidUpdate(): void {
		this.bindToStore();
	}

	public componentWillUnmount(): void {
		if (this.unsubscribeDataStore) {
			this.unsubscribeDataStore();
			this.unsubscribeDataStore = null;
		}
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
						<Hidden smDown>
							<Menu
								key="fullscreen-menu"
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
						open={this.state.drawerOpen}
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
		const { dispatchSetDrawerOpenAction } = this.props;
		const { drawerOpen } = this.state;
		dispatchSetDrawerOpenAction(!drawerOpen);
	}

	/**
	 * Responsible for notifying component about state changes related to this component.
	 * If global state changes for keys defined in this component state it will transfer global state to components internal state.
	 */
	private bindToStore(): void {
		const { store } = this.props;

		if (!this.unsubscribeDataStore && !!store) {
			this.unsubscribeDataStore = store.subscribe(() => {
				if (!!store && !!this.unsubscribeDataStore) {
					this.setState(this.filter(store.getState()));
				}
			});
			this.setState(this.filter(store.getState()));
		}
	}
}

export default hot(module)(withStyles(styles)(diDecorator(FullscreenLayoutComponent)));
