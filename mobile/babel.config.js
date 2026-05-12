module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "~": "./",
          },
        },
      ],
      ["inline-dotenv", { systemVar: "overwrite" }],
    ],
    env: {
      production: {
        plugins: [["react-native-paper/babel"], ["transform-remove-console"]],
      },
    },
  };
};
