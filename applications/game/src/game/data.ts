import cloneDeep from 'lodash-es/cloneDeep';
import lodashGet from 'lodash-es/get';
import lodashSet from 'lodash-es/set';

import { IGameState } from './interfaces';

// === BASE

/**
 * Scoped property selector.
 * This is very slow just hardcode getters they are much faster and only slightly longer to write.
 *
 * @param path path on which property value is stored
 * @param defaultValue value retrived if nothing is set on path
 */
export const get = <T = any>(
	// prettier-ignore
	path: string,
	defaultValue: T,
) => (state: IGameState): T => lodashGet(state, path, defaultValue);

/**
 * Scoped property set action.
 * This is very slow just hardcode setters they are much faster and only slightly longer to write.
 *
 * @param path path on which property value is stored
 */
export const set = <T = any>(
	// prettier-ignore
	path: string,
	cloneState: boolean = false,
) => (value: T) => (state: IGameState): IGameState =>
	lodashSet<IGameState>(
		// prettier-ignore
		cloneState ? cloneDeep(state) : state,
		path,
		value,
	);

/**
 * Scoped property changeAmountOf action.
 * This is very slow just hardcode change functions they are much faster and only slightly longer to write.
 *
 * @param path path on which property value is stored
 */
export const changeAmountOf = (
	// prettier-ignore
	path: string,
	cloneState: boolean = false,
) => (value: number) => (state: IGameState): IGameState =>
	lodashSet<IGameState>(
		// prettier-ignore
		cloneState ? cloneDeep(state) : state,
		path,
		(lodashGet(state, path, 0) as number) + value,
	);

/**
 * Scoped property update action.
 *
 * @param scope scope for keeping variables
 * @param path path on which property value is stored
 */
export const update = <T>(
	// prettier-ignore
	path: string,
	reduce: (prev: T, ...args: any[]) => T,
	cloneState: boolean = false,
) => (...args) => (state: IGameState): IGameState =>
	lodashSet<IGameState>(
		// prettier-ignore
		cloneState ? cloneDeep(state) : state,
		path,
		reduce(lodashGet(state, path, null), ...args),
	);
