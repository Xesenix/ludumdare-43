import { ContainerModule, interfaces } from 'inversify';
import { Action, DeepPartial, Reducer } from 'redux';

import { DataStoreProvider, IDataStoreProvider } from './data-store.provider';

// prettier-ignore
export const DataStoreModule = <T, A extends Action>(
	// prettier-ignore
	initialValue: DeepPartial<T>,
	reducer: Reducer<T, A>,
) => new ContainerModule((bind: interfaces.Bind) => {
	if (process.env.DEBUG === 'true') {
		console.debug('DataStoreModule:init');
	}
	bind<DeepPartial<T> | undefined>('data-store:initial-data-state').toConstantValue(initialValue);
	bind<Reducer<T, A>>('data-store:action-reducer').toConstantValue(reducer);
	bind<IDataStoreProvider<T, A>>('data-store:provider').toProvider(DataStoreProvider);
});
