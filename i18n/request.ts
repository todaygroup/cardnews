import {getRequestConfig} from 'next-intl/server';
import {locales} from './config';

export default getRequestConfig(async ({locale}) => {
  const validLocale = locales.includes(locale as any) ? locale : 'ko';

  return {
    locale: validLocale as string,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
}); 