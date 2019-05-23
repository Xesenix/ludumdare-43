import produce, { createDraft, finishDraft } from 'immer';

import { IGameState } from '../store';
import {
	// prettier-ignore
	canTrainGuards,
	scheduleTrainingGuards,
	scheduleTrainingWorkers,
	trainGuardsRule,
	trainWorkersRule,
} from './training';

const workers = { current: 0, trained: 0, killed: { current: 0, total: 0 } };
const guards = { current: 0, trained: 0, killed: { current: 0, total: 0 } };

describe('features/training', () => {
	describe('scheduleTrainingWorkers', () => {
		it('should not break anything if there is no scheduled training', () => {
			const baseState: Partial<IGameState> = {
				idles: { current: 20, killed: { current: 0, total: 0 } },
				workers,
				guards,
			};

			const state = produce(baseState as IGameState, scheduleTrainingWorkers(0));

			expect(state).toEqual(baseState as IGameState, 'game state');
		});

		it('should scheduled training', () => {
			const amount = 5;
			const baseState: Partial<IGameState> = {
				idles: { current: 20, killed: { current: 0, total: 0 } },
				workers: { current: 3, trained: 4, killed: { current: 0, total: 0 } },
				guards,
			};

			const expectedState = createDraft(baseState) as IGameState;
			expectedState.workers.trained += amount;

			const state = produce(baseState as IGameState, scheduleTrainingWorkers(amount));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});

		it('should scheduled release', () => {
			const amount = -2;
			const baseState: Partial<IGameState> = {
				idles: { current: 20, killed: { current: 0, total: 0 } },
				workers: { current: 3, trained: 4, killed: { current: 0, total: 0 } },
				guards,
			};

			const expectedState = createDraft(baseState) as IGameState;
			expectedState.workers.trained += amount;

			const state = produce(baseState as IGameState, scheduleTrainingWorkers(amount));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});

		it('should scheduled conform max training capacity', () => {
			const amount = 25;
			const baseState: Partial<IGameState> = {
				idles: { current: 20, killed: { current: 0, total: 0 } },
				workers: { current: 3, trained: 4, killed: { current: 0, total: 0 } },
				guards,
			};

			const expectedState = createDraft(baseState) as IGameState;
			expectedState.workers.trained = 20;

			const state = produce(baseState as IGameState, scheduleTrainingWorkers(amount));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});

		it('should scheduled conform min training capacity', () => {
			const amount = -25;
			const baseState: Partial<IGameState> = {
				idles: { current: 20, killed: { current: 0, total: 0 } },
				workers: { current: 3, trained: 4, killed: { current: 0, total: 0 } },
				guards,
			};

			const expectedState = createDraft(baseState) as IGameState;
			expectedState.workers.trained = -3;

			const state = produce(baseState as IGameState, scheduleTrainingWorkers(amount));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});
	});

	describe('trainWorkersRule', () => {
		it('should not break anything if there is no scheduled training', () => {
			const baseState: Partial<IGameState> = {
				idles: { current: 120, killed: { current: 0, total: 0 } },
				workers: { current: 20, trained: 0, killed: { current: 0, total: 0 } },
				guards,
			};

			const state = produce(baseState as IGameState, trainWorkersRule);

			expect(state).toEqual(baseState as IGameState, 'game state');
		});

		it('should recalculate scheduled workers training', () => {
			const amount = 15;
			const baseState: Partial<IGameState> = {
				idles: { current: 20, killed: { current: 0, total: 0 } },
				workers: { current: 3, trained: 0, killed: { current: 0, total: 0 } },
				guards,
			};
			const expectedState = createDraft(baseState) as IGameState;
			expectedState.idles.current -= amount;
			expectedState.workers.current += amount;

			const state = finishDraft(trainWorkersRule(scheduleTrainingWorkers(amount)(createDraft(baseState) as IGameState)));

			expect(state).toEqual(finishDraft(expectedState), 'game state');
		});
	});

	describe('guards', () => {
		describe('canTrainGuards', () => {
			it('should check if there is enough free resources', () => {
				const amount = 2;
				const baseState: Partial<IGameState> = {
					idles: { current: 25, killed: { current: 0, total: 0 } },
					workers: { current: 15, trained: 1, killed: { current: 0, total: 0 } },
					guards: { current: 1, trained: -1, killed: { current: 0, total: 10 } },
					resources: {
						amount: 3,
						reserved: 1, // just enough for 2
						stolen: { current: 0, total: 2 },
						used: { current: 33, total: 33 },
					},
				};
				expect(canTrainGuards(baseState as IGameState)(amount)).toBe(true, 'canTrainGuards in available resources borders');
				expect(canTrainGuards(baseState as IGameState)(amount + 1)).toBe(false, 'canTrainGuards above available resources');
			});

			it('should check if there is enough free population', () => {
				const amount = 3;
				const baseState: Partial<IGameState> = {
					idles: { current: 5, killed: { current: 0, total: 0 } },
					workers: { current: 15, trained: 3, killed: { current: 0, total: 0 } },
					guards: { current: 1, trained: -1, killed: { current: 0, total: 10 } },
					resources: {
						amount: 15,
						reserved: 0,
						stolen: { current: 0, total: 2 },
						used: { current: 33, total: 33 },
					},
				};
				expect(canTrainGuards(baseState as IGameState)(amount)).toBe(true, 'canTrainGuards in available amount of free population borders');
				expect(canTrainGuards(baseState as IGameState)(amount + 1)).toBe(false, 'canTrainGuards above available amount of free population');
			});

			it('should check if there is enough free guards to release', () => {
				const amount = -2;
				const baseState: Partial<IGameState> = {
					idles: { current: 5, killed: { current: 0, total: 0 } },
					workers: { current: 15, trained: 3, killed: { current: 0, total: 0 } },
					guards: { current: 3, trained: -1, killed: { current: 0, total: 10 } },
					resources: {
						amount: 0,
						reserved: 0,
						stolen: { current: 0, total: 2 },
						used: { current: 33, total: 33 },
					},
				};
				expect(canTrainGuards(baseState as IGameState)(amount)).toBe(true, 'canTrainGuards in available amount of guards borders');
				expect(canTrainGuards(baseState as IGameState)(amount - 1)).toBe(false, 'canTrainGuards below available guards amount');
			});
		});

		describe('scheduleTrainingGuards', () => {
			it('should not break anything if there is no scheduled training', () => {
				const baseState: Partial<IGameState> = {
					idles: { current: 20, killed: { current: 0, total: 0 } },
					guards: { current: 0, trained: 0, killed: { current: 0, total: 0 } },
					workers,
					resources: {
						amount: 30,
						reserved: 15,
						used: { current: 131, total: 4 },
						stolen: { current: 0, total: 0 },
					},
				};

				const state = produce(baseState as IGameState, scheduleTrainingGuards(0));

				expect(state).toEqual(baseState as IGameState, 'game state');
			});

			it('should scheduled training', () => {
				const amount = 5;
				const baseState: Partial<IGameState> = {
					idles: { current: 20, killed: { current: 0, total: 0 } },
					guards: { current: 3, trained: 4, killed: { current: 0, total: 0 } },
					workers,
					resources: {
						amount: 10,
						reserved: 5,
						used: { current: 31, total: 2 },
						stolen: { current: 0, total: 0 },
					},
				};

				const expectedState = createDraft(baseState) as IGameState;
				expectedState.guards.trained += amount;
				expectedState.resources.reserved += amount;

				const state = produce(baseState as IGameState, scheduleTrainingGuards(amount));

				expect(state).toEqual(finishDraft(expectedState), 'game state');
			});

			it('should scheduled release', () => {
				const amount = -3;
				const baseState: Partial<IGameState> = {
					idles: { current: 20, killed: { current: 0, total: 0 } },
					guards: { current: 3, trained: 4, killed: { current: 0, total: 0 } },
					workers,
					resources: {
						amount: 10,
						reserved: 5,
						used: { current: 31, total: 54 },
						stolen: { current: 0, total: 0 },
					},
				};

				const expectedState = createDraft(baseState) as IGameState;
				expectedState.guards.trained += amount;
				expectedState.resources.reserved += amount;

				const state = produce(baseState as IGameState, scheduleTrainingGuards(amount));

				expect(state).toEqual(finishDraft(expectedState), 'game state');
			});

			it('should scheduled conform min training capacity', () => {
				const amount = -23;
				const baseState: Partial<IGameState> = {
					idles: { current: 20, killed: { current: 0, total: 0 } },
					guards: { current: 3, trained: 4, killed: { current: 0, total: 0 } },
					workers,
					resources: {
						amount: 10,
						reserved: 5,
						used: { current: 31, total: 334 },
						stolen: { current: 0, total: 0 },
					},
				};

				const expectedState = createDraft(baseState) as IGameState;
				expectedState.guards.trained = -3;
				expectedState.resources.reserved = 1;

				const state = produce(baseState as IGameState, scheduleTrainingGuards(amount));

				expect(state).toEqual(finishDraft(expectedState), 'game state');
			});

			it('should scheduled conform max training capacity', () => {
				const amount = 23;
				const baseState: Partial<IGameState> = {
					idles: { current: 20, killed: { current: 0, total: 0 } },
					guards: { current: 3, trained: 4, killed: { current: 0, total: 0 } },
					workers,
					resources: {
						amount: 30,
						reserved: 5,
						used: { current: 31, total: 0 },
						stolen: { current: 0, total: 0 },
					},
				};

				const expectedState = createDraft(baseState) as IGameState;
				expectedState.guards.trained = 20;
				expectedState.resources.reserved = 21;

				const state = produce(baseState as IGameState, scheduleTrainingGuards(amount));

				expect(state).toEqual(finishDraft(expectedState), 'game state');
			});

			it('should scheduled conform max training resource amount', () => {
				const amount = 23;
				const baseState: Partial<IGameState> = {
					idles: { current: 20, killed: { current: 0, total: 0 } },
					guards: { current: 3, trained: 4, killed: { current: 0, total: 0 } },
					workers,
					resources: {
						amount: 10,
						reserved: 5,
						used: { current: 31, total: 345 },
						stolen: { current: 0, total: 0 },
					},
				};

				const expectedState = createDraft(baseState) as IGameState;
				expectedState.guards.trained = 9;
				expectedState.resources.reserved = 10;

				const state = produce(baseState as IGameState, scheduleTrainingGuards(amount));

				expect(state).toEqual(finishDraft(expectedState), 'game state');
			});
		});

		describe('trainGuardsRule', () => {
			it('should not break anything if there is no scheduled training', () => {
				const baseState: Partial<IGameState> = {
					idles: {
						current: 120,
						killed: { current: 0, total: 0 },
					},
					guards: {
						current: 20,
						trained: 0,
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

				const state = produce(baseState as IGameState, trainGuardsRule);

				expect(state).toEqual(baseState as IGameState, 'game state');
			});

			it('should recalculate scheduled guards training', () => {
				const amount = 4;
				const baseState: Partial<IGameState> = {
					idles: {
						current: 20,
						killed: { current: 0, total: 0 },
					},
					guards: {
						current: 3,
						trained: 0,
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

				const state = finishDraft(trainGuardsRule(scheduleTrainingGuards(amount)(createDraft(baseState as IGameState))));

				expect(state).toEqual(finishDraft(expectedState), 'game state');
			});

			it('should recalculate scheduled guards release', () => {
				const amount = -3;
				const baseState: Partial<IGameState> = {
					idles: {
						current: 20,
						killed: { current: 0, total: 0 },
					},
					guards: {
						current: 3,
						trained: 0,
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

				const state = finishDraft(trainGuardsRule(scheduleTrainingGuards(amount)(createDraft(baseState as IGameState))));

				expect(state).toEqual(finishDraft(expectedState), 'game state');
			});
		});
	});
});
