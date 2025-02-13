const fs = require("fs");
const { readFile } = require("fs/promises");
const path = require("path");
const { restPut } = require("../../../fr-config-common/src/restClient");
const cliUtils = require("../helpers/cli-options");
const { OPTION } = cliUtils;

const updateSecretMappings = async (argv, token) => {
  const { REALMS, TENANT_BASE_URL, CONFIG_DIR } = process.env;

  const requestedMappingName = argv[OPTION.NAME];
  const realms = argv[OPTION.REALM] ? [argv[OPTION.REALM]] : JSON.parse(REALMS);

  if (requestedMappingName) {
    if (realms.length !== 1) {
      console.error(
        "Error: for a named secret mapping, specify a single realm"
      );
      process.exit(1);
    } else {
      console.log("Updating secret mapping", requestedMappingName);
    }
  } else {
    console.log("Updating secret mappings");
  }

  try {
    for (const realm of realms) {
      // Read JSON files
      const dir = path.join(CONFIG_DIR, `/realms/${realm}/secret-mappings`);
      if (!fs.existsSync(dir)) {
        console.log(
          `Warning: No secret mappings config defined in realm ${realm}`
        );
        continue;
      }

      const configFiles = fs
        .readdirSync(dir)
        .filter((name) => path.extname(name) === ".json"); // Filter out any non JSON files
      // Map JSON file content to an array

      // Update each mapping
      await Promise.all(
        configFiles.map(async (configFile) => {
          const fileContent = JSON.parse(
            await readFile(path.join(dir, configFile))
          );

          const mappingName = fileContent._id;
          if (requestedMappingName && requestedMappingName !== mappingName) {
            return;
          }
          //remove _rev if present to prevent validation error
          delete fileContent._rev;

          const requestUrl = `${TENANT_BASE_URL}/am/json/realms/root/realms/${realm}/realm-config/secrets/stores/GoogleSecretManagerSecretStoreProvider/ESV/mappings/${mappingName}`;
          await restPut(requestUrl, fileContent, token);

          return Promise.resolve();
        })
      );
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = updateSecretMappings;
