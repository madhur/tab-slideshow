const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: "production",
    entry: {
     "input": ['./src/popup.ts', './src/tabslideshow.ts']
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "popup.js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "./popup.html", to: "." }]
        }),
    ],
};