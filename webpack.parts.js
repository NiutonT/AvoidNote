const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");
const PurgecssPlugin = require('purgecss-webpack-plugin')



/* Para cargar css */
exports.loadCSS = ({ include, exclude } = {}) => ({
    module: {
        rules: [{
                test: /\.css$/,
                include,
                exclude,

                use: ["style-loader", "css-loader"],
            },

        ],
    },
});

exports.extractCSS = ({ include, exclude, use = [] }) => {
    // Output extracted CSS to a file
    const plugin = new MiniCssExtractPlugin({
        filename: "[name].[chunkhash:4].css",
    });

    return {
        module: {
            rules: [{
                test: /\.css$/,
                include,
                exclude,

                use: [
                    MiniCssExtractPlugin.loader,
                ].concat(use),
            }, ],
        },
        plugins: [plugin],
    };
};

exports.purgeCSS = ({ paths }) => ({
    plugins: [new PurgecssPlugin({ paths })],
});


exports.autoprefix = () => ({
    loader: "postcss-loader",
    options: {
        plugins: () => [require("autoprefixer")()],
    },
});

exports.minifyCSS = ({ options }) => ({
    plugins: [
        new OptimizeCSSAssetsPlugin({
            cssProcessor: cssnano,
            cssProcessorOptions: options,
            canPrint: false,
        }),
    ],
});

exports.devServer = ({ host, port } = {}) => ({
    devServer: {
        stats: "errors-only",
        host, // Defaults to `localhost`
        port, // Defaults to 8080
        open: true,
        overlay: true,
    },
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [{
            test: /\.(png|jpg|webP|svg)$/,
            include,
            exclude,
            use: {
                loader: "url-loader",
                options,
            },
        }, ],
    },
});

exports.devImages = ({ include, exclude } = {}) => ({
    module: {
        rules: [{
            test: /\.(png|jpg|webP|svg)$/,
            include,
            exclude,
            use: [
                'file-loader?name=i/[name].[ext]',

                {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                        },
                        // optipng.enabled: false will disable optipng
                        optipng: {
                            enabled: true,
                        },
                        pngquant: {
                            quality: [0.65, 0.90],
                            speed: 4
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        svgo: {},
                        // the webp option will enable WEBP
                        webp: {
                            quality: 75
                        },

                    }
                }
            ],

        }, ],
    },
});

exports.loadVideo = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [{
            test: /\.(mp4|webm)$/,
            include,
            exclude,
            use: {
                loader: "file-loader",
                options: {
                    name: "media/[name].[ext]",
                },
            },
        }, ],
    },
});
exports.loadFont = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [{
            test: /\.(ttf|eot|woff|woff2)$/,
            use: {
                loader: "file-loader",
                options: {
                    name: "font/[name].[ext]",
                },
            },
        }, ],
    },
});
exports.loadJavaScript = ({ include, exclude } = {}) => ({
    module: {
        rules: [{
            test: /\.js$/,
            include,
            exclude,
            use: "babel-loader",
        }, ],
    }
});

exports.loadHtml = ({ include, exclude } = {}) => ({
    module: {
        rules: [{
            test: /\.(html)$/,
            use: {
                loader: 'html-loader',
                options: {
                    attributes: {
                        list: [{
                                tag: 'img',
                                attribute: 'data-flickity-lazyload',
                                type: 'src',
                            },
                            {
                                tag: 'img',
                                attribute: 'src',
                                type: 'src',
                            },
                            {
                                tag: 'img',
                                attribute: 'srcset',
                                type: 'srcset',
                            },
                            {
                                tag: 'source',
                                attribute: 'srcset',
                                type: 'src',
                            },
                            {
                                tag: 'video',
                                attribute: 'poster',
                                type: 'src',
                            },
                            {
                                tag: 'source',
                                attribute: 'src',
                                type: 'src',
                            }
                        ]
                    }
                }
            }
        }, ],
    },
});

exports.generateSourceMaps = ({ type }) => ({
    devtool: type,
});

exports.minifyJavaScript = () => ({
    optimization: {
        minimizer: [new TerserPlugin({ sourceMap: false })],
    },
});

exports.clean = path => ({
    plugins: [new CleanWebpackPlugin()],
});