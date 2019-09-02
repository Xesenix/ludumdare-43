import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			padding: '12px',
		},
		item: {
			padding: '8px',
		},
		negative: {
			color: '#c70000',
		},
		positive: {
			color: '#00c700',
		},
	}));
