const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3001
  },
  pwa: {
    name: 'MedMarket',
    short_name: 'MedMarket',
    description: 'East Africa\'s Premier Medical Supply Platform',
    themeColor: '#1d4ed8',
    msTileColor: '#1d4ed8',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default',
    manifestOptions: {
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait'
    }
  }
})
