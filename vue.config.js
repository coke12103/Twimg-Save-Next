module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: []
    },
    electronBuilder: {
      preload: 'src/preload.js'
    }
  }
}
