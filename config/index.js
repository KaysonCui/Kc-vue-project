/* eslint key-spacing:0 spaced-comment:0 */
const path = require('path')
const debug = require('debug')('app:config')
const argv = require('yargs').argv
let local = {}
try {
  local = require('./local')
} catch(e) {
  local = {}
}
debug('Creating default configuration.')
let env_config = {
  'development': {},
  'test': {},
  'production': {}
}
const NODE_ENV = process.env.NODE_ENV || 'development'
  // ========================================================
  // Default Configuration
  // ========================================================
const config = Object.assign(env_config[NODE_ENV], {
  // ----------------------------------
  // Project Structure
  // ----------------------------------
  env: NODE_ENV,
  path_base: path.resolve(__dirname, '..'),
  dir_client: 'src',
  dir_dist: 'dist',
  dir_tmp: 'tmp',
  dir_server: 'server',
  server_host: local.host,
  server_port: 3000,
  api_path: `/api`,
  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_devtool: 'source-map',
  compiler_hash_type: 'hash',
  compiler_fail_on_warning: false,
  compiler_quiet: false,
  compiler_public_path: '/',
  compiler_stats: {
    chunks: false,
    chunkModules: false,
    colors: true
  },
  compiler_vendors: ['vue', 'vue-router', 'vue-resource', 'vuex'],
  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_reporters: [{ type: 'text-summary' }, { type: 'lcov', dir: 'coverage' }]
})
config.local = local
  /************************************************
  -------------------------------------------------

  All Internal Configuration Below
  Edit at Your Own Risk

  -------------------------------------------------
  ************************************************/
  // ------------------------------------
  // Environment
  // ------------------------------------
  // N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
    'process.env': {
      'NODE_ENV': JSON.stringify(config.env)
    },
    'NODE_ENV': config.env,
    '__DEV__': config.env === 'development',
    '__PROD__': config.env === 'production',
    '__TEST__': config.env === 'test',
    '__COVERAGE__': !argv.watch && config.env === 'test',
    '__BASENAME__': JSON.stringify(process.env.BASENAME || ''),
    '__DEBUG__': config.env === 'development' || config.env === 'test',
    '__API_PATH__': `\'${config.api_path}\'`
  }
  // ------------------------------------
  // Validate Vendor Dependencies
  // ------------------------------------
const pkg = require('../package.json')
config.compiler_vendors = config.compiler_vendors.filter((dep) => {
    if(pkg.dependencies[dep]) return true
    debug(`Package "${dep}" was not found as an npm dependency in package.json; ` + `it won't be included in the webpack vendor bundle.
       Consider removing it from compiler_vendors in ~/config/index.js`)
  })
  // ------------------------------------
  // Utilities
  // ------------------------------------
function base() {
  const args = [config.path_base].concat([].slice.call(arguments))
  return path.resolve.apply(path, args)
}
config.utils_paths = {
    base: base,
    client: base.bind(null, config.dir_client),
    dist: base.bind(null, config.dir_dist),
    tmp: base.bind(null, config.dir_tmp)
  }
  // ========================================================
  // Environment Configuration
  // ========================================================
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`)
const environments = require('./environments')
const overrides = environments[config.env]
if(overrides) {
  debug('Found overrides, applying to default configuration.')
  Object.assign(config, overrides(config))
} else {
  debug('No environment overrides found, defaults will be used.')
}
module.exports = config