import * as React from 'react';
import { hot } from 'react-hot-loader';

import { Game, IGameState } from 'game';

// elements
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import PhaserViewComponent from 'components/ui/phaser-view/phaser-view';

import { connectToInjector } from 'lib/di';
import {
	// prettier-ignore
	II18nPluralTranslation,
	II18nTranslation,
} from 'lib/i18n';

import { useStyles } from '../../game-view.styles';
import RestartComponent from '../restart/restart';

/** Component public properties required to be provided by parent component. */
export interface IDefeatExternalProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IDefeatInternalProps {
	__: II18nTranslation;
	_$: II18nPluralTranslation;
	game: Game;
}

type IDefeatProps = IDefeatExternalProps & IDefeatInternalProps;

const diDecorator = connectToInjector<IDefeatExternalProps, IDefeatInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	_$: {
		dependencies: ['i18n:translate_plural'],
	},
	game: {
		dependencies: ['game'],
	},
});

function DefeatComponent(props: IDefeatProps): React.ReactElement {
	const {
		// prettier-ignore
		__,
		game,
	} = props;
	const classes = useStyles();

	const currentState: IGameState = game.getState();

	return (
		<Paper className={classes.root} elevation={0}>
			<Grid alignItems="center" container spacing={0}>
				<Grid item style={{ marginBottom: '12px' }} xs={12}>
					<PhaserViewComponent keepInstanceOnRemove />
				</Grid>
				<Grid item xs={12}>
					<Typography align="center" component="h1" variant="h4">
						{__(
							// prettier-ignore
							`Your village has perished after %{turn} years`,
							{
								turn: currentState.turn,
							},
						)}
					</Typography>
				</Grid>
			</Grid>
			<RestartComponent/>
		</Paper>
	);
}

export default hot(module)(diDecorator(DefeatComponent));
