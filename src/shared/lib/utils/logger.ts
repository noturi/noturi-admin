import { Logger } from 'tslog';

import { IS_PRODUCTION } from '../constants';

const logger = new Logger({
  minLevel: parseInt(process.env.NEXT_PUBLIC_LOGGER_LEVEL || '4'),
  maskValuesOfKeys: ['password', 'passwordConfirmation', 'credentials', 'credential'],
  prettyLogTimeZone: IS_PRODUCTION ? 'UTC' : 'local',
  prettyErrorStackTemplate: '  • {{fileName}}\t{{method}}\n\t{{filePathWithLine}}', // default
  prettyErrorTemplate: '\n{{errorName}} {{errorMessage}}\nerror stack:\n{{errorStack}}', // default
  prettyLogTemplate: '{{hh}}:{{MM}}:{{ss}}:{{ms}} [{{logLevelName}}] ', // default with exclusion of `{{filePathWithLine}}`
  stylePrettyLogs: true,
  prettyLogStyles: {
    logLevelName: {
      '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
      SILLY: ['bold', 'white'],
      TRACE: ['bold', 'whiteBright'],
      DEBUG: ['bold', 'green'],
      INFO: ['bold', 'blue'],
      WARN: ['bold', 'yellow'],
      ERROR: ['bold', 'red'],
      FATAL: ['bold', 'redBright'],
    },
    dateIsoStr: 'blue',
    filePathWithLine: 'white',
    name: ['white', 'bold'],
    nameWithDelimiterPrefix: ['white', 'bold'],
    nameWithDelimiterSuffix: ['white', 'bold'],
    errorName: ['bold', 'bgRedBright', 'whiteBright'],
    fileName: ['yellow'],
  },
  type: IS_PRODUCTION ? 'json' : 'pretty',
});

export default logger;
