module.exports = {
  apps: [
    {
      name: 'roadblock-web',
      script: './node_modules/.bin/next',
      args: 'start',
      cwd: '/root/roadblock',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
