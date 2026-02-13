/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.phaser = require.resolve('phaser/dist/phaser.js')
    return config
  },
}

module.exports = nextConfig