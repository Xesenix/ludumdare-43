export interface IGameState {
	turn: number;
	units: {
		current: number;
		killed: { current: number; total: number };
	};
	resources: {
		current: number;
		stolen: { current: number; total: number };
	};
	junk: number[];
}
