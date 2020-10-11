// @flow strict
/* eslint-env node */
import path from "path";
import { DefinePlugin } from "webpack";
import CircularDependencyPlugin from "circular-dependency-plugin";

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

/**
 * Index constants.
 */
const INDEX_INVALID: number = -1;

export default {
    mode: "production",
    entry: `${PATH_ABSOLUTE_SOURCE}/index.js`,
    target: "web",
    devtool: "source-map",
    output: {
        libraryTarget: "this",
        filename: "hades.min.js",
        path: PATH_ABSOLUTE_DISTRIBUTION,
    },
    plugins: [
        new DefinePlugin({
            GLOBAL_INDEX_INVALID: INDEX_INVALID,
            GLOBAL_SEPARATOR_SPACE: JSON.stringify(" "),
            GLOBAL_DEFAULT_KEY_NAME_ID: JSON.stringify("id"),
            GLOBAL_TYPE_UNDEFINED: JSON.stringify("undefined"),
        }),
        new CircularDependencyPlugin({
            failOnError: true,
            cwd: process.cwd(),
            exclude: REGEX_DIRECTORY_NODE_MODULES,
        }),
    ],
    optimization: {
        minimize: true,
    },
    resolve: {
        extensions: [".js"],
        modules: [PATH_ABSOLUTE_SOURCE, "node_modules"],
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
