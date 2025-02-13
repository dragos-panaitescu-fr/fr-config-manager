const utils = require("../helpers/utils.js");
const fs = require("fs");
const { saveJsonToFile } = utils;
const { restGet } = require("../../../fr-config-common/src/restClient.js");

const EMAIL_SUB_DIR = "email-templates";

function splitLangToFile(property, templatePath, templateName, suffix) {
  if (!property) {
    return;
  }

  Object.entries(property).forEach(([language, text]) => {
    const filename = `${templateName}.${language}.${suffix}`;
    fs.writeFileSync(`${templatePath}/${filename}`, text);
    property[language] = {
      file: filename,
    };
  });
}

function processEmailTemplates(templates, fileDir, name) {
  try {
    templates.forEach((template) => {
      const templateName = template._id.split("/")[1];

      if (name && name !== templateName) {
        return;
      }

      const templatePath = `${fileDir}/${templateName}`;

      if (!fs.existsSync(templatePath)) {
        fs.mkdirSync(templatePath, { recursive: true });
      }

      splitLangToFile(template.html, templatePath, templateName, "html");
      splitLangToFile(template.message, templatePath, templateName, "md");
      if (template.styles) {
        const cssFilename = `${templateName}.css`;
        fs.writeFileSync(`${templatePath}/${cssFilename}`, template.styles);
        template.styles = {
          file: cssFilename,
        };
      }

      const fileName = `${templatePath}/${templateName}.json`;
      saveJsonToFile(template, fileName);
    });
  } catch (err) {
    console.error(err);
  }
}

async function exportEmailTemplates(exportDir, tenantUrl, name, token) {
  try {
    const idmEndpoint = `${tenantUrl}/openidm/config`;

    const response = await restGet(
      idmEndpoint,
      { _queryFilter: '_id sw "emailTemplate"' },
      token
    );

    // console.log(JSON.stringify(response.data.result));
    const templates = response.data.result;

    const fileDir = `${exportDir}/${EMAIL_SUB_DIR}`;
    processEmailTemplates(templates, fileDir, name);
  } catch (err) {
    console.log(err);
  }
}

module.exports.exportEmailTemplates = exportEmailTemplates;
