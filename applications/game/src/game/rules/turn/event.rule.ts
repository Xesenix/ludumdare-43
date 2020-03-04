import { IGameState } from 'game/interfaces';
import { handleOrcAttack } from 'game/systems/orc-attack';

export const eventRule = (state: IGameState) => {
	switch (state.event) {
		case 'orcs':
			return handleOrcAttack(state);
	}

	return state;
};
