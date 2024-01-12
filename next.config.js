// Configuration options for Next.js
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,      
    compiler: {
      removeConsole: false
    },
  };
  
  // Configuration object tells the next-pwa plugin 
  const withPWA = require("next-pwa")({
    dest: "public", 
    disable: false, 
    register: true, 
    skipWaiting: true, 
  });
  
  module.exports = withPWA(nextConfig);