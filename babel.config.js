module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@controllers': './src/controllers',
        '@models': './src/models',
        '@views': './src/views',
        '@services': './src/services',
        '@connection': './src/database/connection'
      }
    }],
    ['@babel/plugin-proposal-decorators', {
      legacy: true
    }]
  ],
  ignore: [
    '**/*.test.ts'
  ]
}
