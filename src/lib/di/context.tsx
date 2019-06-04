import hoistNonReactStatic from 'hoist-non-react-statics';
import { Container } from 'inversify';
import * as React from 'react';

// tslint:disable:max-classes-per-file

export const DIContext = React.createContext<Container | null>(null);

/**
 * Add DI container to decorated component properties.
 *
 * @export
 * @template T component properties interface including dependency injection container under `di` property
 * @param Consumer component into which we want to inject dependency injection container
 * @returns component with injected DI container property under `di` property
 */
export function connectToDI<T>(Consumer: React.ComponentType<T & { di: Container | null }>) {
	function DIContainerConsumer(props: T) {
		const container: Container | null = React.useContext(DIContext);
		return <Consumer {...props} di={container} />;
	}

	// changes name for debuging
	(DIContainerConsumer as any).displayName = 'DIContainer.Consumer';

	hoistNonReactStatic(DIContainerConsumer, Consumer);

	return DIContainerConsumer;
}

const componentNameRegexp = /function ([a-zA-Z0-9_]+)\(/;

/**
 * Map dependencies from DI container into component properties.
 *
 * @export
 * @template T interface for properties injected via component properties
 * @template I interface for properties injected via dependency injection
 * @param Consumer component into which we want to inject dependencies from dependency container
 * @param select map dependencies from container to properties names injected into decorated component properties
 * @returns component with injected values from DI container
 */
export function connectToInjector<T, I = any>(
	// prettier-ignore
	select: { [K in keyof I]: { dependencies: string[], value?: (...dependencies: any[]) => Promise<I[K]> } },
	Preloader: React.FunctionComponent = () => <>loading...</>,
) {
	return <E extends T = T>(Consumer: React.ComponentType<T | I>) => {
		const [ , decoratedComponentNameMatch = '' ] = componentNameRegexp.exec(Consumer.toString()) || [];
		const className = `DI.Injector(${decoratedComponentNameMatch})`;

		function DIInjector(props: T) {
			const injectedState = useInjector<I>(select);

			if (Object.keys(injectedState).length > 0) {
				return <Consumer {...props} {...injectedState} />;
			}

			return <Preloader />;
		}

		// changes name for debuging
		(DIInjector as any).displayName = className;

		hoistNonReactStatic(DIInjector, Consumer);

		return DIInjector as React.ComponentType<E>;
	};
}

/**
 * @template I interface for properties injected via dependency injection
 * @param select map dependencies from container to properties names injected into decorated component properties
 */
export function useInjector<I>(select: { [K in keyof I]: { dependencies: string[], value?: (...dependencies: any[]) => Promise<I[K]> } }) {
	const [injectedState, setState] = React.useState<I>({});
	const keys = Object.keys(select);
	const di: Container | null = React.useContext(DIContext);

	React.useEffect(() => {
		let isMounted: boolean = true;

		if (!!di) {
			const configs = Object.values<{
				dependencies: string[];
				value?: (...dependencies: any[]) => Promise<any>;
			}>(select);

			const nameRegexp = /\@([a-zA-Z0-9_-]+)/;
			const callRegexp = /(\(\))/;
			const multipleRegexp = /(\[\])$/;

			Promise.all(
				configs.map(
					// prettier-ignore
					({
						value = (dep: any) => Promise.resolve(dep),
						dependencies,
					}) => value.apply({}, dependencies.map((key) => {
						const nameMatch = nameRegexp.exec(key);
						const callMatch = callRegexp.exec(key);
						const multipleMatch = multipleRegexp.exec(key);
						const callable = !!callMatch;
						let injection: any;

						// handling keys with call signature:
						// some_key()
						if (!!callMatch) {
							key = key.replace(callMatch[0], '');
						}

						if (!!multipleMatch) {
							key = key.replace(multipleMatch[0], '');
						}

						// handling keys with named dependencies like:
						// some_key@name
						if (!!multipleMatch) {
							if (!!nameMatch) {
								key = key.replace(nameMatch[0], '');
								injection = di.getAllNamed<any>(key, nameMatch[1]);
							} else {
								injection = di.getAll<any>(key);
							}
						} else {
							if (!!nameMatch) {
								key = key.replace(nameMatch[0], '');
								injection = di.getNamed<any>(key, nameMatch[1]);
							} else {
								injection = di.get<any>(key);
							}
						}

						return callable ? injection() : injection;
					})),
				),
			)
			.then((values: any[]) => {
				if (isMounted) {
					const state = values.reduce((result, value, index) => {
						result[keys[index]] = value;
						return result;
					}, {});
					setState(state);
				}
			});
		}

		return () => {
			isMounted = false;
		};
	}, [di]);

	return injectedState;
}
