const nextConfig = {
  reactStrictMode: true,
 // output: 'export',
  swcMinify: true,      
  compiler: {
    removeConsole: false
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  reloadOnOnline: true,
  disable: false,
  skipWaiting: true,
  sw: 'sw.js',
});
  
module.exports = withPWA(nextConfig);
