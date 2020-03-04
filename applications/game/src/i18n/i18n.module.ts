import {
	II18nTranslation,
	ILanguageDescriptor,
} from 'lib/i18n';
import { IApplication, LanguageType } from 'lib/interfaces';

export default class I18nModule {
	public static register(app: IApplication) {
		app.bind<ILanguageDescriptor[]>('i18n:available-languages').toConstantValue([
			{
				i18nLabel: (__: II18nTranslation) => __('english'),
				i18nShortLabel: (__: II18nTranslation) => __('EN'),
				locale: 'en' as LanguageType,
			},
			{
				i18nLabel: (__: II18nTranslation) => __('polish'),
				i18nShortLabel: (__: II18nTranslation) => __('PL'),
				locale: 'pl' as LanguageType,
			},
			{
				i18nLabel: (__: II18nTranslation) => __('german'),
				i18nShortLabel: (__: II18nTranslation) => __('DE'),
				locale: 'de' as LanguageType,
			},
		]);
	}
}
