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
		title: {
			...title,
			fontSize: 'calc(1.5em + 4vw)',
			marginBottom: '.25em',
		},
		subtitle: {
			...theme.typography.subtitle1,
			...title,
			fontSize: 'calc(1.25em + 2vw)',
		},
		description: {
			...theme.typography.body1,
			padding: '0 24px',
			marginBottom: '1.5em',
			textAlign: 'justify',
			fontSize: 'calc(.75em + 1vw)',
		},
		cta: {
			padding: '0 24px',
		},
	});
};
