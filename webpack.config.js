const webpack = require("webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const glob = require("glob-all");
const parts = require("./webpack.parts");
const CopyPlugin = require('copy-webpack-plugin');


const PATHS = {
    app: path.join(__dirname, "src"),
};


const commonConfig = merge([{
        plugins: [
            new HtmlWebpackPlugin({
                title: "Webpack demo",
                template: "./src/index.html",
                filename: "./index.html",
                minify: false
            }),
            new CopyPlugin({
                patterns: [
                  { from: 'src/assets', to: 'assets' }
                ],
              }),
        ],
    },
    parts.loadJavaScript({ include: PATHS.app }),
    parts.loadHtml({ include: PATHS.app }),
    parts.loadFont({ include: PATHS.app }),
    parts.loadVideo({ include: PATHS.app }),
]);

const productionConfig = merge([{
        output: {
            chunkFilename: "[name].[chunkhash:4].js",
            filename: "[name].[chunkhash:4].js",
        },
    },
    {
        performance: {
            hints: "warning", // "error" or false are valid too
            maxEntrypointSize: 50000, // in bytes, default 250k
            maxAssetSize: 450000, // in bytes
        },
    },
    {
        recordsPath: path.join(__dirname, "records.json"),
        output: {
            chunkFilename: "[name].[chunkhash:4].js",
            filename: "[name].[chunkhash:4].js",
        },

    },
    parts.clean(),
    parts.minifyJavaScript(),

    parts.minifyCSS({
        options: {
            discardComments: {
                removeAll: true,
            },
            // Run cssnano in safe mode to avoid
            // potentially unsafe transformations.
            safe: true,
        },
    }),
    parts.extractCSS({
        use: ["css-loader", parts.autoprefix()],
    }),
    parts.purgeCSS({
        paths: glob.sync(`${PATHS.app}/**/*`, { nodir: true }),
    }),

    parts.devImages(),

    parts.generateSourceMaps({ type: "source-map" }),
    {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "initial",
                    },
                },
            },
            runtimeChunk: {
                name: "manifest",
            },
        },
    },

]);

const developmentConfig = merge([
    parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT,
    }),
    parts.loadCSS(),
    parts.loadImages()



]);

module.exports = mode => {

    process.env.BABEL_ENV = mode;
    if (mode === "production") {
        return merge(commonConfig, productionConfig, { mode });
    }
    return merge(commonConfig, developmentConfig, { mode });
};