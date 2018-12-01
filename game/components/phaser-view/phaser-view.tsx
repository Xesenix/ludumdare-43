import { withStyles, WithStyles } from '@material-ui/core';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

import { connectToInjector } from 'lib/di';
import { IUIState } from 'lib/ui';

import { IPhaserGameProvider } from '../../src/phaser/game.provider';
import GameUIComponent from '../game-ui/game-ui';

import { styles } from './phaser-view.styles';

let game: Phaser.Game | null;
let gameContainer: HTMLDivElement | null;

export interface IPhaserViewProps {
	di?: Container;
	store?: Store<IUIState>;
	keepInstanceOnRemove: boolean;
}

const diDecorator = connectToInjector<IPhaserViewProps>({
	store: {
		dependencies: ['data-store'],
	},
});

export interface IPhaserViewState {}

class PhaserViewComponent extends React.PureComponent<IPhaserViewProps & WithStyles<typeof styles>, IPhaserViewState> {
	private unsubscribe?: any;

	constructor(props) {
		super(props);
		this.state = {};
	}

	public componentDidMount(): void {
		const { di } = this.props;

		if (!!di && gameContainer) {
			if (game && game.isBooted) {
				gameContainer.appendChild(game.canvas);
			} else {
				di.bind<HTMLElement | null>('phaser:container').toDynamicValue(() => gameContainer);
				di.get<IPhaserGameProvider>('phaser:game-provider')().then((result: Phaser.Game) => (game = result));
			}
		}

		this.bindToStore();
	}

	public componentDidUpdate(): void {
		this.bindToStore();
	}

	public componentWillUnmount(): void {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}

	public render(): any {
		const { classes } = this.props;

		return (<>
			<div className={classes.root} ref={this.bindContainer} />
			<GameUIComponent></GameUIComponent>
		</>);
	}

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

export default hot(module)(diDecorator(withStyles(styles)(PhaserViewComponent)));
