module.exports = {
  'type': 'sqlite',
  'database': 'src/database/db.sqlite',
  'migrations': ['src/database/migrations/*.ts'],
  'entities': ['src/models/*.ts'],
  'cli': {
    'migrationsDir': 'src/database/migrations'
  }
}