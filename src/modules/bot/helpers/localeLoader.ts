import * as locales from './localeDonors';
import fs from 'fs';

function generateLocales() {
  //generate json for each locale
  for (const [key, value] of Object.entries(locales)) {
    const locale = value;
    const localeName = key;
    //sort keys
    const localeSorted: any = {};
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

    Object.keys(locale)
      .sort((a, b) => collator.compare(a, b))
      .forEach((key) => {
        localeSorted[key] = (locale as any)[key];
      });
    fs.writeFileSync(`./src/modules/bot/locales/${localeName}.json`, JSON.stringify(localeSorted, null, 2));
  }
}
generateLocales();
//$ ts-node src/modules/bot/helpers/localeLoader.ts
