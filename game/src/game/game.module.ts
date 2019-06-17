import { interfaces } from 'inversify';
import { Reducer, Store } from 'redux';

import { IApplication, ICreateSetAction, IEventEmitter } from 'lib/interfaces';

import { initialGameState } from '../../data/initial-state';

import { Game } from './game';
import { IGameState } from './game.interfaces';
import { DataStore } from './store';

const createSetGameStateAction = (value: IGameState) => ({
	type: 'GAME_STATE_UPDATE',
	value,
});


export class GameModule {
	public static register(app: IApplication) {
		app.bind('boot').toProvider(({ container }: interfaces.Context) => {
			return () => container.get<() => Promise<Store<any, any>>>('data-store:provider')()
				.then((store: Store<any, any>) => {
					const em = container.get<IEventEmitter>('event-manager');
					// one way binding game state to redux store
					em.on('state:update', (newState) => {
						store.dispatch(createSetGameStateAction(newState));
					});

					const dataStore = new DataStore<IGameState>({} as any, em);
					const game = new Game(initialGameState, dataStore);

					app.bind<Game>('game').toConstantValue(game);
				});
		});

		// redux action creators
		app.bind<ICreateSetAction<IGameState>>('game:action:create:set-game-state').toConstantValue(createSetGameStateAction);

		// add data store keys that should be persisted between page refresh
		app.bind<string>('data-store:persist:state').toConstantValue('game');

		// add reducer from this module
		app.bind<Reducer<any, any>>('data-store:reducers').toConstantValue((state, action) => {
			if (action.type === 'GAME_STATE_UPDATE') {
				state.game = action.value;
			}
			return state;
		});
	}
}
