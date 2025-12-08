module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel", // <--- C'est cette ligne qui fait la magie !
    ],
  };
};
