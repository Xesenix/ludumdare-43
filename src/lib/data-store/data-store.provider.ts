import { interfaces } from 'inversify';
import { Action, applyMiddleware, compose, createStore, DeepPartial, Store } from 'redux';
import { load, save } from 'redux-localstorage-simple';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

export type IDataStoreProvider<T, A extends Action> = () => Promise<Store<T, A>>;

export function DataStoreProvider<T, A extends Action>(context: interfaces.Context) {
	const debug: boolean = process.env.DEBUG === 'true';
	const debugRedux: boolean = debug && process.env.DEBUG_REDUX === 'true';
	let store: Store<T, A>;

	return (): Promise<Store<T, A>> => {
		if (context.container.isBound('data-store')) {
			return Promise.resolve(context.container.get<Store<T, A>>('data-store'));
		}

		try {
			const initialState = context.container.get<DeepPartial<T> | undefined>('data-store:initial-data-state');
			const reducer = context.container.get<(state: T | undefined, action: any) => T>('data-store:action-reducer');
			const logger = createLogger({
				duration: true,
				timestamp: true,
			});
			// prettier-ignore
			const composeEnhancers = debugRedux && typeof window === 'object'
				&& typeof (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined'
				? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
						// Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
					})
				: compose;

			const states = [
				'effectsMuted',
				'effectsVolume',
				'language',
				'musicMuted',
				'musicVolume',
				'mute',
				'theme',
				'volume',
			];

			const namespace = 'ui';

			const persist = save({
				debounce: 1000,
				namespace,
				states,
			});

			store = createStore<T | undefined, A, any, any>(
				// prettier-ignore
				reducer,
				load({
					namespace,
					preloadedState: initialState,
					states,
				}),
				composeEnhancers(debugRedux ? applyMiddleware(logger, thunk, persist) : applyMiddleware(thunk, persist)),
			);

			context.container.bind<Store<T, A>>('data-store').toConstantValue(store);

			return Promise.resolve(store);
		} catch (error) {
			return Promise.reject(error);
		}
	};
}
