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

import { SacrificesSystem } from 'game/systems/sacrifices';

import { useStyles } from '../../game-view.styles';
import RestartComponent from '../restart/restart';


/** Component public properties required to be provided by parent component. */
export interface IVictoryExternalProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IVictoryInternalProps {
	__: II18nTranslation;
	_$: II18nPluralTranslation;
	game: Game;
	sacrifices: SacrificesSystem;
}

type IVictoryProps = IVictoryExternalProps & IVictoryInternalProps;

const diDecorator = connectToInjector<IVictoryExternalProps, IVictoryInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	_$: {
		dependencies: ['i18n:translate_plural'],
	},
	game: {
		dependencies: ['game'],
	},
	sacrifices: {
		dependencies: ['game:system:sacrifices'],
	},
});

function VictoryComponent(props: IVictoryProps): React.ReactElement {
	const {
		// prettier-ignore
		__,
		_$,
		game,
		sacrifices,
	} = props;
	const classes = useStyles();

	const sacrificedResources = sacrifices.getTotalResourcesUsed();
	const sacrificedPopulation = sacrifices.getTotalPopulationUsed();
	const sacrificesCount = sacrifices.getCount();

	const currentState: IGameState = game.getState();

	return (
		<Paper className={classes.root} elevation={0}>
			<Grid alignItems="center" container spacing={0}>
				<Grid item style={{ marginBottom: '12px' }} xs={12}>
					<PhaserViewComponent keepInstanceOnRemove />
				</Grid>
				<Grid item xs={12}>
					<Typography align="center" component="h3" variant="h4">
						{__(`Your village is safe everybody are in heaven now.`)}
					</Typography>
					<Typography align="center" component="p" variant="subtitle1">
						{_$(
							// prettier-ignore
							currentState.turn,
							`Victory achieved in first year.`,
							`Victory achieved in %{turn} years.`,
							{
								turn: currentState.turn,
							},
						)}
						<br />
						{_$(
							// prettier-ignore
							sacrificedResources,
							`You have sacrificed one resource`,
							`You have sacrificed %{sacrificedResources}&nbsp;resources`,
							{
								sacrificedResources,
							},
						)}{' '}
						{_$(
							// prettier-ignore
							sacrificedPopulation,
							`and one person`,
							`and %{sacrificedPopulation}&nbsp;people`,
							{
								sacrificedPopulation,
							},
						)}{' '}
						{_$(
							// prettier-ignore
							sacrificesCount,
							`in one sacrifice.`,
							`in %{sacrificesCount} sacrifices.`,
							{
								sacrificesCount,
							},
						)}
					</Typography>
				</Grid>
			</Grid>
			<RestartComponent/>
		</Paper>
	);
}

export default hot(module)(diDecorator(VictoryComponent));
