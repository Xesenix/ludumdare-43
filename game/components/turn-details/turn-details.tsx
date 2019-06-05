import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

// elements
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { styles } from './turn-details.styles';

/** Component public properties required to be provided by parent component. */
export interface ITurnDetailsExternalProps {
	consequences: any;
	disabled: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface ITurnDetailsInternalProps {
	__: II18nTranslation;
	di?: Container;
	store?: Store<any, any>;
}

type ITurnDetailsProps = ITurnDetailsExternalProps & ITurnDetailsInternalProps & WithStyles<typeof styles>;

const diDecorator = connectToInjector<ITurnDetailsProps, ITurnDetailsInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

function TurnDetailsComponent(props: ITurnDetailsProps): any {
	const {
		__,
		classes,
		consequences,
	} = props;

	return (
		<Paper className={classes.root} elevation={1}>
			<Typography variant="h5" component="h2">
				{__(`Next turn result details`)}
			</Typography>
			<Grid container spacing={8}>
				<Grid className={classes.item} item xs={3}>
					<Typography variant="subtitle1" component="h3">
						{__(`Villagers`)} {consequences.population}
					</Typography>
					<Typography className={classes.negative} variant="caption" component="p">
						({__(`totall killed`)}: {consequences.totallKilled})
					</Typography>
					<Typography className={classes.negative} variant="caption" component="p">
						({__(`resources stolen`)}: {consequences.resourcesStolen})
					</Typography>
				</Grid>
				<Grid className={classes.item} item xs={3}>
					<Typography variant="subtitle1" component="h3">
						{__(`Workers`)} {consequences.workers}
					</Typography>
					<Typography className={classes.positive} variant="caption" component="p">
						({__(`trained`)}: {consequences.trainedWorkers})
					</Typography>
					<Typography className={classes.negative} variant="caption" component="p">
						({__(`sacrificed`)}: {consequences.sacrificedWorkers})
					</Typography>
					<Typography className={classes.negative} variant="caption" component="p">
						({__(`killed`)}: {consequences.workersKilled})
					</Typography>
				</Grid>
				<Grid className={classes.item} item xs={3}>
					<Typography variant="subtitle1" component="h3">
						{__(`Guards`)} {consequences.guards}
					</Typography>
					<Typography className={classes.positive} variant="caption" component="p">
						({__(`trained`)}: {consequences.trainedGuards})
					</Typography>
					<Typography className={classes.negative} variant="caption" component="p">
						({__(`sacrificed`)}: {consequences.sacrificedGuards})
					</Typography>
					<Typography className={classes.negative} variant="caption" component="p">
						({__(`killed`)}: {consequences.guardsKilled})
					</Typography>
				</Grid>
				<Grid className={classes.item} item xs={3}>
					<Typography variant="subtitle1" component="h3">
						{__(`Idle`)} {consequences.idle}
					</Typography>
					<Typography className={classes.positive} variant="caption" component="p">
						({__(`new adults`)}: {consequences.newAdults})
					</Typography>
					<Typography className={classes.positive} variant="caption" component="p">
						({__(`retrained`)}: {consequences.trainedWorkers + consequences.trainedGuards})
					</Typography>
					<Typography className={classes.negative} variant="caption" component="p">
						({__(`sacrificed`)}: {consequences.sacrificedIdle})
					</Typography>
					<Typography className={classes.negative} variant="caption" component="p">
						({__(`killed`)}: {consequences.idleKilled})
					</Typography>
				</Grid>
				<Grid className={classes.item} item xs={3}>
					<Typography variant="subtitle1" component="h3">
						{__(`Children`)} {consequences.babies}
					</Typography>
					<Typography className={classes.positive} variant="caption" component="p">
						({__(`born`)}: {consequences.newChildren})
					</Typography>
					<Typography className={classes.negative} variant="caption" component="p">
						({__(`sacrificed`)}: {consequences.sacrificedChildren})
					</Typography>
					<Typography className={classes.negative} variant="caption" component="p">
						({__(`killed`)}: {consequences.babiesKilled})
					</Typography>
				</Grid>
				<Grid className={classes.item} item xs={3}>
					<Typography variant="subtitle1" component="h3">
						{__(`Resources`)} {consequences.resources}
					</Typography>
					<Typography className={classes.positive} variant="caption" component="p">
						({__(`gathered`)}: {consequences.resourceGathered})
					</Typography>
					<Typography className={classes.negative} variant="caption" component="p">
						({__(`guard salary`)}: {consequences.guardsPaid})
					</Typography>
					<Typography className={classes.negative} variant="caption" component="p">
						({__(`sacrificed`)}: {consequences.sacrificedResources})
					</Typography>
					<Typography className={classes.negative} variant="caption" component="p">
						({__(`stolen`)}: {consequences.resourcesStolen})
					</Typography>
				</Grid>
			</Grid>
		</Paper>
	);
}

export default hot(module)(withStyles(styles)(diDecorator(TurnDetailsComponent)));
