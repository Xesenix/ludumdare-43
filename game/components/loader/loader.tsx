import { withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { hot } from 'react-hot-loader';

// elements
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { II18nTranslation } from 'lib/i18n';
import I18nLabel from 'lib/i18n/components/i18n-label';

import { styles } from './loader.styles';

const i18nTileLabel = (__: II18nTranslation) => __('Loading error');
const i18nDescriptionLabel = (__: II18nTranslation) => __('Something went wrong while loading module try again later.');
const i18nCtaLabel = (__: II18nTranslation) => __('Retry');

/** Component public properties required to be provided by parent component. */
export interface ILoaderPropsExternalProps {
	isLoading: boolean;
	retry?: (() => void) | null;
	size?: number;
}

type ILoaderProps = ILoaderPropsExternalProps & WithStyles<typeof styles>;

function Loader({ classes, isLoading, retry = null, size = 128 }: ILoaderProps) {
	return (
		<div
			className={classes.root}
		>
			{
				isLoading
				? <CircularProgress size={size}/>
				: (
					<Paper className={classes.notification}>
						<Typography
							align="center"
							className={classes.title}
							component="title"
							variant="h5"
						>
							<I18nLabel render={i18nTileLabel}/>
						</Typography>
						<Typography
							align="center"
							className={classes.description}
							component="p"
							variant="body2"
						>
							<I18nLabel render={i18nDescriptionLabel}/>
						</Typography>
						{ retry != null
							?
								<Fab
									className={classes.cta}
									color="default"
									onClick={retry}
									variant="extended"
								>
									<I18nLabel render={i18nCtaLabel}/>
								</Fab>
							: null
						}
					</Paper>
				)
			}
		</div>
	);
}

export default hot(module)(withStyles(styles)(Loader));
