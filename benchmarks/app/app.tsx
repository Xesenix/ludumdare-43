import { withStyles, WithStyles } from '@material-ui/core';
import Benchmark from 'benchmark';
import formatNumberFactory from 'format-number';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { BenchmarkSuite } from 'benchmark/benchmark-suite';

import { styles } from './app.styles';

const formatNumber = formatNumberFactory({
	integerSeparator: ` `,
	round: 0,
});

/** Component public properties required to be provided by parent component. */
export interface IAppExternalProps {
	suites: BenchmarkSuite[];
}

/** Internal component properties include properties injected via dependency injection. */
interface IAppInternalProps {
}

/** Internal component state. */
interface IAppState {
	title: string;
	status: { [key: string]: { [key: string]: string } };
	visible: { [key: string]: boolean };
}

type IAppProps = IAppExternalProps & IAppInternalProps & WithStyles<typeof styles>;

class AppComponent extends React.Component<IAppProps, IAppState> {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			status: {},
			visible: {},
		};
	}

	public componentDidCatch(error, info) {
		console.error('error', error, info);
	}

	public componentDidMount() {
		this.props.suites.forEach((benchmarks: BenchmarkSuite) => {
			benchmarks.on('start cycle', (event) => {
				const benchmark: Benchmark = event.target;
				this.setState({
					title: 'running...',
					status: {
						...this.state.status,
						[benchmarks.name]: {
							...this.state.status[benchmarks.name],
							[benchmark.name]: benchmarks.aborted ? 'aborted' :  benchmark.error ? `error` : 'ready',
						},
					},
				});
			});

			benchmarks.on('complete', (event) => {
				console.log('Complete', benchmarks);
				this.setState({
					title: 'ready',
					status: {
						...this.state.status,
						[benchmarks.name]: {
							...this.state.status[benchmarks.name],
							...benchmarks.reduce((result, benchmark: Benchmark) => {
								result[benchmark.name] = benchmarks.aborted ? 'aborted' : benchmark.running ? 'running' : benchmark.error ? `error` : 'ready';
								return result;
							}, {}),
						},
					},
				});
			});
			benchmarks.on('error', (err) => {
				console.log(err);
				this.setState({ title: 'error' });
			});
		});
	}

	public start = (benchmarks: BenchmarkSuite) => () => {
		benchmarks.run({ async: true });

		this.setState({
			title: 'running...',
			status: {
				...this.state.status,
				[benchmarks.name]: benchmarks.reduce((result, benchmark: Benchmark) => {
					benchmark.running = true;
					result[benchmark.name] = 'awaiting...';
					return result;
				}, {}),
			},
		});
	}

	public cancel = (suite: BenchmarkSuite) => () => {
		suite.abort();
	}

	public toggle = (key: string) => () => {
		this.setState({
			visible: {
				[key]: !this.state.visible[key],
			},
		});
	}

	public render(): any {
		const { suites = [], classes } = this.props;
		const { title, status = {}, visible } = this.state;

		return (
			<div className={classes.root}>
				<h2 className={classes.status}>{ title }</h2>
				{
					suites.map((benchmarks: BenchmarkSuite) => {
						const suiteName = benchmarks.name;
						const suiteCode = benchmarks.code;
						return (
							<div key={suiteName} className={classes.section}>
								<div className={classes.sectionHead}>
									<h2>{suiteName}</h2>
								</div>
								{ visible[suiteName] ? <pre className={classes.example}>{suiteCode}</pre> : null }
								<div className={classes.cta}>
									{ !benchmarks.running ? <button onClick={this.start(benchmarks)}>Run</button> : null }
									{ benchmarks.running ? <button onClick={this.cancel(benchmarks)}>Cancel</button> : null }
									<button onClick={this.toggle(suiteName)}>Show Code</button>
								</div>

								<div className={classes.results}>
									{
										benchmarks.map((test) => {
											const benchmarkName = test.options.name;
											const benchmarkCode = test.options.code;
											return (
												<React.Fragment key={test.options.id}>
													<h3>{benchmarkName}</h3>
													{ visible[suiteName] ? <pre>{benchmarkCode}</pre> : <span>&mdash;</span> }
													<div className={classes.result}>
														<div className={classes.resultMeanPerSec}>{formatNumber(test.hz)}</div>
														<div className={classes.resultMeanPerSecUnit}>times per sec</div>
														<div className={classes.resultMeanTime}>{(test.stats.mean).toFixed(8)}</div>
														<div className={classes.resultMeanTimeUnit}>sec</div>
														<div className={classes.resultCount}>{formatNumber(test.count)}</div>
														<div className={classes.resultCountUnit}>count</div>
													</div>
													<span>{ !!status[suiteName] ? status[suiteName][benchmarkName] : null }</span>
												</React.Fragment>
											);
										})
									}
								</div>
							</div>
						);
					})
				}
			</div>
		);
	}
}

export default hot(module)(withStyles(styles)(AppComponent));
