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
	class DIContainerConsumer extends React.Component<T, {}> {
		public render() {
			return <DIContext.Consumer>{(container: Container | null) => <Consumer {...this.props} di={container} />}</DIContext.Consumer>;
		}
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
 * @template T component properties interface including properties injected via dependency injection and also dependency injection container
 * @param Consumer component into which we want to inject dependencies from dependency container
 * @param select map dependencies from container to properties names injected into decorated component properties
 * @returns component with injected values from DI container
 */
export function connectToInjector<T, I = any>(
	// prettier-ignore
	select: { [K in keyof I]: { dependencies: string[], value?: (...dependencies: any[]) => Promise<I[K]> } },
	Preloader: React.FunctionComponent = () => <>loading...</>,
) {
	return (Consumer: React.ComponentType<T>) => {
		const keys = Object.keys(select);
		const [ , decoratedComponentNameMatch = '' ] = componentNameRegexp.exec(Consumer.toString()) || [];
		const className = `DI.Injector(${decoratedComponentNameMatch})`;

		class DIInjector extends React.Component<T & { di: Container | null }> {
			private isMounted = false;

			public componentDidMount() {
				const { di } = this.props;

				this.isMounted = true;

				if (!!di) {
					const configs = Object.values<{ dependencies: string[]; value?: (...dependencies: any[]) => Promise<any> }>(select);

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
						if (this.isMounted) {
							const state = values.reduce((result, value, index) => {
								result[keys[index]] = value;
								return result;
							}, {});
							this.setState(state);
						}
					});
				}
			}

			public componentWillUnmount() {
				this.isMounted = false;
			}

			public render() {
				if (!!this.state) {
					return <Consumer {...this.props} {...this.state} />;
				}

				return <Preloader />;
			}
		}

		// changes name for debuging
		(DIInjector as any).displayName = className;

		hoistNonReactStatic(DIInjector, Consumer);

		return connectToDI<T>(DIInjector) as React.ComponentType<T>;
	};
}
