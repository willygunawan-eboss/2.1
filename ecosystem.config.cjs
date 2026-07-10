module.exports = {
  apps: [
    {
      name: "erp-ichangeboss",
      script: "dist/server.cjs",
      env: {
        NODE_ENV: "production",
        PORT: 3010
      }
    }
  ]
};
