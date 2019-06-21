import { IValueAction } from 'lib/interfaces';

import { IGameState } from '../game.interfaces';

export function reducer<S extends { game: IGameState } | undefined, A extends IValueAction<any>>(state: S, action: A) {
	if (action.type === 'GAME_STATE_UPDATE') {
		state = {
			...state,
			game: action.value,
		};
	}
	return state;
}
