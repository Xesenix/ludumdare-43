import { EventEmitter } from 'events';
import { Container } from 'inversify';
import { Action } from 'redux';

export interface IApplication extends Container {
	eventManager: EventEmitter;

	boot: () => Promise<IApplication>;
}

export interface IValueAction<T> extends Action {
	value: T;
}

export type ICreateSetAction<T> = (value: T) => IValueAction<T>;

export interface IEventEmitter {
	emit(name: string, payload: any): void;
	on(name: string, cb: (...params: any[]) => any): void;
}
