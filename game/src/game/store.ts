import { IEventEmitter } from 'lib/interfaces';

export class DataStore<T> {
	constructor(
		// prettier-ignore
		private state: T,
		private em: IEventEmitter,
	) {
	}

	public setState = (change: T) => {
		this.state = change;
		this.em.emit('state:update', this.state);
	}

	public getState = () => {
		return this.state;
	}
}
