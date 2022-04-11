const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
  addWebpackPlugin,
  // addLessLoader,
  // addPostcssPlugins,
} = require("customize-cra");
const path = require("path");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const isEnvProduction = process.env.NODE_ENV === "production";

const addCompression = () => config => {
  if (isEnvProduction) {
    config.plugins.push(
      // gzip压缩
      new CompressionWebpackPlugin({
        test: /\.(css|js)$/,
        // 只处理比1kb大的资源
        threshold: 1024,
        // 只处理压缩率低于90%的文件
        minRatio: 0.9
      })
    );
  }

  return config;
};

// 查看打包后各包大小
const addAnalyzer = () => config => {
  if (process.env.ANALYZER) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
};

module.exports = override(
  //!!!! 按需加载 此处如果仅配置单个按需引入如antd，需要去掉第二参数的中括号，否则配置会失效
  fixBabelImports("import", [
    {
      libraryName: "antd",
      libraryDirectory: "es",
      // 若修改antd主题，"css"需改为true
      style: "css"
    },
    {
      libraryName: "@material-ui/core",
      libraryDirectory: "esm",
      camel2DashComponentName: false
    }
  ]),
  // 移动端适配，px转rem 需要安装postcss-pxtorem
  // addPostcssPlugins([
  //  require("postcss-pxtorem")({
  //    // rem 转换基数
  //    rootValue: 16,
  //    // 保留五位小数点
  //    unitPrecision: 5,
  //    // 所有属性都转换
  //    propList: ["*"],
  //    // 低于2px不转换
  //    minPixelValue: 2,
  //    // 排除antd样式
  //  selectorBlackList:[/^\.ant-/,"html"]
  //  }),
  // 修改antd 主题 需 yarn add less less-loader -D 添加依赖包
  // addLessLoader({
  //   javascriptEnabled: true
  //   modifyVars: { '@primary-color': '#1DA57A' },
  // }),
  addCompression(),
  addAnalyzer(),
  addWebpackPlugin(
    // 终端进度条显示
    new ProgressBarPlugin()
  ),
  addWebpackAlias({
    ["@"]: path.resolve(__dirname, "src")
  })
);
