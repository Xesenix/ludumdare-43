import pipeline from 'pipeline-operator';
import { IGameState } from './interface';

export default ({
	currentUnitsSelector,
	currentUnitsKilledSelector,
	currentResourcesSelector,
	currentResourcesStolenSelector,
	currentUnitsChange,
	currentUnitsKilledChange,
	totalUnitsKilledChange,
	currentResourcesChange,
	currentResourcesStolenChange,
	totalResourcesStolenChange,
	turnInc,
	randomJunkWrite,
}) => ({
	incomeRule: (state: IGameState) => {
		return pipeline(state, currentResourcesChange(Math.min(Math.floor(currentUnitsSelector(state) / 20), 100)));
	},

	populationIncRule: (state: IGameState) => {
		return pipeline(state, currentUnitsChange(Math.min(Math.ceil(currentUnitsSelector(state) / 4), currentResourcesSelector(state))));
	},

	warRule: (state: IGameState) => {
		const killedPopulation = Math.floor(currentUnitsSelector(state) / 10);
		const resourcesStolen = Math.floor(currentResourcesSelector(state) / 5);

		return pipeline(
			state,
			randomJunkWrite(killedPopulation),
			currentUnitsChange(-killedPopulation),
			currentUnitsKilledChange(killedPopulation),
			currentResourcesChange(-resourcesStolen),
			currentResourcesStolenChange(resourcesStolen),
		);
	},

	turnEndRule: (state: IGameState) => {
		const killedPopulation = currentUnitsKilledSelector(state);
		const resourcesStolen = currentResourcesStolenSelector(state);
		return pipeline(
			state,
			totalUnitsKilledChange(killedPopulation),
			currentUnitsKilledChange(-killedPopulation),
			totalResourcesStolenChange(resourcesStolen),
			currentResourcesStolenChange(-resourcesStolen),
			turnInc,
		);
	},
});
