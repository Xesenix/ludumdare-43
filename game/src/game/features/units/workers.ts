import { IGameState } from 'game/store';

// === WORKERS_CURRENT

export const getCurrentWorkers = (state: IGameState) => state.workers.current;
export const setCurrentWorkers = (value: number) => (state: IGameState) => { state.workers.current = value; return state; };
export const changeAmountOfCurrentWorkers = (amount: number) => (state: IGameState) => { state.workers.current += amount; return state; };

// === WORKERS_TRAINED

export const getTrainedWorkers = (state: IGameState) => state.workers.trained;
export const setTrainedWorkers = (value: number) => (state: IGameState) => { state.workers.trained = value; return state; };
export const changeAmountOfTrainedWorkers = (amount: number) => (state: IGameState) => { state.workers.trained += amount; return state; };

// === WORKERS_KILLED_IN_THIS_TURN

export const getWorkersKilledInLastTurn = (state: IGameState) => state.workers.killed.current;
export const setWorkersKilledInLastTurn = (value: number) => (state: IGameState) => { state.workers.killed.current = value; return state; };
export const changeAmountOfWorkersKilledInLastTurn = (amount: number) => (state: IGameState) => { state.workers.killed.current += amount; return state; };

// === WORKERS_KILLED_IN_TOTAL

export const getWorkersKilledInTotal = (state: IGameState) => state.workers.killed.total;
export const setWorkersKilledInTotal = (value: number) => (state: IGameState) => { state.workers.killed.total = value; return state; };
export const changeAmountOfWorkersKilledInTotal = (amount: number) => (state: IGameState) => { state.workers.killed.total += amount; return state; };
