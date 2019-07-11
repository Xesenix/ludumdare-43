import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Didn't found any better explanation how to convert ForwardRefExoticComponent
 * to type assignable to React.FunctionComponent for material-ui fab component argument.
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/2ceda6e7ea15eeaa8239832ecdbbb42ff87fbcf8/types/react/index.d.ts#L299
 */
export const ConfigLink = React.forwardRef((props, ref: any) => {
	return <RouterLink to="/config" {...props} innerRef={ref}/>;
}) as React.FunctionComponent;

/**
 * Didn't found any better explanation how to convert ForwardRefExoticComponent
 * to type assignable to React.FunctionComponent for material-ui fab component argument.
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/2ceda6e7ea15eeaa8239832ecdbbb42ff87fbcf8/types/react/index.d.ts#L299
 */
export const GameLink = React.forwardRef((props, ref: any) => {
	return <RouterLink to="/game" {...props} innerRef={ref}/>;
}) as React.FunctionComponent;

/**
 * Didn't found any better explanation how to convert ForwardRefExoticComponent
 * to type assignable to React.FunctionComponent for material-ui fab component argument.
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/2ceda6e7ea15eeaa8239832ecdbbb42ff87fbcf8/types/react/index.d.ts#L299
 */
export const IntroLink = React.forwardRef((props, ref: any) => {
	return <RouterLink to="/" {...props} innerRef={ref}/>;
}) as React.FunctionComponent;
