import { createStyles, Theme } from '@material-ui/core/styles';

export const styles = (theme: Theme) => {
	return createStyles({
		root: {
			fontFamily: 'sans-serif',
		},
		status: {
			position: 'fixed',
			padding: '24px 48px',
			margin: '0',
			top: '0',
			left: '0',
			right: '0',
			backgroundColor: theme.palette.grey[100],
			boxShadow: '0 0 5px #666',
		},
		section: {
			display: 'grid',
			marginTop: '48px',
			paddingTop: '24px',
			borderTop: '3px solid #666',
			gridTemplate: '"head head cta" minmax(64px, auto) "example example example" minmax(auto, 1fr) "results results results" max-content / minmax(300px, auto) 1fr 1fr',
		},
		sectionHead: {
			gridArea: 'head',
			fontFamily: 'Oswald',
			fontSize: '1.5rem',
			textAlign: 'center',
		},
		example: {
			gridArea: 'example',
			padding: '8px 24px',
			backgroundColor: theme.palette.grey[100],
			tabSize: '2',
			boxShadow: 'inset 0 0 4px #333',
		},
		cta: {
			alignContent: 'center',
			display: 'grid',
			alignItems: 'center',
			justifyContent: 'end',
			gridArea: 'cta',
			'& button': {
				width: '320px',
				height: '48px',
			},
		},
		results: {
			gridArea: 'results',
			display: 'grid',
			width: '100%',
			height: '100%',
			gridAutoRows: 'minmax(32px, 1fr)',
			gridTemplateColumns: '1fr auto 1fr 1fr minmax(0, 1fr)',
			alignItems: 'center',
			'& strong, & pre': {
				padding: '8px 24px',
				justifyItems: 'center',
			},
			'& pre': {
				backgroundColor: theme.palette.grey[100],
				tabSize: '2',
				boxShadow: 'inset 0 0 4px #333',
			},
		},
	});
};
