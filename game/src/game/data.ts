import { IGameState } from './store';

// === BASE

/**
 * Scope property selector.
 *
 * @param scope scope for keeping variables
 * @param key key on which property value is stored
 */
export const get = <T>(scope: string, key: string) => (state: IGameState): T => state[scope][key];

/**
 * Scope property set action.
 *
 * @param scope scope for keeping variables
 * @param key key on which property value is stored
 */
export const set = <T>(scope: string, key: string) => (value: T) => (state: IGameState): IGameState => ({
	...state,
	[scope]: {
		...(state[scope] || {}),
		[key]: value,
	},
});

/**
 * Scope property changeAmountOf action.
 *
 * @param scope scope for keeping variables
 * @param key key on which property value is stored
 */
export const changeAmountOf = (scope: string, key: string) => (value: number) => (state: IGameState): IGameState => ({
	...state,
	[scope]: {
		...(state[scope] || {}),
		[key]: state[scope][key] + value,
	},
});

/**
 * Scope property update action.
 *
 * @param scope scope for keeping variables
 * @param key key on which property value is stored
 */
export const update = <T>(scope: string, key: string, reduce: (prev: T, ...args) => T) => (...args) => (state: IGameState): IGameState => ({
	...state,
	[scope]: {
		...state[key],
		[key]: reduce(state[scope][key], ...args),
	},
});


