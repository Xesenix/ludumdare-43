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
		end: note140 * 8,
		duration: note140 * 8,
	},
	loop: {
		start: note140 * 8,
		end: note140 * 56,
		duration: note140 * 48,
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
		start: note140 * 84,
		end: note140 * 88,
		duration: note140 * 4,
	},
	loop: {
		start: note140 * 56,
		end: note140 * 84,
		duration: note140 * 28,
		interruptionStep: note140 * 4,
	},
	outro: {
		start: note140 * 84,
		end: note140 * 88,
		duration: note140 * 4,
	},
};

export class IntroScene extends Phaser.Scene {
	private soundtrack?: Phaser.Sound.BaseSound;
	private label?: Phaser.GameObjects.Text;

	private mode: 'idle' | 'action' = 'idle';
	private idleTimeout: number = 0;

	constructor() {
		super({
			key: 'intro',
		});
	}

	public preload(): void {
		const sm: IAudioManager = this.sys.plugins.get('audio-manager') as any;
		console.log('IntroScene:preload');
		// TODO: use scene plugin
		if (!!(sm as any).setLoader) {
			(sm as any).setLoader(this.load);
		}

		sm.preloadAudioAsset('soundtrack', 'assets/soundtrack.ogg');

		this.load.image('sprite', 'assets/sprite.png');
	}

	public create(): void {
		this.input.setDefaultCursor('assets/sprite.png', 'pointer');
		this.input.on('pointerdown', (pointer) => {
			// console.log('down', pointer);
			emitter.explode(100, pointer.x, pointer.y);
			emitter.flow(
				1,
				1,
			);
		});

		this.input.on('pointermove', (pointer) => {
			// console.log('move', pointer);
			emitter.setPosition(pointer.x, pointer.y);
		});

		this.setupSoundTrack();

		this.label = this.add.text(400, 300, '', { font: '24px Consolas', fill: '#ffffff' });
		this.label.setOrigin(0.5, 0.5);

		const particles = this.add.particles('sprite');

		const emitter = particles.createEmitter({
			speed: { min: 10, max: 80 },
			scale: { start: 1, end: 0 },
			rotate: { start: 0, end: 90 },
			blendMode: Phaser.BlendModes.ADD,
		});
	}

	public destroy(): void {
		if (this.soundtrack) {
			this.soundtrack.destroy();
		}
	}

	public update(time: number, delta: number): void {
		if (this.label) {
			const sm: IAudioManager = this.sys.plugins.get('audio-manager') as any;
			const stm: ISoundtrackManager = this.sys.plugins.get('soundtrack-manager') as any;
			const currentSoundtrack = stm.soundtrackPlayer
				.getCurrentScheduledSoundtrack()
				.map(({ soundtrack: { name }, state, start, end }) => `${name}-${state}[${start.toFixed(2)}-${(end && end.toFixed(2)) || 'inf'}]`)
				.join(', ');

			this.label.setText(
				`${__('total time')}: ${(time / 1000).toFixed(0)}s\n
${__('delta time')}: ${delta.toFixed(2)}ms\n
${__('audio time')}: ${sm.context.currentTime.toFixed(2)}s\n
current sound: ${currentSoundtrack}`,
			);
		}

		this.checkIdleMode();
	}

	private checkIdleMode() {
		const sm: IAudioManager = this.sys.plugins.get('audio-manager') as any;
		if (this.mode !== 'idle' && this.idleTimeout < sm.context.currentTime) {
			this.enterIdleMode();
		}
	}

	private enterIdleMode() {
		const stm: ISoundtrackManager = this.sys.plugins.get('soundtrack-manager') as any;
		stm.soundtrackPlayer.scheduleNext(ambient, 0);
		this.mode = 'idle';
	}

	private enterActionMode() {
		const sm: IAudioManager = this.sys.plugins.get('audio-manager') as any;
		const stm: ISoundtrackManager = this.sys.plugins.get('soundtrack-manager') as any;
		stm.soundtrackPlayer.scheduleNext(action, 0);
		this.idleTimeout = sm.context.currentTime + note140 * 16;
		this.mode = 'action';
	}

	private setupSoundTrack() {
		const sm: IAudioManager = this.sys.plugins.get('audio-manager') as any;
		const stm: ISoundtrackManager = this.sys.plugins.get('soundtrack-manager') as any;

		this.idleTimeout = sm.context.currentTime;

		this.input.on('pointerdown', (pointer) => {
			if (pointer.buttons === 1) {
				this.enterActionMode();
			} else {
				this.enterIdleMode();
			}
		});

		sm.preload().then(() => {
			stm.soundtrackPlayer.scheduleAfterLast(ambient, 0);
		});
	}
}
