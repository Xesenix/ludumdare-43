import * as inversify from 'inversify';
import { interfaces as ii } from 'inversify';
import { helpers, interfaces as vi } from 'inversify-vanillajs-helpers';
import { memoize } from 'lodash';
import 'reflect-metadata';

type DependencyType = string | symbol | ii.Newable<any> | ii.Abstract<any> | vi.BasicInjection | vi.NamedInjection | vi.TaggedInjection;

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
		return inversify.decorate(inversify.injectable(), target);
	};
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
export function createProvider(key, dependencies, factory, shouldResolve = true, cache = true) {
	const cacheResult = cache ? memoize : (cb) => cb;
	return cacheResult(({ container }: ii.Context) => async () => {
		const console = container.get<Console>('debug:console:DEBUG_DI');
		console.debug('annotation:injectDecorator', {
			key,
			dependencies,
			factory,
		});
		const klass = factory(
			...(await Promise.all(
				dependencies.map((dep: string) => {
					const result = container.get<any>(dep.replace('()', ''));
					if (dep.indexOf('()') > -1) {
						try {
							return result() as Promise<any>;
						} catch (err) {
							console.error('error:', dep, result, err);
							return Promise.reject(err);
						}
					}
					return Promise.resolve(result);
				}),
			)),
		);

		if (shouldResolve) {
			if (!container.isBound(key)) {
				container
					.bind(key)
					.to(klass)
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
export function createClassProvider(key: string, dependencies: string[], factory: (...args: any[]) => any) {
	return createProvider(key, dependencies, factory, false);
}
