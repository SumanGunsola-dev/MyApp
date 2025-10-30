const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const { withNativeWind } = require("nativewind/metro");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const baseConfig = getDefaultConfig(__dirname);
baseConfig.resolver.assetExts = baseConfig.resolver.assetExts.filter(ext => ext !== "svg");
baseConfig.resolver.sourceExts.push("svg");
baseConfig.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
const config = mergeConfig(baseConfig, {
    /* your custom Metro settings (if any) */
});

module.exports = withNativeWind(config, { input: "./global.css" });
