import {
	// prettier-ignore
	changeAmountOfResources,
	changeAmountOfResourcesStolenInLastTurn,
	changeAmountOfResourcesStolenInTotal,
} from 'game/features/resources/resources';
import { IGameState } from 'game/store';

export const stealResources = (amount: number) => (state: IGameState): IGameState => {
	changeAmountOfResources(-amount)(state);
	changeAmountOfResourcesStolenInLastTurn(amount)(state);
	changeAmountOfResourcesStolenInTotal(amount)(state);

	return state;
};
