const path = require('path')
// 开发阶段 不忽略打包 加载本地资源
let externals = {}
// 判断环境变量为生产阶段
if (process.env.NODE_ENV === 'production') {
  externals = {
    //key: 包名
    //去window查找寻找忽略打包的（vue、xlsx）等
    //或略打包只能忽略js包
    'element-ui': 'ELEMENT',
    vue: 'Vue',
    'video.js': 'video.js',
    'cos-js-sdk-v5': 'COS'
  }
}
module.exports = {
  lintOnSave: false,
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: {
    externals
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].myEnv = process.env.NODE_ENV
      return args
    })
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .test(/.svg$/)
      .include.add(path.resolve(__dirname, './src/icons/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    const fileRule = config.module.rule('file')
    fileRule.uses.clear()
    fileRule
      .test(/.svg$/)
      .exclude.add(path.resolve(__dirname, './src/icons/svg'))
      .end()
      .use('file-loader')
      .loader('file-loader')
    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          }
        }
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  }
}
