import fs from 'fs';
import path from 'path';

const i18nPath = 'src/assets/i18n';
const schemaPath = 'src/assets/i18n/schema.json';
const errors = [];

function _validateLanguageKeyFromSchema(schema, language, languageData) {
    schema.forEach(translation => {
        // add key and value = key if translation in schema does not exist in language Json file
        if (!languageData[translation.name]) {
            languageData[translation.name] = translation.name;
            return;
        }

        const variablePattern = /{{(.*?)}}/g;
        const patterns = [];
        let match;
        // tslint:disable-next-line:no-conditional-assignment
        while (match = variablePattern.exec(languageData[translation.name])) {
            patterns.push(match[1]); // match[1] hold the value from the exec regex
        }

        if (!!patterns.length) {
            if (!translation.variables) {
                errors.push(`${language}.json at key ${translation.name} should have no variables`);
            }
            patterns.forEach(pattern => {
                if (!translation.variables.find(variable => variable.trim() === pattern.trim())) {
                    // Throw error if the variable in the translation not existed in the schema
                    errors.push(`Incorrect variable for ${pattern} from ${language}.json at key ${translation.name}`);
                }
            });
            // Skip case checking missing variables for now
            // translation.variables.forEach(variable => {
                // if (languageData[translation.name] !== translation.name && !languageData[translation.name].includes(variable)) {
                //     throw new Error(`Param missing from ${language}.json at key ${translation.name}`);
                // }
            // });
        }
    });

    return languageData;
}

function _validateSchema(schemaData) {
    const data = [];
    schemaData.supportedLanguages.forEach((language) => {
        let languageData;
        let json;
        try {
            json = fs.readFileSync(path.join(i18nPath, `${language}.json`), 'utf8');
        } catch (e) {
            json = '{}';
            console.log(`New language generated: ${language}`);
        }
        languageData = JSON.parse(json);
        const validatedLanguageData = _validateLanguageKeyFromSchema(schemaData.schema, language, languageData);
        data.push({
            language,
            validatedLanguageData
        });
    });
    return data;
}

function _validateJsonFiles(schemaData, validatedSchema) {
    JSON.parse(JSON.stringify(validatedSchema)).forEach((validatedLanguageSchema, index) => {
        Object.keys(validatedLanguageSchema.validatedLanguageData).forEach(key => {
            if (!schemaData.find(data => data.name === key)) {
                delete validatedSchema[index].validatedLanguageData[key];
            }
        });
    });
}

function _writeJsonFiles(schemaData) {
    schemaData.forEach(data => {
        const filePath = path.join(i18nPath, `${data.language}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data.validatedLanguageData, null, 2), { encoding: 'utf8' });
    });
}

function main() {
    console.log('Starting to validate json files from the schema');
    const schemaFile = fs.readFileSync(schemaPath, 'utf8');
    const data = JSON.parse(schemaFile);
    console.log('Validating schema ...');
    const validatedSchema = _validateSchema(data);
    console.log('Validating Json files ...');
    _validateJsonFiles(data.schema, validatedSchema);
    console.log('Writing Json files ...');
    if (errors.length > 0) {
        console.log(errors);
        return;
    }
    _writeJsonFiles(validatedSchema);
    console.log('Finished');
}

main();
