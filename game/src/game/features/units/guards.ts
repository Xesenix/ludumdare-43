import { IGameState } from 'game/store';

// === GUARDS_CURRENT

export const getCurrentGuards = (state: IGameState) => state.guards.current;
export const setCurrentGuards = (value: number) => (state: IGameState) => { state.guards.current = value; return state; };
export const changeAmountOfCurrentGuards = (amount: number) => (state: IGameState) => { state.guards.current += amount; return state; };

// === GUARDS_TRAINED

export const getTrainedGuards = (state: IGameState) => state.guards.trained;
export const setTrainedGuards = (value: number) => (state: IGameState) => { state.guards.trained = value; return state; };
export const changeAmountOfTrainedGuards = (amount: number) => (state: IGameState) => { state.guards.trained += amount; return state; };

// === GUARDS_KILLED_IN_THIS_TURN

export const getGuardsKilledInLastTurn = (state: IGameState) => state.guards.killed.current;
export const setGuardsKilledInLastTurn = (value: number) => (state: IGameState) => { state.guards.killed.current = value; return state; };
export const changeAmountOfGuardsKilledInLastTurn = (amount: number) => (state: IGameState) => { state.guards.killed.current += amount; return state; };

// === GUARDS_KILLED_IN_TOTAL

export const getGuardsKilledInTotal = (state: IGameState) => state.guards.killed.total;
export const setGuardsKilledInTotal = (value: number) => (state: IGameState) => { state.guards.killed.total = value; return state; };
export const changeAmountOfGuardsKilledInTotal = (amount: number) => (state: IGameState) => { state.guards.killed.total += amount; return state; };
