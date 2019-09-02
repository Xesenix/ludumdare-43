import * as React from 'react';
import { hot } from 'react-hot-loader';

// elements
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { GameLink } from 'components/core/navigation-links';

import { useStyles } from './intro-view.styles';

/** Component public properties required to be provided by parent component. */
export interface IIntroViewExternalProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IIntroViewInternalProps {
	__: II18nTranslation;
}

type IIntroViewProps = IIntroViewExternalProps & IIntroViewInternalProps;

const diDecorator = connectToInjector<IIntroViewExternalProps, IIntroViewInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

function IntroViewComponent(props: IIntroViewProps) {
	const { __ } = props;
	const classes = useStyles();

	return (
		<Paper className={classes.root} elevation={0}>
			<Typography align="center" className={classes.title} component="h1" variant="h1">
				{__( `The greatest sacrifice` )}
			</Typography>
			<Typography align="center" className={classes.subtitle} component="h2" variant="h4">
				{__( `Ludumdare 43 edition` )}
			</Typography>
			<Typography align="center" className={classes.description} component="p" variant="h5">
				{__( `You are the leader of a small village in this very hostile world.` )}{' '}
				{__( `You must decide whether you will offer sacrifices to the gods or face the dangers that plague this world on your own.` )}
				<br />
				{__( `Manage your villagers assign them to work so they can gather resources for sacrifices or village development.` )}{' '}
				{__( `or leave them idle so they can multiply and sacrifice them to permanently weaken creatures disturbing this world.` )}
			</Typography>
			<Button className={classes.description} href="https://ldjam.com/events/ludum-dare/43/$126387">
				{__( `Go to ludumdare 43 game page` )}
			</Button>
			<Fab
				className={classes.cta}
				color="primary"
				component={GameLink}
				variant="extended"
			>
				{__( `Play` )}
			</Fab>
		</Paper>
	);
}

export default hot(module)(diDecorator(IntroViewComponent));
