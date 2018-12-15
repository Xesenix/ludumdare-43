import { EventEmitter } from 'events';

export interface IGameState {
	/**
	 * Describe accumulated
	 */
	population: {
		current: number;
		trained: number;
		killed: number;
		max: number;
	};

	/**
	 *
	 */
	workers: {
		current: number;
		killed: number;
		trained: number;
		max: number;
	};

	/**
	 *
	 */
	guards: {
		current: number;
		trained: number;
		killed: number;
		max: number;
	};

	/**
	 *
	 */
	idles: {
		current: number;
		trained: number;
		killed: number;
		max: number;
	};

	children: {
		current: number;
		trained: number;
		killed: number;
		max: number;
	};

	/**
	 *
	 */
	resources: {
		amount: number;
		reserved: number;
		used: number;
	};
	cottages: {
		level: number;
	};
	walls: {
		level: number;
	};
	sacrifice: {
		count: number;
		cost: number;
	};

	turn: number;
	event: 'sacrifice' | 'orcs';
	weakness: number;
	immunity: boolean;
	attackPower: number;
}

export class DataStore<T> {
	constructor(
		private state: T,
		private em: EventEmitter,
	) {}

	public setState = (change: Partial<T>) => {
		this.state = { ...this.state as any, ...change as any };
		this.em.emit('state:update', this.state);
	}

	public getState = () => {
		return this.state;
	}
}
