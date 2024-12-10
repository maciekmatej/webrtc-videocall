import { Pool } from 'pg'

const pool = new Pool({
  user: 'your_username',
  password: 'your_password',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'your_database_name',
})

export function query(text, params) {
  return pool.query(text, params)
}
