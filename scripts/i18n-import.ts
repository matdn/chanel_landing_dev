import excel from 'exceljs';
import fs from 'fs';
import path from 'path';

const importFilePath = 'Translations.xlsx';
const i18nPath = 'src/assets/i18n';

async function readExcelFile() {
  const workbook = new excel.Workbook();
  return await workbook.xlsx.readFile(importFilePath);
}

function getLanguageCodes(row: excel.Row) {
  const codes = (row.values as excel.CellValue[]).splice(2);
  return codes as string[];
}

function writeI18nFile(languageCode: string, data: Record<string, any>) {
  const filePath = path.join(i18nPath, `${languageCode}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), { encoding: 'utf8' });
}

function getTranslationValue(origValue: any): string {
  switch (typeof origValue) {
    case 'object':
      return origValue.richText?.reduce?.((pv, cv) => pv + (cv?.text || ''), '') || '';
  }
  return String(origValue);
}

function processWorksheet(worksheet: excel.Worksheet) {
  let languageCodes: string[] = [];
  const translations = {};

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      languageCodes = getLanguageCodes(row);
      return;
    }
    const rowValues = row.values as string[];
    rowValues.shift();
    const translationKey = rowValues.shift();
    languageCodes.forEach((code, i) => {
      const translationValue = getTranslationValue(rowValues[i] || translationKey).trim();
      translations[code] = translations[code] || {};
      translations[code][translationKey] = translationValue;
    });
  });

  Object.entries(translations).forEach(([languageCode, data]) => {
    writeI18nFile(languageCode, data);
  });
}

function processWorkbook(workbook: excel.Workbook) {
  processWorksheet(workbook.worksheets[0]);
}

async function main() {
  console.log('Processing...');
  const workbook = await readExcelFile();
  processWorkbook(workbook);
  console.log('Finished');
}

main();
