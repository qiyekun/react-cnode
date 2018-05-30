const path = require('path')

module.exports = {
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/'
  },
  resolve: {// 解析模块请求的选项
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        enforce: 'pre', // js| jsx 编译前先进行校验
        test: /(.js|.jsx)$/, // 用于标识出应该被对应的 loader 进行转换的某个或某些文件
        loader: 'eslint-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules') // 总是返回一个以相对于当前的工作目录（working directory）的绝对路径
        ]
      },
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [path.join(__dirname, '../node_modules')]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  }
}
