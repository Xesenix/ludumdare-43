import { IValueAction } from 'lib/interfaces';

export const SET_COMPACT_MODE = 'UI_SET_COMPACT_MODE';

export const createSetCompactModeAction = (value: boolean): IValueAction<boolean> => ({
	type: SET_COMPACT_MODE,
	value,
});
