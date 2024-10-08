import fs from 'fs';

function copyExistingKeys() {
  const oldLocale = fs.readFileSync('./src/modules/bot/locales/_kz.json', 'utf8');
  const newLocale = fs.readFileSync('./src/modules/bot/locales/kz.json', 'utf8');
  //find all keys existing in new from old
  const oldLocaleObj = JSON.parse(oldLocale);
  const newLocaleObj = JSON.parse(newLocale);
  const newKeys = Object.keys(newLocaleObj);
  const oldKeys = Object.keys(oldLocaleObj);
  const existingKeys = newKeys.filter((key) => oldKeys.includes(key));
  console.log(existingKeys);
  //copy values from old to new
  existingKeys.forEach((key) => {
    newLocaleObj[key] = oldLocaleObj[key];
  });
  fs.writeFileSync('./src/modules/bot/locales/kz.json', JSON.stringify(newLocaleObj, null, 2));
}
copyExistingKeys();
