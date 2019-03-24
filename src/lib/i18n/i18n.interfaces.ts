export type II18nTranslation = (
	key: string,
	variables?: { [key: string]: string | number | null },
	domain?: string,
) => string;

export type II18nPluralTranslation = (
	value: number,
	key: string,
	pluralKey: string,
	variables: { [key: string]: string | number | null },
	domain?: string,
) => string;
