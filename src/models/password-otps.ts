// src/models/passwordOtpsModel.ts
import { db } from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

// Shape of a row in the `password_reset_otps` table
export type PasswordOtpRow = {
  id: number;
  user_id: number;
  otp_hash: string;
  expires_at: Date;
  attempt_count: number;
  max_attempts: number;
  created_at: Date;
};

export const passwordOtpsModel = {
  async upsert(
    user_id: number,
    otp_hash: string,
    expires_at: Date
  ): Promise<PasswordOtpRow> {
    // Delete any existing OTP for this user
    await db.execute<ResultSetHeader>(
      `DELETE FROM password_reset_otps WHERE user_id = ?`,
      [user_id]
    );

    // Insert new OTP
    const insertQuery = `
      INSERT INTO password_reset_otps (user_id, otp_hash, expires_at)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute<ResultSetHeader>(insertQuery, [
      user_id,
      otp_hash,
      expires_at,
    ]);

    const insertedId = result.insertId;

    // Fetch the inserted row
    const [rows] = await db.execute<(PasswordOtpRow & RowDataPacket)[]>(
      `SELECT id, user_id, otp_hash, expires_at, attempt_count, max_attempts, created_at
       FROM password_reset_otps
       WHERE id = ? LIMIT 1`,
      [insertedId]
    );

    return rows[0];
  },

  async findByUserId(user_id: number): Promise<PasswordOtpRow | null> {
    const [rows] = await db.execute<(PasswordOtpRow & RowDataPacket)[]>(
      `SELECT * FROM password_reset_otps
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [user_id]
    );
    return rows[0] || null;
  },

  async incrementAttempt(id: number): Promise<void> {
    await db.execute<ResultSetHeader>(
      `UPDATE password_reset_otps
       SET attempt_count = attempt_count + 1
       WHERE id = ?`,
      [id]
    );
  },

  async deleteByUserId(user_id: number): Promise<void> {
    await db.execute<ResultSetHeader>(
      `DELETE FROM password_reset_otps WHERE user_id = ?`,
      [user_id]
    );
  },
};
