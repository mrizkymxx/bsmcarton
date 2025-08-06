
'use server';

import 'server-only';
import { cookies } from 'next/headers';

export async function deleteSession() {
  cookies().set('session', '', { expires: new Date(0) });
}
