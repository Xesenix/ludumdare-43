import { EventEmitter } from 'eventemitter3';
import produce, { createDraft, finishDraft } from 'immer';

import { IGameState } from 'game';
import { IEventEmitter } from 'lib/interfaces';

import { DataStore } from './../store';

import { GuardsSystem } from './guards';

const command = { train: { guards: 0, workers: 0 } };
const workers = { current: 0, killed: { current: 0, total: 0 } };
const guards = { current: 0, killed: { current: 0, total: 0 } };

describe('systems/guards', () => {
	describe('scheduleTraining', () => {
		it('should not break anything if there is no scheduled training', () => {
			const baseState: Partial<IGameState> = {
				command,
				idles: { current: 20, killed: { current: 0, total: 0 } },
				guards,
				workers,
				resources: {
					amount: 30,
					reserved: 15,
					used: { current: 131, total: 4 },
					stolen: { current: 0, total: 0 },
				},
			};

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: GuardsSystem = new GuardsSystem(dataStore);

			const draft = createDraft(baseState) as IGameState;
			const state = finishDraft(system.scheduleTraining(0, draft));

			expect(state).toEqual(baseState as IGameState, 'game state');
		});

		it('should scheduled training', () => {
			const amount = 5;
			const baseState: Partial<IGameState> = {
				command,
				idles: { current: 20, killed: { current: 0, total: 0 } },
				guards: { current: 3, killed: { current: 0, total: 0 } },
				workers,
				resources: {
					amount: 10,
					reserved: 5,
					used: { current: 31, total: 2 },
					stolen: { current: 0, total: 0 },
				},
			};

			const expectedState = createDraft(baseState) as IGameState;
			expectedState.command.train.guards += amount;
			expectedState.resources.reserved += amount;

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: GuardsSystem = new GuardsSystem(dataStore);

			const draft = createDraft(baseState) as IGameState;
			const state = finishDraft(system.scheduleTraining(amount, draft));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});

		it('should scheduled release', () => {
			const amount = -3;
			const baseState: Partial<IGameState> = {
				command: { train: { guards: 4, workers: 0 } },
				idles: { current: 20, killed: { current: 0, total: 0 } },
				guards: { current: 3, killed: { current: 0, total: 0 } },
				workers,
				resources: {
					amount: 10,
					reserved: 5,
					used: { current: 31, total: 54 },
					stolen: { current: 0, total: 0 },
				},
			};

			const expectedState = createDraft(baseState) as IGameState;
			expectedState.command.train.guards += amount;
			expectedState.resources.reserved += amount;

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: GuardsSystem = new GuardsSystem(dataStore);

			const draft = createDraft(baseState) as IGameState;
			const state = finishDraft(system.scheduleTraining(amount, draft));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});

		it('should scheduled conform min training capacity', () => {
			const amount = -23;
			const baseState: Partial<IGameState> = {
				command: { train: { guards: 4, workers: 0 } },
				idles: { current: 20, killed: { current: 0, total: 0 } },
				guards: { current: 3, killed: { current: 0, total: 0 } },
				workers,
				resources: {
					amount: 10,
					reserved: 5,
					used: { current: 31, total: 334 },
					stolen: { current: 0, total: 0 },
				},
			};

			const expectedState = createDraft(baseState) as IGameState;
			expectedState.command.train.guards = -3;
			expectedState.resources.reserved = 1;

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: GuardsSystem = new GuardsSystem(dataStore);

			const draft = createDraft(baseState) as IGameState;
			const state = finishDraft(system.scheduleTraining(amount, draft));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});

		it('should scheduled conform max training capacity', () => {
			const amount = 23;
			const baseState: Partial<IGameState> = {
				command: { train: { guards: 4, workers: 0 } },
				idles: { current: 20, killed: { current: 0, total: 0 } },
				guards: { current: 3, killed: { current: 0, total: 0 } },
				workers,
				resources: {
					amount: 30,
					reserved: 5,
					used: { current: 31, total: 0 },
					stolen: { current: 0, total: 0 },
				},
			};

			const expectedState = createDraft(baseState) as IGameState;
			expectedState.command.train.guards = 20;
			expectedState.resources.reserved = 21;

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: GuardsSystem = new GuardsSystem(dataStore);

			const draft = createDraft(baseState) as IGameState;
			const state = finishDraft(system.scheduleTraining(amount, draft));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});

		it('should scheduled conform max training resource amount', () => {
			const amount = 23;
			const baseState: Partial<IGameState> = {
				command: { train: { guards: 4, workers: 0 } },
				idles: { current: 20, killed: { current: 0, total: 0 } },
				guards: { current: 3, killed: { current: 0, total: 0 } },
				workers,
				resources: {
					amount: 10,
					reserved: 5,
					used: { current: 31, total: 345 },
					stolen: { current: 0, total: 0 },
				},
			};

			const expectedState = createDraft(baseState) as IGameState;
			expectedState.command.train.guards = 9;
			expectedState.resources.reserved = 10;

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: GuardsSystem = new GuardsSystem(dataStore);

			const draft = createDraft(baseState) as IGameState;
			const state = finishDraft(system.scheduleTraining(amount, draft));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});
	});

	describe('trainRule', () => {
		it('should not break anything if there is no scheduled training', () => {
			const baseState: Partial<IGameState> = {
				command,
				idles: {
					current: 120,
					killed: { current: 0, total: 0 },
				},
				guards: {
					current: 20,
					killed: { current: 0, total: 0 },
				},
				workers,
				resources: {
					amount: 120,
					reserved: 25,
					used: { current: 51, total: 654 },
					stolen: { current: 0, total: 0 },
				},
			};

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: GuardsSystem = new GuardsSystem(dataStore);

			const state = produce(baseState as IGameState, system.trainRule);

			expect(state).toEqual(baseState as IGameState, 'game state');
		});

		it('should perform scheduled guards training', () => {
			const amount = 4;
			const baseState: Partial<IGameState> = {
				command,
				idles: {
					current: 20,
					killed: { current: 0, total: 0 },
				},
				guards: {
					current: 3,
					killed: { current: 0, total: 0 },
				},
				workers,
				resources: {
					amount: 10,
					reserved: 5,
					used: { current: 31, total: 123 },
					stolen: { current: 0, total: 0 },
				},
			};
			const expectedState = createDraft(baseState) as IGameState;
			expectedState.idles.current -= amount;
			expectedState.guards.current += amount;
			expectedState.resources.amount -= amount;
			expectedState.resources.used.current += amount;
			expectedState.resources.used.total += amount;

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: GuardsSystem = new GuardsSystem(dataStore);

			// schedule training
			const draft = createDraft(baseState) as IGameState;
			system.scheduleTraining(amount, draft);

			const state = finishDraft(system.trainRule(draft));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});

		it('should perform scheduled guards release', () => {
			const amount = -3;
			const baseState: Partial<IGameState> = {
				command,
				idles: {
					current: 20,
					killed: { current: 0, total: 0 },
				},
				guards: {
					current: 3,
					killed: { current: 0, total: 0 },
				},
				workers,
				resources: {
					amount: 10,
					reserved: 5,
					used: { current: 31, total: 33 },
					stolen: { current: 0, total: 0 },
				},
			};
			const expectedState = createDraft(baseState) as IGameState;
			expectedState.idles.current -= amount;
			expectedState.guards.current += amount;

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: GuardsSystem = new GuardsSystem(dataStore);

			// schedule training
			const draft = createDraft(baseState) as IGameState;
			system.scheduleTraining(amount, draft);

			const state = finishDraft(system.trainRule(draft));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});
	});
});
