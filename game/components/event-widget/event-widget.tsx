import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { Store } from 'redux';

// elements
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// icons
import ConfigIcon from '@material-ui/icons/Build';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import FullScreenExitIcon from '@material-ui/icons/FullscreenExit';
import MenuIcon from '@material-ui/icons/Menu';
import PausedIcon from '@material-ui/icons/PauseCircleFilled';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import BackIcon from '@material-ui/icons/Undo';
import MuteOnIcon from '@material-ui/icons/VolumeOff';
import MuteOffIcon from '@material-ui/icons/VolumeUp';

import { connectToInjector } from 'lib/di';

import { styles } from './event-widget.styles';

export interface IEventWidgetProps {
	di?: Container;
	store?: Store<any, any>;
	__: (key: string) => string;
	event: string;
	currentState: any;
	consequences: any;
}

const diDecorator = connectToInjector<IEventWidgetProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

export interface IEventWidgetState {}

class EventWidgetComponent extends React.PureComponent<IEventWidgetProps & WithStyles<typeof styles>, IEventWidgetState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const { } = this.state;
		const { classes, currentState, consequences } = this.props;
		const { event, weakness, weaknessReduction, wallPower, attackPower } = currentState;
		let description;

		switch (event) {
			case 'orcs':
				description = (
					<Paper elevation={0}>
						<Typography className={classes.attackTitle} variant="display1" component="p">
							{event} attack power {Math.floor(consequences.attackPower)}
						</Typography>
						<Paper className={classes.attackContainer} elevation={0}>
							<Grid container>
								<Grid className={classes.powerContainer} item xs={12} sm={4}>
									<Typography className={classes.powerDescription} variant="subheading" component="p">
										Original power {attackPower}
									</Typography>
									<Typography className={classes.powerDescription} variant="caption" component="span">
										weakness lvl {weakness} reduced it by { ((1 - Math.pow(1 - weaknessReduction, weakness)) * 100).toFixed(2) }%
									</Typography>
									<Typography className={classes.powerDescription} variant="caption" component="span">
										wall lvl {wallPower / 30} reduced it by {wallPower})
									</Typography>
								</Grid>
								<Grid className={classes.consequencesContainer} container item xs={12} sm={8}>
									<Grid item xs={12}>
										<Typography className={classes.label} variant="headline" component="p">Attack consequences</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography className={classes.amountDescription} variant="headline" component="p">{consequences.totallKilled}</Typography>
										<Typography className={classes.label} variant="caption" component="p">casualties</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography className={classes.amountDescription} variant="headline" component="p">{consequences.resourcesStolen}</Typography>
										<Typography className={classes.label} variant="caption" component="p">resources stolen</Typography>
									</Grid>
								</Grid>
							</Grid>
						</Paper>
					</Paper>
				);
				break;
			case 'orcs':
				description = (
					<Paper className={classes.sacrafice}>
						{ event }
					</Paper>
				);
				break;
		}

		return description;
	}
}

export default hot(module)(diDecorator(withStyles(styles)(EventWidgetComponent)));
