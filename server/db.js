import {Pool} from "pg";

const pool = new Pool({
  host: Your_host,
  user: YOUR_USER,
  password: PASSSWORD,
  database: YOUR_DATABASE,
  port: YOUR_PORT,
});
export default pool;
