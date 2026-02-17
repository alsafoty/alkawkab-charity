const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,

  // Development server configuration
  devServer: {
    proxy: {
      "/api": {
        target:
          process.env.VUE_APP_API_BASE_URL || "https://charityapp.runasp.net",
        changeOrigin: true,
        secure: false,
        logLevel: "debug",
      },
    },
  },

  // Production optimization
  productionSourceMap: false,

  // Performance optimization
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
          },
        },
      },
    },
  },

  // PWA-like features
  pwa: {
    name: "جمعية الكوكب الدري",
    themeColor: "#4DBA87",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
  },
});
