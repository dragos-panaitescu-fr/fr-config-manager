# Configuration Manager: fr-config-push

This tool is used to push configuration from the local host to your ForgeRock Identity Cloud tenant.

## Installation

The tool is installed from the package directory as follows

```
npm install
npm link
```

## Configuration

The tool is configured via environment variables. Copy the sample `.env` file and configure as per the instructions in the [configuration README](../docs/environment.md).

## Usage

Run the `fr-config-push` tool as follows to push configuration from the local host to your Identity Cloud tenant.

```
Usage: fr-config-push [arguments]

Commands:
  fr-config-push all-static             Update all static configuration
  fr-config-push access-config          Update access configuration
  fr-config-push audit                  Update audit configuration
  fr-config-push authentication         Update authentication configuration
  fr-config-push authz-policies         Update authorization policies
  fr-config-push config-metadata        Update configuration metadata
  fr-config-push connector-definitions  Update connector definitions
  fr-config-push connector-mappings     Update connector mappings
  fr-config-push cors                   Update CORS configuration
  fr-config-push email-provider         Update email provider settings
  fr-config-push email-templates        Update email templates
  fr-config-push endpoints              Update custom endpoints
  fr-config-push internal-roles         Update internal roles
  fr-config-push journeys               Update authentication journeys
  fr-config-push kba                    Update KBA configuration
  fr-config-push locales                Update locales
  fr-config-push managed-objects        Update managed objects
  fr-config-push oauth2-agents          Update OAuth2 agents
  fr-config-push password-policy        Update password policy
  fr-config-push remote-servers         Update remote connector servers
  fr-config-push restart                Restart tenant
  fr-config-push schedules              Update schedules
  fr-config-push scripts                Update authentication scripts
  fr-config-push secrets                Update secrets
  fr-config-push secret-mappings        Update secret mappings
  fr-config-push service-objects        Update service objects
  fr-config-push services               Update authentication services
  fr-config-push terms-and-conditions   Update terms and conditions
  fr-config-push test                   Test connection and authentication
  fr-config-push themes                 Update UI themes
  fr-config-push ui-config              Update UI configuration
  fr-config-push variables              Update environment specific variables

Options:
  -h, --help               Show help                                   [boolean]
  -n, --name               Specific configuration                       [string]
  -r, --realm              Specific realm (overrides environment)       [string]
  -d, --push-dependencies  Push dependencies                           [boolean]
  -f, --filenameFilter     Filename filter                              [string]
  -m, --metadata           Configuration metadata
  -v, --version            Show version number                         [boolean]
```

Notes on specific options:

`fr-config-push journeys`

The `--name` option can be used with the `journeys` command to push a specific journey. This can only be used if a single realm is requested, either via the .env/environment setting or via the `--realm` option. For example

```
fr-config-push journeys --name "Customer Login" --realm alpha
```

The `--push-dependencies` option can be used with the `journeys` command to push all scripts and inner journeys associated with each journey pushed. For example

```
fr-config-push journeys --name "Customer Login" --realm alpha --push-dependencies
```

If you don't use the `--name` option, then inner journeys are pushed by default (but the `--push-dependencies` option is still required in order to push dependent scripts along with journeys).

`fr-config-push config-metadata`

The `--metadata` option is used to specify arbitrary metadata to be stored in the tenant configuration. This is stored in the config container `/openidm/config/custom-config.metadata` as a JSON object. Specify multiple metadata elements using the dot notation, including nested elements - e.g.

```
fr-config-push config-metadata --metadata.pushedAt $(date -u +"%Y-%m-%dT%H:%M:%SZ") --metadata.versionInfo.version 1.0 --metadata.versionInfo.stable --metadata.versionInfo.rev $(git rev-parse HEAD)
```

Example metadata produced by the command above is as follows

```
{
  "_id": "custom/config.metadata",
  "pushedAt": "2023-09-10T10:21:46Z",
  "versionInfo": {
    "version": "1.0",
    "stable": true,
    "rev": "0675342640420f7ff6635d6a63d2c9c81b6feca7"
  }
}
```

Metadata options may also be provided with the `fr-config-push all-static` command
