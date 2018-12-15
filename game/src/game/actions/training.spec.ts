import { scheduleTrainingGuards, trainGuardsRule } from './training';

describe('features/training', () => {
	describe('scheduleTrainingGuards', () => {
		it('should not break anything if there is no scheduled training', () => {
			const baseState = {
				idles: { current: 20, trained: 0, max: 50 },
				guards: { current: 0, trained: 0, max: 20 },
				resources: { amount: 30, reserved: 15, used: 131 },
			};
			const state = scheduleTrainingGuards(0)({ ...baseState } as any);

			expect(state).toEqual(baseState, 'game state');
		});
	});

	describe('trainGuardsRule', () => {
		it('should not break anything if there is no scheduled training', () => {
			const baseState = {
				idles: { current: 120, trained: 30, max: 50 },
				guards: { current: 20, trained: 0, max: 20 },
				resources: { amount: 120, reserved: 25, used: 51 },
			};
			const state = trainGuardsRule({ ...baseState } as any);

			expect(state).toEqual(baseState, 'game state');
		});
		it('should recalculate scheduled guards training', () => {
			const amount = 15;
			const baseState = {
				idles: { current: 20, trained: 0, max: 50 },
				guards: { current: 3, trained: 0, max: 20 },
				resources: { amount: 10, reserved: 5, used: 31 },
			};
			const expectedState = {
				idles: { current: 20 - amount, trained: 0, max: 50 },
				guards: { current: 3 + amount, trained: 0, max: 20 },
				resources: { amount: 10 - amount, reserved: 5, used: 31 + amount },
			};
			const state = trainGuardsRule(scheduleTrainingGuards(amount)({ ...baseState as any }));

			expect(state).toEqual(expectedState, 'game state');
		});
	});
});
