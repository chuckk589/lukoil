async function importCodes() {
  //   console.log('started importing');
  //   const filepath = 'C:/Users/Andrew/Downloads/Bottle_codes_all.xlsx';
  //   const workSheetsFromBuffer = xlsx.parse(filepath);
  //   //only first sheet
  //   const qb = this.em.createQueryBuilder(Code);
  //   const chunkSize = 1000;
  //   //iterate all columns by chunks
  //   const entities = [];
  //   for (const sheet of workSheetsFromBuffer) {
  //     for (let i = 1; i < sheet.data.length; i++) {
  //       const row = sheet.data[i];
  //       for (let j = 0; j < row.length; j++) {
  //         const code = row[j];
  //         const entity = new Code();
  //         entity.value = code;
  //         entities.push(entity);
  //       }
  //       //insert by chunks
  //       if (entities.length >= chunkSize) {
  //         await qb.clone().insert(entities).onConflict('value').ignore().execute();
  //         entities.length = 0;
  //       }
  //     }
  //   }
  //   console.log('finished importing');
}
importCodes();
//$ ts-node src/modules/bot/helpers/importCodes.ts
