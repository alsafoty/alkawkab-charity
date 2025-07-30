const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: "src/preload.js",
      customFileProtocol: "./",
      files: ["**/*"],
      builderOptions: {
        extraResources: [
          {
            from: "public",
            to: "public",
          },
        ],
        appId: "com.alkawkab.charity",
        productName: "Charity Management System",
        win: {
          target: ["nsis", "portable"],
          icon: "build/icons/icon.ico",
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "Charity Management System",
        },
      },
    },
  },
});
