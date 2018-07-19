const packageJson = require('../../package.json');

export const environment = {
  appName: '游戏监控',
  envName: 'PROD',
  production: true,
  test: false,
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
    ngrx: packageJson.dependencies['@ngrx/store'],
    material: packageJson.dependencies['@angular/material'],
    bootstrap: packageJson.dependencies.bootstrap,
    rxjs: packageJson.dependencies.rxjs,
    fontAwesome:
      packageJson.dependencies['@fortawesome/fontawesome-free-webfonts'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    typescript: packageJson.devDependencies['typescript']
  },
  socket: {
    baseUrl: location.protocol + '//' + location.hostname + ':3000',
    config: {}
  }
};
