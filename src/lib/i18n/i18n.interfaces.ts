import { IValueAction, LanguageType } from 'lib/interfaces';

import { ISetLanguageReadyAction } from './actions';

export type II18nTranslation = (
	// prettier-ignore
	key: string,
	variables?: { [key: string]: string | number | null },
	domain?: string,
) => string;

export type II18nPluralTranslation = (
	// prettier-ignore
	value: number,
	key: string,
	pluralKey: string,
	variables: { [key: string]: string | number | null },
	domain?: string,
) => string;

export interface II18nState extends Object {
	languages: { [key: string]: { ready: boolean } };
	language: LanguageType;
}

export type I18nAction = IValueAction<any> | ISetLanguageReadyAction;
