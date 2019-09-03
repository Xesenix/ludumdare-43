import { interfaces } from 'inversify';
import { Store } from 'redux';

import { ICreateSetAction, IEventEmitter } from 'lib/interfaces';

import { IRandomGenerator } from 'lib/random-generator/interface';
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

			container.bind<IEventEmitter>('game:event-manager')
				.toConstantValue(em);

			container.bind<DataStore<IGameState>>('game:data-store')
				.to(DataStore)
				.inSingletonScope();

			container.bind<IRandomGenerator<number>>('game:rng-service')
				.toConstantValue(container.get<IRandomGenerator<number>>('random-generator:random-number-service'));

			container.bind<Game>('game').to(Game).inSingletonScope();
		});
}
