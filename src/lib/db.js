// /src/lib/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '143.198.223.114',
  user: 'mousblog_user',
  password: 'joanukung',
  database: 'mousblog_db',
  waitForConnections: true,
  connectionLimit: 10,
  port: 3306
});

export default pool;