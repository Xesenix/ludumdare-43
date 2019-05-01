import { pickBy } from 'lodash';

export const filterByKeys = <T>(keys: (keyof T)[]) => (data: T): T => pickBy(data, (_, key) => keys.indexOf(key) >= 0) as T;
