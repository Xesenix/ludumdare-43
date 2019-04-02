import {
	// prettier-ignore
	getReservedResources,
	getResourcesAmount,
} from 'game/features/resources/resources';
import { IGameState } from 'game/store';

export const hasFreeResources = (amount: number) => (state: IGameState): boolean => {
	const reserved = getReservedResources(state);
	const resources = getResourcesAmount(state);

	return reserved + amount <= resources;
};
