import camelCase from 'lodash/camelCase';

// auto-import all mirage submodules
const req = require.context('./', true, /\.js$/);
const modules = req.keys().reduce((acc, modulePath) => {
  const moduleParts = modulePath.split('/');
  const moduleType = moduleParts[1];
  const moduleName = moduleParts[2];

  if (moduleName) {
    const moduleKey = camelCase(moduleName.replace('.js', ''));

    return Object.assign(acc, {
      [moduleType]: {
        ...(acc[moduleType] || {}),
        [moduleKey]: req(modulePath).default
      }
    });
  } else if (modulePath === './config.js') {
    return Object.assign(acc, {
      baseConfig: req(modulePath).default
    });
  }

  return acc;
}, {});

export default modules;
