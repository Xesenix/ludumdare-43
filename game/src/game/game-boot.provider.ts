import { interfaces } from 'inversify';
import { Store } from 'redux';

import { ICreateSetAction, IEventEmitter } from 'lib/interfaces';

import { initialGameState } from '../../data/initial-state';

import { Game } from './game';
import { IGameState } from './game.interfaces';
import { DataStore } from './store';

export function GameBootProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	console.debug('GameBootProvider');

	return () => container.get<() => Promise<Store<IGameState>>>('data-store:provider')()
		.then((store: Store<IGameState>) => {
			console.debug('GameBootProvider:boot');
			const createSetGameStateAction = container.get<ICreateSetAction<IGameState>>('data-store:action:create:set-game-state');

			container.bind('game:actions')
				.toConstantValue((value: IGameState) => store.dispatch(createSetGameStateAction(value)))
				.whenTargetNamed('setGameStateAction');

			const em = container.get<IEventEmitter>('event-manager');
			// one way binding game state to redux store
			em.on('state:update', (newState: IGameState) => {
				store.dispatch(createSetGameStateAction(newState));
			});

			const dataStore = new DataStore<IGameState>({} as any, em);
			const game = new Game(initialGameState, dataStore);

			container.bind<Game>('game').toConstantValue(game);
		});
}
