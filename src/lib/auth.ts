import { getSessionToken } from './cookies';
import { sessionsModel } from '@/models/sessions';
import { usersModel } from '@/models/users';

export async function getAuthenticatedUser() {
    const token = await getSessionToken();
    if (!token) return null;
    const session = await sessionsModel.findByToken(token);
    if (!session) return null;
    if (new Date(session.expires_at) < new Date()) return null;
    return usersModel.findById(session.user_id);
}
