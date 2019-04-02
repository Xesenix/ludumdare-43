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
