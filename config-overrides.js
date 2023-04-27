module.exports = {
  webpack: function (config, env) {
    console.log('Current env: ', env);

    if (env !== 'production') {
      return config;
    }

    config.optimization.minimize = true;
    config.optimization.minimizer[0].parallel = false;

    return config;
  },
};
