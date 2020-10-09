// @flow strict
/* eslint-env node */
import path from "path";
import { DefinePlugin } from "webpack";

/**
 * Path constants.
 */
const PATH_ABSOLUTE_SOURCE: string = path.resolve(__dirname, "src");
const PATH_ABSOLUTE_DISTRIBUTION: string = path.resolve(__dirname, "dist");

/**
 * Regex constants.
 */
const REGEX_FILE_JAVASCRIPT: RegExp = /.js$/u;
const REGEX_DIRECTORY_NODE_MODULES: RegExp = /node_modules/u;

export default {
    mode: "production",
    entry: PATH_ABSOLUTE_SOURCE,
    target: "web",
    devtool: "source-map",
    output: {
        filename: "index.js",
        path: PATH_ABSOLUTE_DISTRIBUTION,
    },
    plugins: [
        new DefinePlugin({
            GLOBAL_DEFAULT_KEY_NAME_ID: "id",
        }),
    ],
    optimization: {
        minimize: true,
    },
    resolve: {
        extensions: [".js"],
        modules: [PATH_ABSOLUTE_SOURCE],
    },
    module: {
        rules: [
            {
                test: REGEX_FILE_JAVASCRIPT,
                exclude: REGEX_DIRECTORY_NODE_MODULES,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
};
