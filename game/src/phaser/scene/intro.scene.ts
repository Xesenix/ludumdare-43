import { EventEmitter } from 'events';
import { Container } from 'inversify';

import { __ } from 'lib/i18n';
import { IAudioManager } from 'lib/sound';
import { ISoundtrackManager } from 'lib/sound-scape';
import { ISoundtrack } from 'lib/sound-scape/interfaces';

const note140 = 240 / 140;

const ambient: ISoundtrack = {
	key: 'soundtrack',
	name: 'ambient',
	intro: {
		start: note140 * 0,
		end: note140 * 0,
		duration: note140 * 0,
	},
	loop: {
		start: note140 * 0,
		end: note140 * 28,
		duration: note140 * 28,
		interruptionStep: note140 * 2,
	},
	outro: {
		start: note140 * 0,
		end: note140 * 0,
		duration: note140 * 0,
	},
};

const action: ISoundtrack = {
	key: 'soundtrack',
	name: 'action',
	intro: {
		start: note140 * 56,
		end: note140 * 60,
		duration: note140 * 4,
	},
	loop: {
		start: note140 * 60,
		end: note140 * 88,
		duration: note140 * 28,
		interruptionStep: note140 * 4,
	},
	outro: {
		start: note140 * 88,
		end: note140 * 92,
		duration: note140 * 4,
	},
};

export class IntroScene extends Phaser.Scene {
	private soundtrack?: Phaser.Sound.BaseSound;
	private label?: Phaser.GameObjects.Text;

	private mode: 'idle' | 'action' = 'idle';
	private idleTimeout: number = 0;

	private di: Container;
	private em: EventEmitter;
	private sm: IAudioManager;
	private stm: ISoundtrackManager;

	constructor() {
		super({
			key: 'intro',
		});
	}

	public preload(): void {
		this.sm = this.sys.plugins.get('audio-manager') as any;
		this.stm = this.sys.plugins.get('soundtrack-manager') as any;
		console.log('IntroScene:preload');
		// TODO: use scene plugin
		if (!!(this.sm as any).setLoader) {
			(this.sm as any).setLoader(this.load);
		}

		this.sm.preloadAudioAsset('soundtrack', 'assets/soundtrack.ogg');

		this.load.image('sprite', 'assets/sprite.png');
	}

	public create(): void {
		this.setupSoundTrack();

		this.label = this.add.text(400, 300, '', { font: '24px Consolas', fill: '#ffffff' });
		this.label.setOrigin(0.5, 0.5);

		this.di = (this.sys.plugins.get('di') as any).di;
		this.em = this.di.get<EventEmitter>('event-manager');

		this.em.on('mode:change', (mode) => {
			if (mode !== this.mode) {
				if (mode === 'action') {
					this.enterActionMode();
				} else {
					this.enterIdleMode();
				}
			}
		});
	}

	public destroy(): void {
		if (this.soundtrack) {
			this.soundtrack.destroy();
		}
	}

	public update(time: number, delta: number): void {
		if (this.label) {
			const currentSoundtrack = this.stm.soundtrackPlayer
				.getCurrentScheduledSoundtrack()
				.map(({ soundtrack: { name }, state, start, end }) => `${name}-${state}[${start.toFixed(2)}-${(end && end.toFixed(2)) || 'inf'}]`)
				.join(', ');

			this.label.setText(
				`${__('total time')}: ${(time / 1000).toFixed(0)}s\n
${__('delta time')}: ${delta.toFixed(2)}ms\n
${__('audio time')}: ${this.sm.context.currentTime.toFixed(2)}s\n
current sound: ${currentSoundtrack}`,
			);
		}

		// this.checkIdleMode();
	}

	private checkIdleMode() {
		if (this.mode !== 'idle' && this.idleTimeout < this.sm.context.currentTime) {
			this.enterIdleMode();
		}
	}

	private enterIdleMode() {
		this.stm.soundtrackPlayer.scheduleNext(ambient, 0);
		this.mode = 'idle';
	}

	private enterActionMode() {
		this.stm.soundtrackPlayer.scheduleNext(action, note140 * 16);
		this.stm.soundtrackPlayer.scheduleAfterLast(ambient, 0);
		this.idleTimeout = this.sm.context.currentTime + note140 * 16;
		this.mode = 'action';
	}

	private setupSoundTrack() {
		this.idleTimeout = this.sm.context.currentTime;

		// this.input.on('pointerdown', (pointer) => {
		// 	if (pointer.buttons === 1) {
		// 		this.enterActionMode();
		// 	} else {
		// 		this.enterIdleMode();
		// 	}
		// });

		this.sm.preload().then(() => {
			this.stm.soundtrackPlayer.scheduleAfterLast(ambient, 0);
		});
	}
}
