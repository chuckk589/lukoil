import fs from 'fs';

function copyExistingKeys() {
  //replace camelCase to snake_case
  const oldLocale = fs
    .readFileSync('./src/modules/bot/locales/_kz.json', 'utf8')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase();
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
    //capitalize first letter of value
    const value = oldLocaleObj[key];
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    newLocaleObj[key] = capitalizedValue;
  });
  fs.writeFileSync('./src/modules/bot/locales/kz.json', JSON.stringify(newLocaleObj, null, 2));
}
copyExistingKeys();
//$ ts-node src/modules/bot/helpers/copyLan.ts
