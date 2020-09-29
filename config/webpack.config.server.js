const paths = require('./paths')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const getClientEnvironment = require('./env')

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))

module.exports = {
  mode: 'production',
  entry: paths.ssrIndexJs,
  target: 'node',
  output: {
    path: paths.ssrBuild,
    filename: 'server.js',
    chunkFilename: 'js/[name].chunk.js',
    publicPath: paths.publicUrlOrPath,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve(
                'babel-preset-react-app/webpack-overrides'
              ),
              plugins: [
                [
                  require.resolve('babel-plugin-named-asset-import'),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '@svgr/webpack?-svgo![path]',
                      },
                    },
                  },
                ],
              ],
              cacheDirectory: true,
              cacheCompression: false,
              compact: false,
            },
          },

          {
            test: cssRegex,
            exclude: cssModuleRegex,
            loader: require.resolve('css-loader'),
            options: {
              onlyLocals: true, // does not create css file
            },
          },
          {
            test: cssModuleRegex,
            loader: require.resolve('css-loader'),
            options: {
              modules: true,
              onlyLocals: true,
              getLocalIdent: getCSSModuleLocalIdent,
            },
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: [
              {
                loader: require.resolve('css-loader'),
                options: {
                  onlyLocals: true,
                },
              },
              require.resolve('sass-loader'),
            ],
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: [
              {
                loader: require.resolve('css-loader'),
                options: {
                  modules: true,
                  onlyLocals: true,
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              },
              require.resolve('sass-loader'),
            ],
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              emitFile: false,
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              emitFile: false, // does not save file
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: paths.moduleFileExtensions
      .map((ext) => `.${ext}`)
      .filter((ext) => true || !ext.includes('ts')),
  },
  externals: [nodeExternals()],
  plugins: [new webpack.DefinePlugin(env.stringified)],
}
