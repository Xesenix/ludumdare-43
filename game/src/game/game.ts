import pipeline from 'pipeline-operator';

import { trainGuardsRule } from './actions/training';
import { populationReport } from './selectors/population';
import { DataStore, IGameState } from './store';

export class Game {
	constructor(
		private dataStore: DataStore<IGameState>,
	) {

	}

	public nextTurn() {
		return pipeline(
			this.dataStore.getState(),
			this.gameTurn,
			this.dataStore.setState,
		);
	}

	private gameTurn = (state: IGameState) => pipeline(
		state,
		trainGuardsRule,
		populationReport,
	)
}

