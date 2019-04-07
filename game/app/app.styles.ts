import { createStyles, Theme } from '@material-ui/core/styles';

export const styles = (theme: Theme) => {
	const title = {
		...theme.typography.title,
		marginBottom: '.5em',
	};

	return createStyles({
		root: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			padding: '24px 4px 36px',
		},
		wrapper: {
			margin: theme.spacing.unit,
			position: 'relative',
		},
		title: {
			...title,
			fontSize: '2em',
			marginBottom: '.25em',
		},
		subtitle: {
			...theme.typography.subheading,
			...title,
		},
		headline: {
			...theme.typography.body1,
			padding: '0 24px',
			marginBottom: '1.5em',
			textAlign: 'justify',
		},
		[theme.breakpoints.up('sm')]: {
			title: {
				fontSize: '8vw',
			},
			subtitle: {
				fontSize: '5vw',
			},
			headline: {
				fontSize: '2.3vw',
			},
		},
		[theme.breakpoints.up('md')]: {
			headline: {
				fontSize: '2vw',
				maxWidth: '90%',
			},
		},
		[theme.breakpoints.up('lg')]: {
			title: {
				fontSize: '6.5em',
			},
			subtitle: {
				fontSize: '4em',
			},
			headline: {
				fontSize: '2em',
			},
		},
	});
};
