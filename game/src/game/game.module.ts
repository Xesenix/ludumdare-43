import { Reducer } from 'redux';

import { IApplication, ICreateSetAction } from 'lib/interfaces';

import { initialGameState } from '../../data/initial-state';

import { createSetGameStateAction } from './actions';
import { GameBootProvider } from './game-boot.provider';
import { IGameState } from './game.interfaces';
import { reducer } from './reducers';

export default class GameModule {
	public static register(app: IApplication) {
		app.bind('boot').toProvider(GameBootProvider);

		// redux action creators
		app.bind<ICreateSetAction<IGameState>>('data-store:action:create:set-game-state').toConstantValue(createSetGameStateAction);

		// add data store keys that should be persisted between page refresh
		app.bind<string>('data-store:persist:state').toConstantValue('game');

		// add reducer from this module
		app.bind<Reducer<any, any>>('data-store:reducers').toConstantValue(reducer);

		app.bind('game:initial-state').toConstantValue(initialGameState);
	}
}
