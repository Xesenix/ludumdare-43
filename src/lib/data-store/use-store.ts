import { pickBy } from 'lodash';
import * as React from 'react';

export const filterByKeys = <T extends object>(keys: (keyof T)[]) => (data: T): T => pickBy(data, (_, key: any) => keys.indexOf(key) >= 0) as T;

export function useStore<S extends object>(store: Store<S>, filters: (keyof S)[]) {
	// console.log('useStore:EFFECT START');
	let unsubscribeDataStore: any = null;
	const filter: (data: S) => S = filterByKeys<S>(filters);

	const [state, setState] = React.useState(filter(store.getState()));

	React.useEffect(() => {
		if (!unsubscribeDataStore && !!store) {
			console.log('useStore:EFFECT BIND');
			unsubscribeDataStore = store.subscribe(() => {
				if (!!store) {
					setState(filter(store.getState()));
				}
			});
			setState(filter(store.getState()));
		}
		return () => {
			unsubscribeDataStore();
			console.log('useStore:EFFECT END');
		};
	}, [store]);

	return state;
}
