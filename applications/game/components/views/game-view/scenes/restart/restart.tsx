import * as React from 'react';
import { hot } from 'react-hot-loader';

import { Game } from 'game';

// elements
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';


/** Component public properties required to be provided by parent component. */
export interface IRestartExternalProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IRestartInternalProps {
	__: II18nTranslation;
	game: Game;
}

type IRestartProps = IRestartExternalProps & IRestartInternalProps;

const diDecorator = connectToInjector<IRestartExternalProps, IRestartInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	game: {
		dependencies: ['game'],
	},
});

function RestartComponent(props: IRestartProps): React.ReactElement {
	const {
		// prettier-ignore
		__,
		game,
	} = props;

	return (
		<Grid item style={{ padding: '24px', textAlign: 'center' }} xs={12}>
			<Fab
				// prettier-ignore
				color="default"
				disabled={false}
				onClick={game.resetGame}
				size="large"
				variant="extended"
			>
				{__('Restart')}
			</Fab>
		</Grid>
	);
}

export default hot(module)(diDecorator(RestartComponent));
