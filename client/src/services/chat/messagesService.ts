import {
	collection,
	doc,
	limit,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	writeBatch
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import type { User } from 'firebase/auth';
import type { MessagesCollection, SendMessageInput } from '../../types/chat';

export const sendMessage = async (
	roomId: string,
	input: SendMessageInput,
	user: User
): Promise<void> => {
	const batch = writeBatch(db);

	const msgRef = doc(collection(db, 'rooms', roomId, 'messages'));
	batch.set(msgRef, {
		senderId: user.uid,
		senderName: user.displayName ?? '',
		senderPhotoURL: user.photoURL ?? null,
		content: input.content,
		type: input.type,
		createdAt: serverTimestamp()
	});

	const roomRef = doc(db, 'rooms', roomId);
	batch.update(roomRef, {
		lastMessage: input.content,
		lastMessageAt: serverTimestamp(),
		updatedAt: serverTimestamp()
	});

	await batch.commit();
};

export const subscribeMessages = (
	roomId: string,
	callback: (messages: MessagesCollection[]) => void,
	limitCount = 50
): (() => void) => {
	const q = query(
		collection(db, 'rooms', roomId, 'messages'),
		orderBy('createdAt', 'asc'),
		limit(limitCount)
	);

	return onSnapshot(q, snapshot => {
		const messages = snapshot.docs.map(d => ({
			id: d.id,
			...d.data()
		})) as MessagesCollection[];
		callback(messages);
	});
};

export const updateReadStatus = async (roomId: string, uid: string): Promise<void> => {
	const readRef = doc(db, 'rooms', roomId, 'readStatus', uid);
	await setDoc(readRef, { lastReadAt: serverTimestamp() }, { merge: true });
};
