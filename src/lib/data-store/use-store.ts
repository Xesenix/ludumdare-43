import pickBy from 'lodash-es/pickBy';
import isEqual from 'lodash-es/isEqual';
import * as React from 'react';
import { Action, Store } from 'redux';

export const filterByKeys = <T extends object>(keys: (keyof T)[]) => (data: T): T => pickBy(data, (_, key: any) => keys.indexOf(key) >= 0) as T;

export function useStore<S extends object, A extends Action = Action>(store: Store<S, A>, filters: (keyof S)[]) {
	const filter: (data: S) => S = React.useCallback((data: T) => filterByKeys<S>(filters)(data), [filters]);

	const [state, setState] = React.useState(filter(store.getState()));

	const update = React.useCallback((data: T) => {
		const newState = filter(store.getState())
		// shouldComponentUpdate
		if (!isEqual(state, newState)) {
			setState(newState);
		}
	}, [store, filters, state]);

	React.useEffect(() => {
		let unsubscribeDataStore: any = null;

		if (!unsubscribeDataStore && !!store) {
			unsubscribeDataStore = store.subscribe(() => {
				if (!!unsubscribeDataStore && !!store) {
					update()
				}
			});
			update()
		}
		return () => {
			unsubscribeDataStore();
			unsubscribeDataStore = null;
		};
	}, [store, update]);

	return state;
}
