import * as React from 'react';
import { hot } from 'react-hot-loader';

import Slider from '@material-ui/core/Slider';

import { connectToInjector } from 'lib/di';

/** Component public properties required to be provided by parent component. */
export interface IVolumeExternalProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IVolumeInternalProps {
	dispatchSetVolumeAction: (event: any, value: number) => void;
	bindToStore: (keys: (keyof IVolumeState)[]) => IVolumeState;
}

/** Internal component state. */
interface IVolumeState {
	volume: number;
}

const diDecorator = connectToInjector<IVolumeExternalProps, IVolumeInternalProps>({
	dispatchSetVolumeAction: {
		dependencies: ['ui:actions@setVolume'],
		value: (setVolume: (value: number) => void) => Promise.resolve((event: any, value: number) => setVolume(value)),
	},
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
});

type IVolumeProps = IVolumeExternalProps & IVolumeInternalProps;

function VolumeComponent(props: IVolumeProps) {
	const {
		// prettier-ignore
		dispatchSetVolumeAction,
		bindToStore,
	} = props;
	const {
		// prettier-ignore
		volume,
	} = bindToStore([
		// prettier-ignore
		'volume',
	]);

	return (
		<Slider min={0} max={1} step={1 / 32} value={volume} onChange={dispatchSetVolumeAction as any} />
	);
}

export default hot(module)(diDecorator(VolumeComponent));
