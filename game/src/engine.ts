import pipeline from 'pipeline-operator';

import {
	reduceGatherResources,
	reduceHandleEvent,
	reduceHomes,
	reduceMakeNewPeople,
	reducePayGuards,
	reducePopulationLimit,
	reduceTrainUnits,
	reduceWallModifier,
	reduceWeakness,
} from './reducers';

export class GameEngine {
	constructor(
		public initialState,
		public getState,
		public setState,

	) {}

	public reset = () => {
		this.setState(this.initialState);
	}

	public getAttackPower({ turn }) {
		return (2 + 2 * turn * Math.ceil(turn / 2) + Math.floor(turn / 5) * 20) * Math.pow(1.5, Math.floor(turn / 50));
	}

	public getMaxPopulation() {
		const { homesCount, maxPopulation } = this.getState();
		return homesCount * 20 + maxPopulation;
	}

	public homeCost() {
		const { homesCount } = this.getState();
		return Math.floor((5 + homesCount * 10) * 1.5);
	}

	public canBuildHome() {
		const { resources } = this.getState();
		return resources >= this.homeCost();
	}

	public buildHome = () => {
		const { homesCount, resources } = this.getState();
		this.setState({
			homesCount: homesCount + 1,
			resources: resources - this.homeCost(),
		});
	}

	public wallCost() {
		const { wallPower } = this.getState();
		return Math.floor((wallPower + 5) * 1.25);
	}

	public canBuildWall() {
		const { resources } = this.getState();
		return resources >= this.wallCost();
	}

	public buildWall = () => {
		const { wallPower, resources } = this.getState();
		this.setState({
			wallPower: wallPower + 30,
			resources: resources - this.wallCost(),
		});
	}

	public canMakeUltimateSacrifice() {
		const { idle, resources } = this.getState();

		return idle >= 1000 && resources >= 1000;
	}

	public makeUltimateSacrifice = () => {
		const { turn, sacrificeCount, sacrificedIdle, totalSacrificedIdle, sacrificedResources, totalSacrificedResources } = this.getState();

		this.setState({
			win: true,
			sacrificeCount: sacrificeCount + 1,
			sacrificeCost: this.getSacrificeCost({ turn, sacrificeCount: sacrificeCount + 1}),
			sacrificedIdle: sacrificedIdle + 1000,
			totalSacrificedIdle: totalSacrificedIdle + 1000,
			sacrificedResources: sacrificedResources + 1000,
			totalSacrificedResources: totalSacrificedResources + 1000,

		});
	}

	public getWeaknessDamageReduction({ weaknessReduction, weakness }) {
		return ((1 - Math.pow(1 - weaknessReduction, weakness)) * 100).toFixed(2);
	}

	public canMakeSacrificeForWeakness() {
		const { idle, sacrificeCost } = this.getState();
		return idle >= sacrificeCost;
	}

	public sacrificeResourcesForEnemyWeakness = () => {
		const { weakness, idle, sacrificedIdle, totalSacrificedIdle, sacrificeCost, turn, sacrificeCount } = this.getState();

		this.setState({
			weakness: weakness + 1,
			sacrifice: 'idle',
			sacrificeCount: sacrificeCount + 1,
			sacrificeCost: this.getSacrificeCost({ turn, sacrificeCount: sacrificeCount + 1}),
			idle: idle - sacrificeCost,
			sacrificedIdle: sacrificedIdle + sacrificeCost,
			totalSacrificedIdle: totalSacrificedIdle + sacrificeCost,
		});
	}

	public canMakeSacrificeForImmunity() {
		const { resources, sacrificeCost, immunity } = this.getState();
		return resources >= sacrificeCost && !immunity;
	}

	public sacrificeResourcesForImmunity = () => {
		const { immunity, resources, sacrificedResources, totalSacrificedResources, sacrificeCost, turn, sacrificeCount } = this.getState();

		if (!immunity) {
			this.setState({
				immunity: true,
				sacrifice: 'resources',
				sacrificeCount: sacrificeCount + 1,
				sacrificeCost: this.getSacrificeCost({ turn, sacrificeCount: sacrificeCount + 1}),
				resources: resources - sacrificeCost,
				sacrificedResources: sacrificedResources + sacrificeCost,
				totalSacrificedResources: totalSacrificedResources + sacrificeCost,
			});
		}
	}

	public getSacrificeCost({ turn, sacrificeCount }) {
		return 1 + turn + 5 * sacrificeCount + 5 * Math.floor(turn / 5);
	}

	public canRealeseMoreWorkers = (amount = 1) => {
		const { trainedWorkers, workers } = this.getState();
		return workers + trainedWorkers >= amount;
	}

	public releaseWorker = (amount = 1) => {
		const { trainedWorkers, workers } = this.getState();
		this.setState({ trainedWorkers: Math.max(-workers, trainedWorkers - amount) });
	}

	public canTrainMoreWorkers = (amount = 1) => {
		const { idle, trainedWorkers, trainedGuards } = this.getState();
		return trainedWorkers + trainedGuards + amount <= idle;
	}

	public scheduleWorkerTraining = (amount = 1) => {
		const { trainedWorkers } = this.getState();
		this.setState({ trainedWorkers: trainedWorkers + amount });
	}

	public canRealeseMoreGuards = (amount = 1) => {
		const { trainedGuards, guards } = this.getState();
		return guards + trainedGuards >= amount;
	}

	public releaseGuard = (amount = 1) => {
		const { trainedGuards } = this.getState();
		this.setState({ trainedGuards: Math.max(0, trainedGuards - amount) });
	}

	public canTrainMoreGuards = (amount = 1) => {
		const { idle, trainedWorkers, guards, trainedGuards, resources } = this.getState();
		return guards + trainedGuards < resources && trainedWorkers + trainedGuards < idle;
	}

	public scheduleGuardsTraining = (amount = 1) => {
		const { trainedGuards } = this.getState();
		this.setState({ trainedGuards: trainedGuards + amount });
	}

	public startNewTurn = () => {
		const state = this.getState();
		this.setState({
			attackPower: this.getAttackPower(state),
			babiesKilled: 0,
			// blockNextTurn: true,
			event: 'orcs',
			guardsKilled: 0,
			idleKilled: 0,
			immunity: false,
			maxPopulation: 40,
			resourcesStolen: 0,
			sacrifice: '',
			sacrificeCost: this.getSacrificeCost(state),
			sacrificedChildren: 0,
			sacrificedGuards: 0,
			sacrificedIdle: 0,
			sacrificedResources: 0,
			sacrificedWorkers: 0,
			totallKilled: 0,
			trainedGuards: 0,
			trainedWorkers: 0,
			workersKilled: 0,
		});
	}

	public calculateConsequences() {
		let state = this.getState();

		state = pipeline({
				...state,
				turn: state.turn + 1,
			},
			reduceWeakness,
			reduceWallModifier,
			reduceGatherResources,
			reduceTrainUnits,
			reducePayGuards,
			// reduceHandleSacrifice,
			reduceHandleEvent,
			reduceMakeNewPeople,
			reduceHomes,
			reducePopulationLimit,
		);

		return {
			...state,
			population: state.babies + state.idle + state.workers + state.guards,
		};
	}
}
