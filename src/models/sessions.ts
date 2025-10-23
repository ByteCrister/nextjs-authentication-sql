// src/models/sessionsModel.ts
import { db } from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

// Shape of a row in the `auth_sessions` table
export type SessionRow = {
  session_token: string;
  user_id: number;
  expires_at: Date;
  created_at: Date;
};

export const sessionsModel = {
  async create(
    session_token: string,
    user_id: number,
    expires_at: Date
  ): Promise<SessionRow> {
    const insertQuery = `
      INSERT INTO auth_sessions (session_token, user_id, expires_at)
      VALUES (?, ?, ?)
    `;

    // Perform the insert
    await db.execute<ResultSetHeader>(insertQuery, [
      session_token,
      user_id,
      expires_at,
    ]);

    // Fetch the inserted row (since MySQL doesn’t support RETURNING)
    const [rows] = await db.execute<(SessionRow & RowDataPacket)[]>(
      `SELECT session_token, user_id, expires_at, created_at
       FROM auth_sessions
       WHERE session_token = ?
       LIMIT 1`,
      [session_token]
    );

    return rows[0];
  },

  async findByToken(token: string): Promise<SessionRow | null> {
    const q = `SELECT * FROM auth_sessions WHERE session_token = ? LIMIT 1`;
    const [rows] = await db.execute<(SessionRow & RowDataPacket)[]>(q, [token]);
    return rows[0] || null;
  },

  async delete(token: string): Promise<void> {
    const q = `DELETE FROM auth_sessions WHERE session_token = ?`;
    await db.execute<ResultSetHeader>(q, [token]);
  },
};
