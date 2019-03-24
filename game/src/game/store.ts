export interface IEventEmitter {
	emit( name: string, payload: any ): void;
}

export interface IGameState {
	/**
	 * Describes accumulated units
	 */
	population: {
		current: number;
		/** Base max population. */
		max: number;
	};

	/**
	 *
	 */
	workers: {
		current: number;

		killed: { current: number, total: number };

		/** updated by action */
		trained: number;
	};

	guards: {
		current: number;

		/** updated by action */
		trained: number;
		killed: { current: number, total: number };
	};

	idles: {
		current: number;
		killed: { current: number, total: number };
	};

	children: {
		/** recalculate after each turn finishes */
		current: number;

		/** recalculate after each turn finishes */
		killed: { current: number, total: number };
	};

	resources: {
		/** recalculate after each turn finishes */
		amount: number;

		/** updated by action */
		reserved: number;

		/** recalculate after each turn finishes */
		used: { current: number, total: number };

		stolen: { current: number, total: number };
	};

	cottages: {
		/** updated by action */
		level: number;
	};

	walls: {
		/** updated by action */
		level: number;

		/** initial configuration */
		perLevelReduction: number;

		/** initial configuration */
		costMultiplier: number;
	};

	sacrifice: {
		/** updated by action */
		count: number;
		cost: {
			resources: { current: number, total: number };
			population: { current: number, total: number };
		};
	};

	/** recalculate after each turn finishes */

	turn: number;

	/** recalculate after each turn finishes */
	win: boolean;
	lose: boolean;

	/** recalculate after each turn finishes */
	event: 'sacrifice' | 'orcs';

	weakness: {
		/** updated by action */
		level: number;

		/** initial configuration */
		perLevelReduction: number;
	};

	/** false after each turn finish */
	immunity: boolean;
}

export class DataStore<T> {
	constructor(
		private state: T,
		private em: IEventEmitter,
	) {
	}

	public setState = (change: Partial<T>) => {
		this.state = { ...this.state as any, ...change as any };
		this.em.emit('state:update', this.state);
	}

	public getState = () => {
		return this.state;
	}
}
