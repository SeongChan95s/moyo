import {
	collection,
	collectionGroup,
	doc,
	getDoc,
	getDocs,
	increment,
	query,
	runTransaction,
	serverTimestamp,
	where,
	writeBatch
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import type { User } from 'firebase/auth';
import type { UsersCollection } from '../../types/auth';
import type {
	CreateRoomInput,
	RoomMembersCollection,
	RoomsCollection,
	UpdateRoomInput
} from '../../types/chat';

export const createRoom = async (
	input: CreateRoomInput,
	user: User,
	userData: UsersCollection
): Promise<string> => {
	const batch = writeBatch(db);
	const roomRef = doc(collection(db, 'rooms'));

	batch.set(roomRef, {
		title: input.title,
		creatorId: user.uid,
		managerIds: [user.uid],
		isPrivate: input.isPrivate,
		allowMemberInvite: input.allowMemberInvite,
		memberCount: 1,
		lastMessage: null,
		lastMessageAt: null,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp()
	});

	const memberRef = doc(db, 'rooms', roomRef.id, 'members', user.uid);
	batch.set(memberRef, {
		uid: user.uid,
		displayName: userData.displayName,
		photoURL: userData.photoURL ?? null,
		role: 'manager',
		joinedAt: serverTimestamp(),
		invitedBy: null
	});

	await batch.commit();
	return roomRef.id;
};

export const getMyRooms = async (uid: string): Promise<RoomsCollection[]> => {
	const membersQuery = query(collectionGroup(db, 'members'), where('uid', '==', uid));
	const membersSnap = await getDocs(membersQuery);

	if (membersSnap.empty) return [];

	const roomIds = membersSnap.docs.map(d => d.ref.parent.parent!.id);
	const rooms = await Promise.all(
		roomIds.map(async roomId => {
			const roomSnap = await getDoc(doc(db, 'rooms', roomId));
			if (!roomSnap.exists()) return null;
			return { id: roomSnap.id, ...roomSnap.data() } as RoomsCollection;
		})
	);

	return rooms.filter(Boolean) as RoomsCollection[];
};

export const getRoom = async (roomId: string): Promise<RoomsCollection | null> => {
	const roomSnap = await getDoc(doc(db, 'rooms', roomId));
	if (!roomSnap.exists()) return null;
	return { id: roomSnap.id, ...roomSnap.data() } as RoomsCollection;
};

export const joinRoom = async (
	roomId: string,
	user: User,
	userData: UsersCollection,
	invitedBy: string | null = null
): Promise<void> => {
	await runTransaction(db, async tx => {
		const memberRef = doc(db, 'rooms', roomId, 'members', user.uid);
		const memberSnap = await tx.get(memberRef);
		if (memberSnap.exists()) return;

		tx.set(memberRef, {
			uid: user.uid,
			displayName: userData.displayName,
			photoURL: userData.photoURL ?? null,
			role: 'member',
			joinedAt: serverTimestamp(),
			invitedBy
		});

		const roomRef = doc(db, 'rooms', roomId);
		tx.update(roomRef, { memberCount: increment(1), updatedAt: serverTimestamp() });
	});
};

export const leaveRoom = async (roomId: string, uid: string): Promise<void> => {
	await runTransaction(db, async tx => {
		const memberRef = doc(db, 'rooms', roomId, 'members', uid);
		tx.delete(memberRef);
		const roomRef = doc(db, 'rooms', roomId);
		tx.update(roomRef, { memberCount: increment(-1), updatedAt: serverTimestamp() });
	});
};

export const kickMember = leaveRoom;

export const updateRoomSettings = async (
	roomId: string,
	data: UpdateRoomInput
): Promise<void> => {
	const roomRef = doc(db, 'rooms', roomId);
	await import('firebase/firestore').then(({ updateDoc }) =>
		updateDoc(roomRef, { ...data, updatedAt: serverTimestamp() })
	);
};

export const deleteRoom = async (roomId: string): Promise<void> => {
	const roomRef = doc(db, 'rooms', roomId);
	await import('firebase/firestore').then(({ deleteDoc }) => deleteDoc(roomRef));
};

export const getRoomMembers = async (roomId: string): Promise<RoomMembersCollection[]> => {
	const membersSnap = await getDocs(collection(db, 'rooms', roomId, 'members'));
	return membersSnap.docs.map(d => d.data() as RoomMembersCollection);
};
