import {
	changeAmountOfCurrentGuards,
	changeAmountOfKilledGuards,
	changeAmountOfMaxGuards,
	changeAmountOfTrainedGuards,
	getCurrentGuards,
	getKilledGuards,
	getMaxGuards,
	getTrainedGuards,
	setCurrentGuards,
	setKilledGuards,
	setMaxGuards,
	setTrainedGuards,
} from './guards';

describe('feature/guards', () => {
	describe('current', () => {
		describe('.getCurrentGuards()', () => {
			it('should get amount of guards in provided state', () => {
				const amount = 123;
				const result = getCurrentGuards({ guards: { current: amount } } as any);
				expect(result).toBe(amount, 'amount of current guards');
			});
		});

		describe('.setCurrentGuards()', () => {
			it('should set amount of guards in provided state', () => {
				const amount = 42;
				const state = setCurrentGuards(amount)({ guards: { current: 543 } } as any);
				expect(state.guards.current).toBe(amount, 'amount of current guards');
			});

			it('should not modify other guards fields in provided state', () => {
				const amount = 0;
				const baseGuards = { current: 123, trained: 22, killed: 34, max: 223 };
				const state = setCurrentGuards(amount)({ guards: { ...baseGuards } } as any);
				expect(state.guards.current).toBe(amount, 'amount of current guards');
				expect(state.guards.trained).toBe(baseGuards.trained, 'amount of trained guards');
				expect(state.guards.killed).toBe(baseGuards.killed, 'amount of killed guards');
				expect(state.guards.max).toBe(baseGuards.max, 'max amount of guards');
			});
		});

		describe('.changeAmountOfCurrentGuards()', () => {
			it('should update amount of guards in provided state', () => {
				const current = 13;
				const amount = 42;
				const state = changeAmountOfCurrentGuards(amount)({ guards: { current } } as any);
				expect(state.guards.current).toBe(current + amount, 'amount of current guards');
			});
		});
	});

	describe('trained', () => {
		describe('.getTrainedGuards()', () => {
			it('should get amount of trained guards in provided state', () => {
				const amount = 34;
				const result = getTrainedGuards({ guards: { current: 44, trained: amount } } as any);
				expect(result).toBe(amount, 'amount of trained guards');
			});
		});

		describe('.setTrainedGuards()', () => {
			it('should set amount of trained guards in provided state', () => {
				const amount = 21;
				const state = setTrainedGuards(amount)({ guards: { current: 23, trained: 45 } } as any);
				expect(state.guards.trained).toBe(amount, 'amount of trained guards');
			});

			it('should not modify other guards fields in provided state', () => {
				const amount = 0;
				const baseGuards = { current: 123, trained: 22, killed: 34, max: 223 };
				const state = setTrainedGuards(amount)({ guards: { ...baseGuards } } as any);
				expect(state.guards.current).toBe(baseGuards.current, 'amount of current guards');
				expect(state.guards.trained).toBe(amount, 'amount of trained guards');
				expect(state.guards.killed).toBe(baseGuards.killed, 'amount of killed guards');
				expect(state.guards.max).toBe(baseGuards.max, 'max amount of guards');
			});
		});

		describe('.changeAmountOfTrainedGuards()', () => {
			it('should update amount of trained guards in provided state', () => {
				const trained = 34;
				const amount = -5;
				const state = changeAmountOfTrainedGuards(amount)({ guards: { current: 11, trained } } as any);
				expect(state.guards.trained).toBe(trained + amount, 'amount of trained guards');
			});
		});
	});

	describe('killed', () => {
		describe('.getKilledGuards()', () => {
			it('should get amount of killed guards in provided state', () => {
				const amount = 34;
				const result = getKilledGuards({ guards: { current: 44, killed: amount } } as any);
				expect(result).toBe(amount, 'amount of killed guards');
			});
		});

		describe('.setKilledGuards()', () => {
			it('should set amount of killed guards in provided state', () => {
				const amount = 21;
				const state = setKilledGuards(amount)({ guards: { current: 23, killed: 45 } } as any);
				expect(state.guards.killed).toBe(amount, 'amount of killed guards');
			});

			it('should not modify other guards fields in provided state', () => {
				const amount = 0;
				const baseGuards = { current: 123, trained: 22, killed: 34, max: 223 };
				const state = setKilledGuards(amount)({ guards: { ...baseGuards } } as any);
				expect(state.guards.current).toBe(baseGuards.current, 'amount of current guards');
				expect(state.guards.trained).toBe(baseGuards.trained, 'amount of trained guards');
				expect(state.guards.killed).toBe(amount, 'amount of killed guards');
				expect(state.guards.max).toBe(baseGuards.max, 'max amount of guards');
			});
		});

		describe('.changeAmountOfKilledGuards()', () => {
			it('should update amount of killed guards in provided state', () => {
				const killed = 34;
				const amount = 5;
				const state = changeAmountOfKilledGuards(amount)({ guards: { current: 11, killed } } as any);
				expect(state.guards.killed).toBe(killed + amount, 'amount of killed guards');
			});
		});
	});

	describe('max', () => {
		describe('.getMaxGuards()', () => {
			it('should get max amount of guards in provided state', () => {
				const amount = 34;
				const result = getMaxGuards({ guards: { current: 44, max: amount } } as any);
				expect(result).toBe(amount, 'max amount of guards');
			});
		});

		describe('.setMaxGuards()', () => {
			it('should set max amount of guards in provided state', () => {
				const amount = 33;
				const state = setMaxGuards(amount)({ guards: { current: 23, max: 45 } } as any);
				expect(state.guards.max).toBe(amount, 'max amount of guards');
			});

			it('should not modify other guards fields in provided state', () => {
				const amount = 0;
				const baseGuards = { current: 123, trained: 22, killed: 34, max: 223 };
				const state = setMaxGuards(amount)({ guards: { ...baseGuards } } as any);
				expect(state.guards.current).toBe(baseGuards.current, 'amount of current guards');
				expect(state.guards.trained).toBe(baseGuards.trained, 'amount of trained guards');
				expect(state.guards.killed).toBe(baseGuards.killed, 'amount of killed guards');
				expect(state.guards.max).toBe(amount, 'max amount of guards');
			});
		});

		describe('.changeAmountOfMaxGuards()', () => {
			it('should update max amount of guards in provided state', () => {
				const max = 34;
				const amount = 5;
				const state = changeAmountOfMaxGuards(amount)({ guards: { current: 11, max } } as any);
				expect(state.guards.max).toBe(max + amount, 'max amount of guards');
			});
		});
	});
});
