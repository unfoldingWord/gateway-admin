module.exports = {
  // No `target` set: the legacy 'serverless' target is deprecated and the
  // Netlify Next.js Runtime v4 expects the standard `.next` build output.
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    config.plugins.push(new webpack.IgnorePlugin(/canvas/))

    // uw-content-validation@3.2.1 bundles yaml@2.x, which ships modern JS
    // (optional chaining) that webpack 4 cannot parse. Run it through Babel.
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/uw-content-validation\/node_modules\/yaml/,
      use: defaultLoaders.babel,
    })

    // Important: return the modified config
    return config
  },
}
