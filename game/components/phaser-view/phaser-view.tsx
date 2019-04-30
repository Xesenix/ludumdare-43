import { withStyles, WithStyles } from '@material-ui/core';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

import { connectToInjector } from 'lib/di';
import { IUIState } from 'lib/ui';

import { IPhaserGameProvider } from 'phaser/game.provider';

import { styles } from './phaser-view.styles';

let game: Phaser.Game | null;
let gameContainer: HTMLDivElement | null;

/** Component public properties required to be provided by parent component. */
export interface IPhaserViewExternalProps {
	keepInstanceOnRemove: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IPhaserViewInternalProps {
	di?: Container;
	store?: Store<IUIState>;
}

/** Internal component state. */
interface IPhaserViewState {}

const diDecorator = connectToInjector<IPhaserViewExternalProps, IPhaserViewInternalProps>({
	store: {
		dependencies: ['data-store'],
	},
});

type IPhaserViewProps = IPhaserViewExternalProps & IPhaserViewInternalProps & WithStyles<typeof styles>;

class PhaserViewComponent extends React.PureComponent<IPhaserViewProps, IPhaserViewState> {
	private unsubscribe?: any;

	constructor(props) {
		super(props);
		this.state = {};
	}

	public componentDidMount(): void {
		const { di } = this.props;

		if (!!di && !!gameContainer) {
			di.bind<HTMLElement | null>('phaser:container').toDynamicValue(() => gameContainer);
			di.get<IPhaserGameProvider>('phaser:game-provider')().then((result: Phaser.Game) => {
				game = result;
			});
		}

		this.bindToStore();
	}

	public componentDidUpdate(): void {
		this.bindToStore();
	}

	public componentWillUnmount(): void {
		const { di } = this.props;

		if (this.unsubscribe) {
			this.unsubscribe();
		}

		if (!!gameContainer) {
			if (!!game) {
				gameContainer.removeChild(game.canvas);
			}
			gameContainer = null;
		}

		if (!!di) {
			di.unbind('phaser:container');
		}
	}

	public render(): any {
		const { classes } = this.props;

		return (
			<>
				<div className={classes.root} ref={this.bindContainer} />
			</>
		);
	}

	/**
	 * Responsible for notifying component about state changes related to this component.
	 * If global state changes for keys defined in this component state it will transfer global state to components internal state.
	 */
	private bindToStore(): void {
		const { store } = this.props;

		if (!this.unsubscribe && store) {
			this.unsubscribe = store.subscribe(() => {
				if (store) {
					this.setState(store.getState());
				}
			});
			this.setState(store.getState());
		}
	}

	private bindContainer = (el: HTMLDivElement): void => {
		gameContainer = el;
	}
}

export default hot(module)(withStyles(styles)(diDecorator(PhaserViewComponent)));
