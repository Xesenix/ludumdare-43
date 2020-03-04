import { IGameState } from 'game';

import { getTrainedGuards } from './guards';
import { getTrainedWorkers } from './workers';

// === IDLES_CURRENT

export const getCurrentIdles = (state: IGameState) => state.idles.current;
export const setCurrentIdles = (value: number) => (state: IGameState) => { state.idles.current = value; return state; };
export const changeAmountOfCurrentIdles = (amount: number) => (state: IGameState) => { state.idles.current += amount; return state; };

// === COMPOSED

export const getFreeIdles = (state: IGameState) => getCurrentIdles(state) - getTrainedGuards(state) - getTrainedWorkers(state);

// === IDLES_KILLED_IN_THIS_TURN

export const getIdlesKilledInLastTurn = (state: IGameState) => state.idles.killed.current;
export const setIdlesKilledInLastTurn = (value: number) => (state: IGameState) => { state.idles.killed.current = value; return state; };
export const changeAmountOfIdlesKilledInLastTurn = (amount: number) => (state: IGameState) => { state.idles.killed.current += amount; return state; };

// === IDLES_KILLED_IN_TOTAL

export const getIdlesKilledInTotal = (state: IGameState) => state.idles.killed.total;
export const setIdlesKilledInTotal = (value: number) => (state: IGameState) => { state.idles.killed.total = value; return state; };
export const changeAmountOfIdlesKilledInTotal = (amount: number) => (state: IGameState) => { state.idles.killed.total += amount; return state; };
