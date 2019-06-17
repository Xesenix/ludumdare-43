import { IGameState } from 'game';
import {
	// prettier-ignore
	changeAmountOfResources,
	changeAmountOfResourcesStolenInLastTurn,
	changeAmountOfResourcesStolenInTotal,
} from 'game/models/resources/resources';

export const stealResources = (amount: number) => (state: IGameState): IGameState => {
	changeAmountOfResources(-amount)(state);
	changeAmountOfResourcesStolenInLastTurn(amount)(state);
	changeAmountOfResourcesStolenInTotal(amount)(state);

	return state;
};
