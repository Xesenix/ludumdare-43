import { createStyles, Theme } from '@material-ui/core/styles';

export const styles = (theme: Theme) => {
	const title = {
		...theme.typography.title,
		marginBottom: '16px',
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
		title,
		subtitle: {
			...theme.typography.subheading,
			...title,
		},
		headline: {
			...theme.typography.body1,
			padding: '0 24px',
			marginBottom: '8px',
			maxWidth: '800px',
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
			},
		},
	});
};
