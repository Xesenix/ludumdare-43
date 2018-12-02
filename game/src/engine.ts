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
		return 2 + 2 * turn * Math.ceil(turn / 2) + Math.floor(turn / 5) * 20;
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

	public canMakeSacraficeForWeakness() {
		const { idle, sacraficeCost } = this.getState();
		return idle >= sacraficeCost;
	}

	public sacraficeResourcesForEnemyWeakness = () => {
		const { weakness, idle, sacraficedIdle, sacraficeCost, turn, sacraficeCount } = this.getState();

		this.setState({
			weakness: weakness + 1,
			sacrafice: 'idle',
			sacraficeCount: sacraficeCount + 1,
			sacraficeCost: this.getSacrificeCost({ turn, sacraficeCount: sacraficeCount + 1}),
			idle: idle - sacraficeCost,
			sacraficedIdle: sacraficedIdle + sacraficeCost,
		});
	}

	public canMakeSacraficeForImmunity() {
		const { resources, sacraficeCost, immunity } = this.getState();
		return resources >= sacraficeCost && !immunity;
	}

	public sacraficeResourcesForImmunity = () => {
		const { immunity, resources, sacraficedResources, sacraficeCost, turn, sacraficeCount } = this.getState();

		if (!immunity) {
			this.setState({
				immunity: true,
				sacrafice: 'resources',
				sacraficeCount: sacraficeCount + 1,
				sacraficeCost: this.getSacrificeCost({ turn, sacraficeCount: sacraficeCount + 1}),
				resources: resources - sacraficeCost,
				sacraficedResources: sacraficedResources + sacraficeCost,
			});
		}
	}

	public getSacrificeCost({ turn, sacraficeCount }) {
		return 1 + 2 * turn + 5 * (sacraficeCount + 1);
	}

	public canRealeseMoreWorkers = (amount = 1) => {
		const { trainedWorkers, workers } = this.getState();
		return workers + trainedWorkers >= amount;
	}

	public releaseWorker = (amount = 1) => {
		const { trainedWorkers } = this.getState();
		this.setState({ trainedWorkers: Math.max(0, trainedWorkers - amount) });
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
			blockNextTurn: true,
			event: 'orcs',
			guardsKilled: 0,
			idleKilled: 0,
			immunity: false,
			maxPopulation: 40,
			resourcesStolen: 0,
			sacrafice: '',
			sacraficeCost: this.getSacrificeCost(state),
			sacraficedChildren: 0,
			sacraficedGuards: 0,
			sacraficedIdle: 0,
			sacraficedResources: 0,
			sacraficedWorkers: 0,
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
			// reduceHandleSacrafice,
			reduceHandleEvent,
			reduceMakeNewPeople,
			reduceHomes,
			reducePopulationLimit,
		);

		return {
			...state,
			people: state.babies + state.idle + state.workers + state.guards,
		};
	}
}
