import { IGameState } from 'game';

// === CHILDREN_CURRENT

export const getCurrentChildren = (state: IGameState) => state.children.current;
export const setCurrentChildren = (value: number) => (state: IGameState) => { state.children.current = value; return state; };
export const changeAmountOfCurrentChildren = (amount: number) => (state: IGameState) => { state.children.current += amount; return state; };

// === CHILDREN_KILLED_IN_THIS_TURN

export const getChildrenKilledInLastTurn = (state: IGameState) => state.children.killed.current;
export const setChildrenKilledInLastTurn = (value: number) => (state: IGameState) => { state.children.killed.current = value; return state; };
export const changeAmountOfChildrenKilledInLastTurn = (amount: number) => (state: IGameState) => { state.children.killed.current += amount; return state; };

// === CHILDREN_KILLED_IN_TOTAL

export const getChildrenKilledInTotal = (state: IGameState) => state.children.killed.total;
export const setChildrenKilledInTotal = (value: number) => (state: IGameState) => { state.children.killed.total = value; return state; };
export const changeAmountOfChildrenKilledInTotal = (amount: number) => (state: IGameState) => { state.children.killed.total += amount; return state; };
