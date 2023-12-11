import fs from 'fs';
import path from 'path';

const i18nPath = 'src/assets/i18n';
const enPath = 'src/assets/i18n/en-uk.json'
async function main() {
  console.log('Starting to generate schema from json file');
  const enFile = fs.readFileSync(enPath, 'utf8');
  const data = JSON.parse(enFile);
  console.log('Generating schema ...');
  const schema = _generateSchema(data);
  console.log('Writing schema ...')
  _writeSchema(schema);
  console.log('Finished');
}
function _generateSchema(data) {
  const schema = []
  const variableRegex = new RegExp(/(?<={{)(.*?)(?=\s*}})/g);
  let filesName = fs.readdirSync(i18nPath);
  let supportedLanguages = _getSupportedLanguage(filesName);
  Object.entries(data).forEach(([key, value]) => {
    const keySchema = {
      name: key,
    };
    const variables = (value as string)?.match(variableRegex);
    variables?.length > 0 && (keySchema['variables'] = variables)
    schema.push(keySchema);
  })
  console.log(schema)
  return {
    mainLanguage: 'en-uk',
    supportedLanguages: supportedLanguages,
    schema: schema
  }

}

function _getSupportedLanguage(filesName: string[]) {
  return filesName.reduce((acc, file, index) => {
    let fileName = file.split('.json')[0];
    if (fileName !== 'schema') {
      return [...acc, fileName];
    }
    return acc;
  }, [])
}

function _writeSchema(schemaData) {
  const filePath = path.join(i18nPath, `schema.json`);
  fs.writeFileSync(filePath, JSON.stringify(schemaData, null, 2), { encoding: 'utf8' });
}

main();
