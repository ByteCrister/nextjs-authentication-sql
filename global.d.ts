import type { Pool } from "mysql2/promise";

declare global {
  var _pool: Pool | undefined;
}
