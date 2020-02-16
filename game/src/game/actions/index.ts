import { IValueAction } from 'lib/interfaces';

import { IGameState } from '../interfaces';

export const GAME_STATE_UPDATE = 'GAME_STATE_UPDATE';

export const createSetGameStateAction = (value: IGameState): IValueAction<IGameState> => ({
	type: GAME_STATE_UPDATE,
	value,
});
