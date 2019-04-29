import { INITIALIZE } from 'lib/data-store';
import { IValueAction } from 'lib/interfaces';
import { defaultUIState as baseUIState } from 'lib/ui';

import { SET_COMPACT_MODE } from '../actions';
import { IUIState } from '../ui.interfaces';

export const defaultUIState: IUIState = {
	...baseUIState,
	compactMode: false,
};

export function reducer<S extends IUIState | undefined, A extends IValueAction<any>>(state: S = defaultUIState as S, action: A): S {
	switch (action.type) {
		case INITIALIZE: {
			return { ...defaultUIState, ...state };
		}
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
