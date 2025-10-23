// src/models/emailOtpsModel.ts
import { db } from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

// Shape of a row in the `email_verification_otps` table
export type EmailOtpRow = {
  id: number;
  user_id: number;
  otp_hash: string;
  expires_at: Date;
  attempt_count: number;
  max_attempts: number;
  created_at: Date;
};

export const emailOtpsModel = {
  async upsert(
    user_id: number,
    otp_hash: string,
    expires_at: Date
  ): Promise<EmailOtpRow> {
    // Delete any existing OTP for this user
    await db.execute<ResultSetHeader>(
      `DELETE FROM email_verification_otps WHERE user_id = ?`,
      [user_id]
    );

    // Insert new OTP
    const insertQuery = `
      INSERT INTO email_verification_otps (user_id, otp_hash, expires_at)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute<ResultSetHeader>(insertQuery, [
      user_id,
      otp_hash,
      expires_at,
    ]);

    const insertedId = result.insertId;

    // Fetch the inserted row
    const [rows] = await db.execute<(EmailOtpRow & RowDataPacket)[]>(
      `SELECT id, user_id, otp_hash, expires_at, attempt_count, max_attempts, created_at
       FROM email_verification_otps
       WHERE id = ? LIMIT 1`,
      [insertedId]
    );

    return rows[0];
  },

  async findByUserId(user_id: number): Promise<EmailOtpRow | null> {
    const [rows] = await db.execute<(EmailOtpRow & RowDataPacket)[]>(
      `SELECT * FROM email_verification_otps
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [user_id]
    );
    return rows[0] || null;
  },

  async incrementAttempt(id: number): Promise<void> {
    await db.execute<ResultSetHeader>(
      `UPDATE email_verification_otps
       SET attempt_count = attempt_count + 1
       WHERE id = ?`,
      [id]
    );
  },

  async deleteByUserId(user_id: number): Promise<void> {
    await db.execute<ResultSetHeader>(
      `DELETE FROM email_verification_otps WHERE user_id = ?`,
      [user_id]
    );
  },
};
