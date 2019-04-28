import { interfaces } from 'inversify';
import { Action, DeepPartial, Reducer } from 'redux';

import { IApplication } from 'lib/interfaces';

import { DataStoreProvider, IDataStoreProvider } from './data-store.provider';

// prettier-ignore
export class DataStoreModule {
	public static register<T, A extends Action>(
		// prettier-ignore
		app: IApplication,
		initialValue: DeepPartial<T>,
	) {
		const console = app.get<Console>('debug:console:DEBUG_STORE');
		console.debug('DataStoreModule:register');

		app.bind<DeepPartial<T> | undefined>('data-store:initial-data-state').toConstantValue(initialValue);
		app.bind<Reducer<T, A>>('data-store:action-reducer').toDynamicValue(({ container }: interfaces.Context) => {
			const actionReducer = container.getAll<Reducer>('data-store:reducers');

			return (state: T, action: A) => actionReducer.reduce((prev: T, reducer: Reducer<T, A>) => reducer(prev, action), state);
		});
		app.bind<IDataStoreProvider<T, A>>('data-store:provider').toProvider(DataStoreProvider);
	}
}
