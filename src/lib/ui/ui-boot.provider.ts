import { interfaces } from 'inversify';
import { Store } from 'redux';

import { ICreateSetAction } from '../interfaces';

export function UIBootProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	console.debug('UIBootProvider');

	return () => container.get<() => Promise<Store<any, any>>>('data-store:provider')()
		.then((store: Store<any, any>) => {
			console.debug('UIBootProvider:base');
			const createSetMutedAction = container.get<ICreateSetAction<boolean>>('data-store:action:create:set-muted');
			const createSetMusicMutedAction = container.get<ICreateSetAction<boolean>>('data-store:action:create:set-music-muted');
			const createSetEffectsMutedAction = container.get<ICreateSetAction<boolean>>('data-store:action:create:set-effects-muted');
			const createSetPausedAction = container.get<ICreateSetAction<boolean>>('data-store:action:create:set-paused');
			const createSetVolumeAction = container.get<ICreateSetAction<number>>('data-store:action:create:set-volume');
			const createSetEffectsVolumeAction = container.get<ICreateSetAction<number>>('data-store:action:create:set-effects-volume');
			const createSetMusicVolumeAction = container.get<ICreateSetAction<number>>('data-store:action:create:set-music-volume');
			const createSetFullscreenAction = container.get<ICreateSetAction<boolean>>('data-store:action:create:set-fullscreen');

			container.bind('ui:actions').toConstantValue((value: boolean) => store.dispatch(createSetMutedAction(value))).whenTargetNamed('setMuted');
			container.bind('ui:actions').toConstantValue((value: boolean) => store.dispatch(createSetMusicMutedAction(value))).whenTargetNamed('setMusicMuted');
			container.bind('ui:actions').toConstantValue((value: boolean) => store.dispatch(createSetEffectsMutedAction(value))).whenTargetNamed('setEffectsMuted');
			container.bind('ui:actions').toConstantValue((value: boolean) => store.dispatch(createSetPausedAction(value))).whenTargetNamed('setPaused');
			container.bind('ui:actions').toConstantValue((value: number) => store.dispatch(createSetVolumeAction(value))).whenTargetNamed('setVolume');
			container.bind('ui:actions').toConstantValue((value: number) => store.dispatch(createSetEffectsVolumeAction(value))).whenTargetNamed('setEffectsVolume');
			container.bind('ui:actions').toConstantValue((value: number) => store.dispatch(createSetMusicVolumeAction(value))).whenTargetNamed('setMusicVolume');
			container.bind('ui:actions').toConstantValue((value: boolean) => store.dispatch(createSetFullscreenAction(value))).whenTargetNamed('setFullscreen');
		});
}
