import { interfaces } from 'inversify';

import { SoundDirectorService } from './sound-director.service';

export function SoundDirectorBootProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	console.debug('SoundDirectorBootProvider');

	return async () => {
		// TODO: create asset loading progress
		console.debug('SoundDirectorBootProvider:boot');
		const soundDirector = container.get<SoundDirectorService>('sound-director');
		return soundDirector.start();
	};
}
