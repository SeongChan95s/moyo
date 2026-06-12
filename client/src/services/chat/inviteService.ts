import {
	addDoc,
	collection,
	getDocs,
	increment,
	query,
	runTransaction,
	serverTimestamp,
	Timestamp,
	where
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import type { User } from 'firebase/auth';
import type { InviteLinksCollection } from '../../types/chat';
import type { UsersCollection } from '../../types/auth';
import { joinRoom } from './roomsService';

const generateToken = (): string => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	return Array.from({ length: 21 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export const createInviteLink = async (
	roomId: string,
	uid: string,
	expiresInHours = 24
): Promise<string> => {
	const token = generateToken();
	const expiresAt = Timestamp.fromDate(
		new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
	);

	await addDoc(collection(db, 'inviteLinks'), {
		roomId,
		createdBy: uid,
		token,
		expiresAt,
		maxUses: null,
		useCount: 0,
		isDisabled: false,
		createdAt: serverTimestamp()
	});

	return token;
};

export const getInviteByToken = async (
	token: string
): Promise<InviteLinksCollection | null> => {
	const q = query(collection(db, 'inviteLinks'), where('token', '==', token));
	const snap = await getDocs(q);
	if (snap.empty) return null;
	const d = snap.docs[0];
	return { id: d.id, ...d.data() } as InviteLinksCollection;
};

export const acceptInvite = async (
	token: string,
	user: User,
	userData: UsersCollection
): Promise<string> => {
	const invite = await getInviteByToken(token);
	if (!invite) throw new Error('초대 링크를 찾을 수 없습니다.');
	if (invite.isDisabled) throw new Error('비활성화된 초대 링크입니다.');
	if (invite.expiresAt.toDate() < new Date()) throw new Error('만료된 초대 링크입니다.');
	if (invite.maxUses !== null && invite.useCount >= invite.maxUses)
		throw new Error('사용 횟수가 초과된 초대 링크입니다.');

	await joinRoom(invite.roomId, user, userData, invite.createdBy);

	await runTransaction(db, async tx => {
		const { doc } = await import('firebase/firestore');
		const inviteRef = doc(db, 'inviteLinks', invite.id);
		tx.update(inviteRef, { useCount: increment(1) });
	});

	return invite.roomId;
};
