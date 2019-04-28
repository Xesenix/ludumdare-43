import {
	// prettier-ignore
	IApplication,
	ICreateSetAction,
} from 'lib/interfaces';

import {
	// prettier-ignore
	createSetEffectsMutedAction,
	createSetEffectsVolumeAction,
	createSetFullscreenAction,
	createSetMusicMutedAction,
	createSetMusicVolumeAction,
	createSetMutedAction,
	createSetPausedAction,
	createSetVolumeAction,
} from './actions';
import { UIBootProvider } from './ui-boot.provider';

/**
 * Connect application fullscreen state with datastore.
 */
export class UIModule {
	public static register(app: IApplication) {
		// define logic needed to bootstrap module
		app.bind('boot').toProvider(UIBootProvider);

		// redux action creators
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-muted').toConstantValue(createSetMutedAction);
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-music-muted').toConstantValue(createSetMusicMutedAction);
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-effects-muted').toConstantValue(createSetEffectsMutedAction);
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-paused').toConstantValue(createSetPausedAction);
		app.bind<ICreateSetAction<number>>('data-store:action:create:set-volume').toConstantValue(createSetVolumeAction);
		app.bind<ICreateSetAction<number>>('data-store:action:create:set-effects-volume').toConstantValue(createSetEffectsVolumeAction);
		app.bind<ICreateSetAction<number>>('data-store:action:create:set-music-volume').toConstantValue(createSetMusicVolumeAction);
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-fullscreen').toConstantValue(createSetFullscreenAction);

		// add data store keys that should be persisted between page refresh
		app.bind<string>('data-store:persist:state').toConstantValue('effectsMuted');
		app.bind<string>('data-store:persist:state').toConstantValue('effectsVolume');
		app.bind<string>('data-store:persist:state').toConstantValue('musicMuted');
		app.bind<string>('data-store:persist:state').toConstantValue('musicVolume');
		app.bind<string>('data-store:persist:state').toConstantValue('mute');
		app.bind<string>('data-store:persist:state').toConstantValue('volume');

	}
}
