import { Container } from 'inversify';

/**
 * Uses context container to resolve dependencies.
 *
 * @param container dependency injection container
 * @param dependencies list identifiers of required dependencies in addition if identifier ends with '()' it will resolve provider result before injecting it
 */
export function getDependencies<T = any>(
	container: Container,
	dependencies: string[],
) {
	const nameRegexp = /\@([a-zA-Z0-9_-]*)/;
	const callRegexp = /(\(\))/;
	const multipleRegexp = /(\[\])$/;
	return Promise.all<T>(
		dependencies.map(async (key: string) => {
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

			if (!!multipleMatch) {
				if (!!nameMatch) {
					// some_key@name[]
					key = key.replace(nameMatch[0], '');
					injection = container.getAllNamed<any>(key, nameMatch[1]);
				} else {
					// some_key[]
					injection = container.getAll<any>(key);
				}

				return Promise.all(callable ? injection.map((dep) => dep()) : injection);
			} else {
				if (!!nameMatch) {
					// some_key@name
					key = key.replace(nameMatch[0], '');
					injection = container.getNamed<any>(key, nameMatch[1]);
				} else {
					// some_key
					injection = container.get<any>(key);
				}
			}

			return Promise.resolve(callable ? injection() : injection);
		}),
	);
}
