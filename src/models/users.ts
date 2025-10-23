// src/models/usersModel.ts
import { db } from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

// Shape of a row in the `users` table
export type UserRow = {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export const usersModel = {
  async create(
    email: string,
    name: string,
    password_hash: string
  ): Promise<UserRow> {
    const insertQuery = `
      INSERT INTO users (email, name, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
    `;

    // INSERT returns ResultSetHeader
    const [result] = await db.execute<ResultSetHeader>(insertQuery, [
      email,
      name,
      password_hash,
    ]);

    const userId = result.insertId;

    const [rows] = await db.execute<(UserRow & RowDataPacket)[]>(
      `SELECT id, email, name, password_hash, email_verified_at, created_at, updated_at
       FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );

    return rows[0];
  },

  async findByEmail(email: string): Promise<UserRow | null> {
    const q = `SELECT * FROM users WHERE email = ? LIMIT 1`;
    const [rows] = await db.execute<(UserRow & RowDataPacket)[]>(q, [email]);
    return rows[0] || null;
  },

  async findById(id: number): Promise<UserRow | null> {
    const q = `SELECT * FROM users WHERE id = ? LIMIT 1`;
    const [rows] = await db.execute<(UserRow & RowDataPacket)[]>(q, [id]);
    return rows[0] || null;
  },

  async markVerified(id: number): Promise<void> {
    const q = `UPDATE users SET email_verified_at = NOW() WHERE id = ?`;
    await db.execute<ResultSetHeader>(q, [id]);
  },

  async updatePassword(id: number, password_hash: string): Promise<void> {
    const q = `UPDATE users SET password_hash = ? WHERE id = ?`;
    await db.execute<ResultSetHeader>(q, [password_hash, id]);
  },
};
