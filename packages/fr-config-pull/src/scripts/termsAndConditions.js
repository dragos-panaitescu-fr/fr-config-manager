const utils = require("../helpers/utils.js");
const fs = require("fs");
const { restGet } = require("../../../fr-config-common/src/restClient.js");
const { saveJsonToFile } = utils;

const EXPORT_SUB_DIR = "terms-conditions";
const EXPORT_FILE_NAME = "terms-conditions.json";

function processTerms(terms, fileDir, name) {
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true });
  }

  try {
    terms.versions.forEach((version) => {
      if (name && name !== version.version) {
        return;
      }
      const versionPath = `${fileDir}/${version.version}`;

      if (!fs.existsSync(versionPath)) {
        fs.mkdirSync(versionPath, { recursive: true });
      }

      Object.entries(version.termsTranslations).forEach(([language, text]) => {
        const fileName = `${version.version}/${language}.html`;
        fs.writeFileSync(`${fileDir}/${fileName}`, text);
        version.termsTranslations[language] = {
          file: fileName,
        };
      });
    });

    const configFileName = `${fileDir}/${EXPORT_FILE_NAME}`;
    saveJsonToFile(terms, configFileName);
  } catch (err) {
    console.error(err);
  }
}

async function exportTerms(exportDir, tenantUrl, name, token) {
  try {
    const idmEndpoint = `${tenantUrl}/openidm/config/selfservice.terms`;

    const response = await restGet(idmEndpoint, null, token);

    const terms = response.data;

    const fileDir = `${exportDir}/${EXPORT_SUB_DIR}`;
    processTerms(terms, fileDir, name);
  } catch (err) {
    console.log(err);
  }
}

module.exports.exportTerms = exportTerms;
