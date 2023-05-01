const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: "production",
    entry: {
        "popup": ['./src/popup.ts'],
        "options": ['./src/options.ts'],
        "background": ['./src/background.ts']
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js",
        clean: true
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
            patterns: [{ from: "./popup.*", to: "." },
            { from: "./manifest.json", to: "." },
            { from: "./*.html", to: "." },
            { from: "vendor", to: "." },
            { from: "images", to: "./images" }]

        }),
    ],
};