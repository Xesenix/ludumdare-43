import * as React from 'react';
import { hot } from 'react-hot-loader';

import Slider from '@material-ui/core/Slider';

import { connectToInjector } from 'lib/di';

/** Component public properties required to be provided by parent component. */
export interface IMusicVolumeExternalProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IMusicVolumeInternalProps {
	dispatchSetMusicVolumeAction: (event: any, value: number) => void;
	bindToStore: (keys: (keyof IMusicVolumeState)[]) => IMusicVolumeState;
}

/** Internal component state. */
interface IMusicVolumeState {
	musicVolume: number;
}

const diDecorator = connectToInjector<IMusicVolumeExternalProps, IMusicVolumeInternalProps>({
	dispatchSetMusicVolumeAction: {
		dependencies: ['ui:actions@setMusicVolume'],
		value: (setMusicVolume: (value: number) => void) => Promise.resolve((event: any, value: number) => setMusicVolume(value)),
	},
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
});

type IMusicVolumeProps = IMusicVolumeExternalProps & IMusicVolumeInternalProps;

function MusicVolumeComponent(props: IMusicVolumeProps) {
	const {
		// prettier-ignore
		dispatchSetMusicVolumeAction,
		bindToStore,
	} = props;
	const {
		// prettier-ignore
		musicVolume,
	} = bindToStore([
		// prettier-ignore
		'musicVolume',
	]);

	return (
		<Slider min={0} max={1} step={1 / 32} value={musicVolume} onChange={dispatchSetMusicVolumeAction as any} />
	);
}

export default hot(module)(diDecorator(MusicVolumeComponent));
