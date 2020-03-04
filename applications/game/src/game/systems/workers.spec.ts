import { EventEmitter } from 'eventemitter3';
import produce, { createDraft, finishDraft } from 'immer';

import { IGameState } from 'game';
import { IEventEmitter } from 'lib/interfaces';

import { DataStore } from './../store';

import { WorkersSystem } from './workers';

const command = { train: { guards: 0, workers: 0 } };
const workers = { current: 0, killed: { current: 0, total: 0 } };
const guards = { current: 0, killed: { current: 0, total: 0 } };

describe('systems/workers', () => {
	describe('scheduleTraining', () => {
		it('should not break anything if there is no scheduled training', () => {
			const baseState: Partial<IGameState> = {
				idles: { current: 20, killed: { current: 0, total: 0 } },
				command,
				workers,
				guards,
			};

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: WorkersSystem = new WorkersSystem(dataStore);

			const draft = createDraft(baseState) as IGameState;
			const state = finishDraft(system.scheduleTraining(0, draft));

			expect(state).toEqual(baseState as IGameState, 'game state');
		});

		it('should scheduled training', () => {
			const amount = 5;
			const baseState: Partial<IGameState> = {
				command: { train: { guards: 0, workers: 4, } },
				idles: { current: 20, killed: { current: 0, total: 0 } },
				workers: { current: 3, killed: { current: 0, total: 0 } },
				guards,
			};

			const expectedState = createDraft(baseState) as IGameState;
			expectedState.command.train.workers += amount;

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: WorkersSystem = new WorkersSystem(dataStore);

			const draft = createDraft(baseState) as IGameState;
			const state = finishDraft(system.scheduleTraining(amount, draft));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});

		it('should scheduled release', () => {
			const amount = -2;
			const baseState: Partial<IGameState> = {
				command: { train: { guards: 0, workers: 4, } },
				idles: { current: 20, killed: { current: 0, total: 0 } },
				workers: { current: 3, killed: { current: 0, total: 0 } },
				guards,
			};

			const expectedState = createDraft(baseState) as IGameState;
			expectedState.command.train.workers += amount;

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: WorkersSystem = new WorkersSystem(dataStore);

			const draft = createDraft(baseState) as IGameState;
			const state = finishDraft(system.scheduleTraining(amount, draft));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});

		it('should scheduled conform max training capacity', () => {
			const amount = 25;
			const baseState: Partial<IGameState> = {
				command: { train: { guards: 0, workers: 4, } },
				idles: { current: 20, killed: { current: 0, total: 0 } },
				workers: { current: 3, killed: { current: 0, total: 0 } },
				guards,
			};

			const expectedState = createDraft(baseState) as IGameState;
			expectedState.command.train.workers = 20;

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: WorkersSystem = new WorkersSystem(dataStore);

			const draft = createDraft(baseState) as IGameState;
			const state = finishDraft(system.scheduleTraining(amount, draft));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});

		it('should scheduled conform min training capacity', () => {
			const amount = -25;
			const baseState: Partial<IGameState> = {
				command: { train: { guards: 0, workers: 4, } },
				idles: { current: 20, killed: { current: 0, total: 0 } },
				workers: { current: 3, killed: { current: 0, total: 0 } },
				guards,
			};

			const expectedState = createDraft(baseState) as IGameState;
			expectedState.command.train.workers = -3;

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: WorkersSystem = new WorkersSystem(dataStore);

			const draft = createDraft(baseState) as IGameState;
			const state = finishDraft(system.scheduleTraining(amount, draft));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});
	});

	describe('trainRule', () => {
		it('should not break anything if there is no scheduled training', () => {
			const baseState: Partial<IGameState> = {
				command,
				idles: { current: 120, killed: { current: 0, total: 0 } },
				workers: { current: 20, killed: { current: 0, total: 0 } },
				guards,
			};

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: WorkersSystem = new WorkersSystem(dataStore);

			const state = produce(baseState as IGameState, system.trainRule);

			expect(state).toEqual(baseState as IGameState, 'game state');
		});

		it('should perform scheduled workers training', () => {
			const amount = 15;
			const baseState: Partial<IGameState> = {
				command,
				idles: { current: 20, killed: { current: 0, total: 0 } },
				workers: { current: 3, killed: { current: 0, total: 0 } },
				guards,
			};
			const expectedState = createDraft(baseState) as IGameState;
			expectedState.idles.current -= amount;
			expectedState.workers.current += amount;

			const em: IEventEmitter = new EventEmitter();
			const dataStore: DataStore<any> = new DataStore(baseState, em);
			const system: WorkersSystem = new WorkersSystem(dataStore);

			// schedule training
			const draft = createDraft(baseState) as IGameState;
			system.scheduleTraining(amount, draft);

			const state = finishDraft(system.trainRule(draft));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});
	});
});
