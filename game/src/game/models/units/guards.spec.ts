import { IGameState } from 'game';
import { cloneDeep } from 'lodash';
import {
	// prettier-ignore
	changeAmountOfCurrentGuards,
	changeAmountOfGuardsKilledInLastTurn,
	changeAmountOfGuardsKilledInTotal,
	changeAmountOfTrainedGuards,
	getCurrentGuards,
	getGuardsKilledInLastTurn,
	getGuardsKilledInTotal,
	getTrainedGuards,
	setCurrentGuards,
	setGuardsKilledInLastTurn,
	setGuardsKilledInTotal,
	setTrainedGuards,
} from './guards';

describe('models/units/guards', () => {
	describe('current', () => {
		describe('.getCurrentGuards()', () => {
			it('should get amount of guards in provided state', () => {
				const amount = 123;
				const result = getCurrentGuards({ guards: { current: amount } } as IGameState);
				expect(result).toBe(amount, 'amount of current guards');
			});
		});

		describe('.setCurrentGuards()', () => {
			it('should set amount of guards in provided state', () => {
				const amount = 42;
				const state = setCurrentGuards(amount)({ guards: { current: 543 } } as IGameState);
				expect(state.guards.current).toBe(amount, 'amount of current guards');
			});

			it('should not modify other guards fields in provided state', () => {
				const amount = 0;
				const baseState: Partial<IGameState> = {
					guards: {
						current: 123,
						trained: 22,
						killed: { current: 34, total: 42 },
					},
				};
				const guards = baseState.guards as any;
				const state = setCurrentGuards(amount)(cloneDeep(baseState as IGameState));
				expect(state.guards.current).toBe(amount, 'amount of current guards');
				expect(state.guards.trained).toBe(guards.trained, 'amount of trained guards');
				expect(state.guards.killed.current).toBe(guards.killed.current, 'amount of guards killed in last turn');
				expect(state.guards.killed.total).toBe(guards.killed.total, 'amount of guards killed in total');
			});
		});

		describe('.changeAmountOfCurrentGuards()', () => {
			it('should update amount of guards in provided state', () => {
				const current = 13;
				const amount = 42;
				const state = changeAmountOfCurrentGuards(amount)(({ guards: { current } } as Partial<IGameState>) as IGameState);
				expect(state.guards.current).toBe(current + amount, 'amount of current guards');
			});

			it('should not modify other guards fields in provided state', () => {
				const amount = 0;
				const baseState: Partial<IGameState> = {
					guards: {
						current: 123,
						trained: 22,
						killed: { current: 34, total: 42 },
					},
				};
				const guards = baseState.guards as any;
				const state = changeAmountOfCurrentGuards(amount)(cloneDeep(baseState as IGameState));
				expect(state.guards.current).toBe(guards.current, 'amount of current guards');
				expect(state.guards.trained).toBe(guards.trained, 'amount of trained guards');
				expect(state.guards.killed.current).toBe(guards.killed.current, 'amount of guards killed in last turn');
				expect(state.guards.killed.total).toBe(guards.killed.total, 'amount of guards killed in total');
			});
		});
	});

	describe('trained', () => {
		describe('.getTrainedGuards()', () => {
			it('should get amount of trained guards in provided state', () => {
				const amount = 34;
				const result = getTrainedGuards(({ guards: { current: 44, trained: amount } } as Partial<IGameState>) as IGameState);
				expect(result).toBe(amount, 'amount of trained guards');
			});
		});

		describe('.setTrainedGuards()', () => {
			it('should set amount of trained guards in provided state', () => {
				const amount = 21;
				const state = setTrainedGuards(amount)(({ guards: { current: 23, trained: 45 } } as Partial<IGameState>) as IGameState);
				expect(state.guards.trained).toBe(amount, 'amount of trained guards');
			});

			it('should not modify other guards fields in provided state', () => {
				const amount = 0;
				const baseState: Partial<IGameState> = {
					guards: {
						current: 123,
						trained: 22,
						killed: { current: 34, total: 42 },
					},
				};
				const guards = baseState.guards as any;
				const state = setTrainedGuards(amount)(baseState as IGameState);
				expect(state.guards.current).toBe(guards.current, 'amount of current guards');
				expect(state.guards.trained).toBe(amount, 'amount of trained guards');
				expect(state.guards.killed.current).toBe(guards.killed.current, 'amount of guards killed in last turn');
				expect(state.guards.killed.total).toBe(guards.killed.total, 'amount of guards killed in total');
			});
		});

		describe('.changeAmountOfTrainedGuards()', () => {
			it('should update amount of trained guards in provided state', () => {
				const trained = 34;
				const amount = -5;
				const state = changeAmountOfTrainedGuards(amount)(({ guards: { current: 11, trained } } as Partial<IGameState>) as IGameState);
				expect(state.guards.trained).toBe(trained + amount, 'amount of trained guards');
			});

			it('should not modify other guards fields in provided state', () => {
				const amount = 0;
				const baseState: Partial<IGameState> = {
					guards: {
						current: 123,
						trained: 22,
						killed: { current: 34, total: 42 },
					},
				};
				const guards = baseState.guards as any;
				const state = changeAmountOfTrainedGuards(amount)(cloneDeep(baseState as IGameState));
				expect(state.guards.current).toBe(guards.current, 'amount of current guards');
				expect(state.guards.trained).toBe(guards.trained, 'amount of trained guards');
				expect(state.guards.killed.current).toBe(guards.killed.current, 'amount of guards killed in last turn');
				expect(state.guards.killed.total).toBe(guards.killed.total, 'amount of guards killed in total');
			});
		});
	});

	describe('killed', () => {
		describe('.getGuardsKilledInLastTurn()', () => {
			it('should get amount of guards killed in last turn in provided state', () => {
				const amount = 34;
				const result = getGuardsKilledInLastTurn(({ guards: { current: 44, killed: { current: amount, total: 42 } } } as Partial<IGameState>) as IGameState);
				expect(result).toBe(amount, 'amount of guards killed in last turn');
			});
		});

		describe('.setGuardsKilledInLastTurn()', () => {
			it('should set amount of guards killed in last turn in provided state', () => {
				const amount = 21;
				const killed = { current: 45, total: 42 };
				const baseState: Partial<IGameState> = {
					guards: {
						current: 23,
						trained: 11,
						killed,
					},
				};
				const state = setGuardsKilledInLastTurn(amount)(baseState as IGameState);
				expect(state.guards.killed.current).toBe(amount, 'amount of guards killed in last turn');
				expect(state.guards.killed.total).toBe(killed.total, 'amount of guards killed in total');
			});

			it('should not modify other guards fields in provided state', () => {
				const amount = 0;
				const baseState: Partial<IGameState> = {
					guards: {
						current: 123,
						trained: 22,
						killed: { current: 34, total: 42 },
					},
				};
				const guards = baseState.guards as any;
				const state = setGuardsKilledInLastTurn(amount)(cloneDeep(baseState as IGameState));
				expect(state.guards.current).toBe(guards.current, 'amount of current guards');
				expect(state.guards.trained).toBe(guards.trained, 'amount of trained guards');
				expect(state.guards.killed.current).toBe(amount, 'amount of guards killed in last turn');
				expect(state.guards.killed.total).toBe(guards.killed.total, 'amount of guards killed in total');
			});
		});

		describe('.changeAmountOfGuardsKilledInLastTurn()', () => {
			it('should update amount of guards killed in last turn in provided state', () => {
				const killed = { current: 34, total: 3 };
				const amount = 5;
				const baseState: Partial<IGameState> = {
					guards: {
						current: 11,
						trained: 0,
						killed,
					},
				};
				const state = changeAmountOfGuardsKilledInLastTurn(amount)(cloneDeep(baseState) as IGameState);
				expect(state.guards.killed.current).toBe(killed.current + amount, 'amount of guards killed in last turn');
				expect(state.guards.killed.total).toBe(killed.total, 'amount of guards killed in total');
			});

			it('should not modify other guards fields in provided state', () => {
				const amount = 0;
				const baseState: Partial<IGameState> = {
					guards: {
						current: 123,
						trained: 22,
						killed: { current: 34, total: 42 },
					},
				};
				const guards = baseState.guards as any;
				const state = changeAmountOfGuardsKilledInLastTurn(amount)(cloneDeep(baseState as IGameState));
				expect(state.guards.current).toBe(guards.current, 'amount of current guards');
				expect(state.guards.trained).toBe(guards.trained, 'amount of trained guards');
				expect(state.guards.killed.current).toBe(guards.killed.current, 'amount of guards killed in last turn');
				expect(state.guards.killed.total).toBe(guards.killed.total, 'amount of guards killed in total');
			});
		});

		describe('.getGuardsKilledInTotal()', () => {
			it('should get amount of guards killed in total in provided state', () => {
				const amount = 34;
				const baseState: Partial<IGameState> = {
					guards: {
						current: 44,
						trained: 22,
						killed: { current: 12, total: amount },
					},
				};
				const result = getGuardsKilledInTotal(cloneDeep(baseState) as IGameState);
				expect(result).toBe(amount, 'amount of guards killed in last turn');
			});
		});

		describe('.setGuardsKilledInTotal()', () => {
			it('should set amount of guards killed in total in provided state', () => {
				const amount = 21;
				const killed = { current: 45, total: 42 };
				const baseState: Partial<IGameState> = {
					guards: {
						current: 23,
						trained: 11,
						killed,
					},
				};
				const state = setGuardsKilledInTotal(amount)(baseState as IGameState);
				expect(state.guards.killed.current).toBe(killed.current, 'amount of guards killed in last turn');
				expect(state.guards.killed.total).toBe(amount, 'amount of guards killed in total');
			});

			it('should not modify other guards fields in provided state', () => {
				const amount = 0;
				const baseState: Partial<IGameState> = {
					guards: {
						current: 123,
						trained: 22,
						killed: { current: 34, total: 42 },
					},
				};
				const guards = baseState.guards as any;
				const state = setGuardsKilledInTotal(amount)(cloneDeep(baseState as IGameState));
				expect(state.guards.current).toBe(guards.current, 'amount of current guards');
				expect(state.guards.trained).toBe(guards.trained, 'amount of trained guards');
				expect(state.guards.killed.current).toBe(guards.killed.current, 'amount of guards killed in last turn');
				expect(state.guards.killed.total).toBe(amount, 'amount of guards killed in total');
			});
		});

		describe('.changeAmountOfGuardsKilledInTotal()', () => {
			it('should update amount of guards killed in total in provided state', () => {
				const killed = { current: 34, total: 3 };
				const amount = 5;
				const baseState: Partial<IGameState> = {
					guards: {
						current: 11,
						trained: 0,
						killed,
					},
				};
				const state = changeAmountOfGuardsKilledInTotal(amount)(cloneDeep(baseState) as IGameState);
				expect(state.guards.killed.current).toBe(killed.current, 'amount of guards killed in last turn');
				expect(state.guards.killed.total).toBe(killed.total + amount, 'amount of guards killed in total');
			});

			it('should not modify other guards fields in provided state', () => {
				const amount = 0;
				const baseState: Partial<IGameState> = {
					guards: {
						current: 123,
						trained: 22,
						killed: { current: 34, total: 42 },
					},
				};
				const guards = baseState.guards as any;
				const state = changeAmountOfGuardsKilledInTotal(amount)(cloneDeep(baseState as IGameState));
				expect(state.guards.current).toBe(guards.current, 'amount of current guards');
				expect(state.guards.trained).toBe(guards.trained, 'amount of trained guards');
				expect(state.guards.killed.current).toBe(guards.killed.current, 'amount of guards killed in last turn');
				expect(state.guards.killed.total).toBe(guards.killed.total, 'amount of guards killed in total');
			});
		});
	});
});
