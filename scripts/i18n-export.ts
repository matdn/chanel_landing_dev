import excel from 'exceljs';
import fs from 'fs';
import path from 'path';

const i18nDir = 'src/assets/i18n';
const baseLanguageCodes = ['en-uk', 'fr-fr_be'];
const worksheetName = 'Translations';

const exportFilePath = path.join(
  // i18nPath,
  // `Translations_${new Date().toISOString().match(/\d/g).join('').slice(2, 14)}.xlsx`,
  'Translations.xlsx',
);

interface Translation {
  _id: string;
  [key: string]: string;
}

function getLanguageCodes(files: string[]) {
  const codes: string[] = [];
  codes.push(...baseLanguageCodes);
  files.forEach(file => {
    const code = file.replace('.json', '');
    if (codes.includes(code)) {
      return;
    }
    codes.push(code);
  });
  return codes;
}

function getHeaders(languageCodes: string[]) {
  const headers = [{ key: '_id', header: 'Key', width: 50 }];
  languageCodes.forEach(code => {
    headers.push({ key: code, header: code, width: 50 });
  });
  return headers;
}

function getTranslations(languageCodes: string[]) {
  const translations: Translation[] = [];
  languageCodes.forEach(languageCode => {
    const data = JSON.parse(fs.readFileSync(path.join(i18nDir, `${languageCode}.json`), 'utf8'));
    Object.entries(data).forEach(([key, value]) => {
      const translation = translations.find(v => v._id === key);
      if (translation) {
        translation[languageCode] = value as string;
        return;
      }
      translations.push({
        _id: key,
        [languageCode]: value as string,
      });
    });
  });
  return translations;
}

function updateMisisngTranslationsRowStyle(row: excel.Row) {
  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF8DB4E2' },
  };
}

async function writeExcelFile(languageCodes: string[], translations: Translation[]) {
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet(worksheetName);
  worksheet.views = [{ state: 'frozen', xSplit: 1, ySplit: 1 }];
  worksheet.columns = getHeaders(languageCodes);

  translations.forEach(translation => {
    const row = worksheet.addRow(translation);
    const isMissingTranslations = languageCodes.some(code => !translation[code] || translation[code] === translation._id);
    if (!isMissingTranslations) {
      return;
    }
    updateMisisngTranslationsRowStyle(row);
  });

  await workbook.xlsx.writeFile(exportFilePath);
  console.log('Export to:', exportFilePath);
}

async function main() {
  console.log('Processing...');
  const files = fs.readdirSync(i18nDir).filter(v => v.endsWith('.json'));
  const languageCodes = getLanguageCodes(files);
  const translations = getTranslations(languageCodes);
  await writeExcelFile(languageCodes, translations);
  console.log('Finished');
}

main();
