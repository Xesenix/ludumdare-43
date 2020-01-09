export interface IGameState {
	/**
	 * Describes accumulated units
	 */
	population: {
		current: number;
		/** Base max population. */
		max: number;
	};

	command: {
		train: {
			guards: number;
			workers: number;
		};
	};

	/**
	 *
	 */
	workers: {
		current: number;
		killed: { current: number; total: number };
	};

	guards: {
		current: number;
		killed: { current: number; total: number };
	};

	idles: {
		current: number;
		killed: { current: number; total: number };
	};

	children: {
		/** recalculate after each turn finishes */
		current: number;

		/** recalculate after each turn finishes */
		killed: { current: number; total: number };
	};

	resources: {
		/** recalculate after each turn finishes */
		amount: number;

		/** updated by action */
		reserved: number;

		/** recalculate after each turn finishes */
		used: { current: number; total: number };

		stolen: { current: number; total: number };
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
			resources: { current: number; total: number };
			population: { current: number; total: number };
		};
	};

	/** recalculate after each turn finishes */

	turn: number;

	/** recalculate after each turn finishes */
	win: boolean;
	lose: boolean;

	/** recalculate after each turn finishes */
	event: 'orcs';

	weakness: {
		/** updated by action */
		level: number;

		/** initial configuration */
		perLevelReduction: number;
	};
}
