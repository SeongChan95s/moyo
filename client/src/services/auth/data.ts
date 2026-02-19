import { db } from '@/lib/firebase/config';
import type { UsersCollection } from '@/types/auth';
import { HTTPError } from '@/utils/HTTPError';
import { doc, getDoc } from 'firebase/firestore';

export const getUserDataByUid = async (uid: string): Promise<UsersCollection> => {
	const snapshot = await getDoc(doc(db, 'users', uid));

	if (snapshot.exists()) {
		const result: UsersCollection = {
			uid: snapshot.id,
			...(snapshot.data() as Omit<UsersCollection, 'uid'>)
		};
		return result;
	} else {
		throw new HTTPError('사용자 uid와 동일한 계정이 존재하지 않습니다.', 400);
	}
};
