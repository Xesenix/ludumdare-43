import { interfaces } from 'inversify';
import { Store } from 'redux';

import { ICreateSetAction, IEventEmitter } from 'lib/interfaces';

import { IRandomGenerator } from 'lib/random-generator/interface';
import { Game } from './game';
import { IGameState } from './game.interfaces';
import { DataStore } from './store';
import { BattleSystem } from './systems/battle';
import { ChildrenSystem } from './systems/children';
import { CottagesSystem } from './systems/cottages';
import { GuardsSystem } from './systems/guards';
import { IdlesSystem } from './systems/idles';
import { PopulationSystem } from './systems/population';
import { ResourcesSystem } from './systems/resources';
import { SacrificesSystem } from './systems/sacrifices';
import { StatsSystem } from './systems/stats';
import { WallsSystem } from './systems/walls';
import { WeaknessSystem } from './systems/weakness';
import { WorkersSystem } from './systems/workers';

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

			container.bind<BattleSystem>('game:system:battle')
				.to(BattleSystem)
				.inSingletonScope();

			container.bind<ChildrenSystem>('game:system:children')
				.to(ChildrenSystem)
				.inSingletonScope();

			container.bind<CottagesSystem>('game:system:cottages')
				.to(CottagesSystem)
				.inSingletonScope();

			container.bind<GuardsSystem>('game:system:guards')
				.to(GuardsSystem)
				.inSingletonScope();

			container.bind<IdlesSystem>('game:system:idles')
				.to(IdlesSystem)
				.inSingletonScope();

			container.bind<PopulationSystem>('game:system:population')
				.to(PopulationSystem)
				.inSingletonScope();

			container.bind<ResourcesSystem>('game:system:resources')
				.to(ResourcesSystem)
				.inSingletonScope();

			container.bind<SacrificesSystem>('game:system:sacrifices')
				.to(SacrificesSystem)
				.inSingletonScope();

			container.bind<StatsSystem>('game:system:statistics')
				.to(StatsSystem)
				.inSingletonScope();

			container.bind<WallsSystem>('game:system:walls')
				.to(WallsSystem)
				.inSingletonScope();

			container.bind<WeaknessSystem>('game:system:weakness')
				.to(WeaknessSystem)
				.inSingletonScope();

			container.bind<WorkersSystem>('game:system:workers')
				.to(WorkersSystem)
				.inSingletonScope();

			container.bind<Game>('game').to(Game).inSingletonScope();
		});
}
