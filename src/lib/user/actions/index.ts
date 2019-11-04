import { IValueAction } from 'lib/interfaces';

import { IUser } from '../user.interfaces';

export const SET_USER = 'UI_SET_USER';

export const createSetUserAction = (value: IUser): IValueAction<IUser> => ({
	type: SET_USER,
	value,
});
