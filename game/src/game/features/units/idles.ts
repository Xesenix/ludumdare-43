import { IGameState } from 'game/store';

import {
	// prettier-ignore
	changeAmountOf,
	get,
	set,
} from 'game/data';
import { getTrainedGuards } from './guards';
import { getTrainedWorkers } from './workers';

// === IDLES_CURRENT

export const getCurrentIdles = get<number>('idles.current', 0);
export const setCurrentIdles = set<number>('idles.current');
export const changeAmountOfCurrentIdles = changeAmountOf('idles.current');

// === COMPOSED

export const getFreeIdles = (state: IGameState) => getCurrentIdles(state) - getTrainedGuards(state) - getTrainedWorkers(state);

// === IDLES_KILLED_IN_THIS_TURN

export const getIdlesKilledInLastTurn = get<number>('idles.killed.current', 0);
export const setIdlesKilledInLastTurn = set<number>('idles.killed.current');
export const changeAmountOfIdlesKilledInLastTurn = changeAmountOf('idles.killed.current');

// === IDLES_KILLED_IN_TOTAL

export const getIdlesKilledInTotal = get<number>('idles.killed.total', 0);
export const setIdlesKilledInTotal = set<number>('idles.killed.total');
export const changeAmountOfIdlesKilledInTotal = changeAmountOf('idles.killed.total');
