import {
	// prettier-ignore
	getResourcesAmount,
	getReservedResources,
} from 'game/features/resources/resources';
import { IGameState } from 'game/store';

export const hasFreeResources = (amount: number) => (state: IGameState): boolean => {
	const reserved = getReservedResources(state);
	const resources = getResourcesAmount(state);

	return reserved + amount <= resources;
};
