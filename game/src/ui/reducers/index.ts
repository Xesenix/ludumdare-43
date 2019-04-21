import { IValueAction } from 'lib/interfaces';
import {
	defaultUIState as baseUIState,
	IUIState as IBaseUIState,
	uiReducer as baseReducer,
} from 'lib/ui';

import { SET_COMPACT_MODE } from '../actions';

export interface IUIState extends IBaseUIState {
	compactMode: boolean;
}

export const defaultUIState: IUIState = {
	...baseUIState,
	compactMode: false,
};

export function uiReducer<S extends IUIState | undefined, A extends IValueAction<any>>(state: S = defaultUIState as S, action: A): S {
	state = baseReducer(state, action);

	switch (action.type) {
		case SET_COMPACT_MODE: {
			const { value } = action as IValueAction<boolean>;
			return {
				...(state as any),
				compactMode: value,
			};
		}
	}
	return state;
}
