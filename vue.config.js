const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const name = 'vue Admin Template'
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
    // 'highlight.js': 'highlight.js',
    // '@wangeditor/editor': '@wangeditor/editor'
    // quill: 'quill',
    // mockjs: 'mockjs',
    // 'core-js': 'core-js',
    'video.js': 'video.js',
    echarts: 'echarts',
    'cos-js-sdk-v5': 'COS'
  }
}
module.exports = {
  lintOnSave: false,
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: {
    name: name,
    // resolve: {
    //   alias: {
    //     '@': resolve('src')
    //   }
    // },
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

    // if (process.env.NODE_ENV === 'production') {
    //   config.plugin('compressionPlugin').use(
    //     new CompressionPlugin({
    //       filename: '[path].gz[query]',
    //       algorithm: 'gzip',
    //       test: /\.(js|css)(\?.*)?$/i, // 用['js', 'css']有个缺点就是map文件也会压缩,这时候压缩就没多大意义,用正则会更好一点
    //       threshold: 10240, // 单位bytes, 大于10k才会考虑压缩
    //       minRatio: 0.8 // 默认压缩率, 压缩结果能低于百分之八十才会进行压缩
    //       // deleteOriginalAssets: true //是否删除源文件(不推荐删除, 容易出现chunk报错问题)
    //     })
    //   )
    // }
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
