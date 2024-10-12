import * as locales from './localeDonors';
import fs from 'fs';

function generateLocales() {
  //generate json for each locale
  for (const [key, value] of Object.entries(locales)) {
    const locale = value;
    const localeName = key;
    fs.writeFileSync(`./src/modules/bot/locales/${localeName}.json`, JSON.stringify(locale, null, 2));
  }
}
generateLocales();
//$ ts-node src/modules/bot/helpers/localeLoader.ts
