import * as inversify from 'inversify';
import { Container, interfaces as ii } from 'inversify';
import memoize from 'lodash-es/memoize';

import { helpers, interfaces as vi } from './helpers';

type DependencyType = string | symbol | ii.Newable<any> | ii.Abstract<any> | vi.IBasicInjection | vi.INamedInjection | vi.ITaggedInjection;

/**
 * Annotate class with constructor dependency injection.
 */
export function inject(dependencies?: DependencyType[]): any {
	if (process.env.DEBUG_DI === 'true') {
		console.debug('annotation:inject:decorate', dependencies, inversify.injectable());
	}
	return (target, key, descriptor) => {
		if (process.env.DEBUG_DI === 'true') {
			console.debug('annotation:inject', target.name, dependencies);
		}
		helpers.annotate(target, dependencies);

		return target;
	};
}

/**
 * Annotate classes that can be injected as dependencies.
 */
export function injectable(): any {
	return (target, key, descriptor) => {
		if (process.env.DEBUG_DI === 'true') {
			console.debug('annotation:injectable', target.name);
		}
		inversify.decorate(inversify.injectable(), target);

		return target;
	};
}

/**
 * Uses context container to inject named dependencies into function.
 *
 * @param container dependency injection container
 * @param key unique identifier that will be used internally to store result of factory in container
 * @param dependencies list identifiers of required dependencies in addition if identifier ends with '()' it will resolve provider result before injecting it
 * @param factory factory function into which we want to inject dependencies
 */
export async function resolveDependencies<T = any>(
	container: Container,
	dependencies: string[],
	factory: (...args: any[]) => T,
) {
	const nameRegexp = /\@([a-zA-Z0-9_-]+)/;
	const callRegexp = /(\(\))/;
	const multipleRegexp = /(\[\])$/;
	const klass = factory(
		...(await Promise.all(
			dependencies.map(async (key: string) => {
				// TODO: remove duplication implemented in use-injector
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
						injection = container.getAllNamed<any>(key, nameMatch[1]);
					} else {
						injection = container.getAll<any>(key);
					}

					return Promise.all(callable ? injection.map((dep) => dep()) : injection);
				} else {
					if (!!nameMatch) {
						key = key.replace(nameMatch[0], '');
						injection = container.getNamed<any>(key, nameMatch[1]);
					} else {
						injection = container.get<any>(key);
					}
				}

				return callable ? injection() : injection;
			}),
		)),
	);

	return klass;
}

/**
 * Uses context container to inject named dependencies into function.
 *
 * @param key unique identifier that will be used internally to store result of factory in container
 * @param dependencies list identifiers of required dependencies in addition if identifier ends with '()' it will resolve provider result before injecting it
 * @param factory factory function into which we want to inject dependencies
 * @param shouldResolve if true will try resolve factory result from DIC else will return result of factory without further modifications
 * @returns provider function
 */
export function createProvider<T = any>(
	key: string,
	dependencies: string[],
	factory: (...args: any[]) => T,
	shouldResolve: boolean = true,
	cache: boolean = true,
) {
	const cacheResult: (cb: (ctx: ii.Context) => any) => any = cache ? memoize : (cb: (ctx: ii.Context) => any) => cb;
	return cacheResult(({ container }: ii.Context) => async () => {
		const console = container.get<Console>('debug:console:DEBUG_DI');
		console.debug('annotation:injectDecorator', {
			key,
			dependencies,
			factory,
		});

		const klass = await resolveDependencies<T>(container, dependencies, factory);

		if (shouldResolve) {
			if (!container.isBound(key)) {
				container
					.bind(key)
					.to(klass as any)
					.inSingletonScope();
			}
			return container.get(key);
		}

		return klass;
	});
}

/**
 * For classes that cannot be instantiated by DI we can create factories into which
 * we inject necessary dependencies.
 *
 * @export
 * @param key unique identifier that will be used internally to store result of factory in container
 * @param dependencies list identifiers of required dependencies in addition if identifier ends with '()' it will resolve provider result before injecting it
 * @param factory factory function into which we want to inject dependencies
 * @returns provider function returning object created by factory without further resolving
 */
export function createClassProvider<T = any>(key: string, dependencies: string[], factory: (...args: any[]) => any) {
	return createProvider<T>(key, dependencies, factory, false);
}
