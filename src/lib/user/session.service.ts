import { inject } from 'lib/di';

import { IUser } from './user.interfaces';

@inject([
	{ type: 'user:actions', named: 'setUser' },
])
export class SessionService {
	constructor(
		private setUser: (user: IUser) => void,
	) {
	}

	public authenticate(credentials: any) {
		if (!!credentials) {
			this.setUser({ id: 'some-user', roles: ['player']});
		}
	}
}
