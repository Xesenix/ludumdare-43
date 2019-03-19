import {
	// prettier-ignore
	cloneDeep,
	get as lodashGet,
	set as lodashSet,
} from 'lodash';
import { IGameState } from './store';

// === BASE

/**
 * Scoped property selector.
 *
 * @param path path on which property value is stored
 * @param defaultValue value retrived if nothing is set on path
 */
export const get = <T = any>(path: string, defaultValue: T) => (state: IGameState): T => lodashGet(state, path, defaultValue);

/**
 * Scoped property set action.
 *
 * @param path path on which property value is stored
 */
export const set = <T = any>(path: string, cloneState: boolean = false) => (value: T) => (state: IGameState): IGameState => lodashSet<IGameState>(
	cloneState ? cloneDeep(state) : state,
	path,
	value,
);

/**
 * Scoped property changeAmountOf action.
 *
 * @param path path on which property value is stored
 */
export const changeAmountOf = (path: string, cloneState: boolean = false) => (value: number) => (state: IGameState): IGameState => lodashSet<IGameState>(
	cloneState ? cloneDeep(state) : state,
	path,
	lodashGet(state, path, 0) as number + value,
);

/**
 * Scoped property update action.
 *
 * @param scope scope for keeping variables
 * @param path path on which property value is stored
 */
export const update = <T>(path: string, reduce: (prev: T, ...args) => T, cloneState: boolean = false) => (...args) => (state: IGameState): IGameState => lodashSet<IGameState>(
	cloneState ? cloneDeep(state) : state,
	path,
	reduce(lodashGet(state, path, null), ...args),
);
