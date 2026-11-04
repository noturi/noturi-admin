import { Logger } from 'tslog';

import { IS_PRODUCTION } from '../constants';

// tslog v5: 설정이 pretty/mask 그룹으로 바뀜 — 예전 평면 키는 경고 없이 무시되므로 strictConfig로 잘못된 키를 막음
const logger = new Logger({
  minLevel: parseInt(process.env.NEXT_PUBLIC_LOGGER_LEVEL || '4'),
  type: IS_PRODUCTION ? 'json' : 'pretty',
  strictConfig: true,
  // v5부터 마스킹 기본값이 꺼짐 — 비밀번호 등이 로그에 남지 않게 명시
  mask: {
    keys: ['password', 'passwordConfirmation', 'confirmPassword', 'credentials', 'credential'],
  },
  pretty: {
    timeZone: IS_PRODUCTION ? 'UTC' : 'local',
    errorStackTemplate: '  • {{fileName}}\t{{method}}\n\t{{filePathWithLine}}', // default
    errorTemplate: '\n{{errorName}} {{errorMessage}}\nerror stack:\n{{errorStack}}', // default
    template: '{{hh}}:{{MM}}:{{ss}}:{{ms}} [{{logLevelName}}] ', // default with exclusion of `{{filePathWithLine}}`
    style: true,
    styles: {
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
  },
});

export default logger;
