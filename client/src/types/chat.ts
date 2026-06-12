import type { Timestamp } from 'firebase/firestore';

export interface RoomsCollection {
	id: string;
	title: string;
	creatorId: string;
	managerIds: string[];
	isPrivate: boolean;
	allowMemberInvite: boolean;
	memberCount: number;
	lastMessage: string | null;
	lastMessageAt: Timestamp | null;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

export type CreateRoomInput = Pick<RoomsCollection, 'title' | 'isPrivate' | 'allowMemberInvite'>;
export type UpdateRoomInput = Partial<Pick<RoomsCollection, 'title' | 'isPrivate' | 'allowMemberInvite'>>;

// rooms/{roomId}/members (문서 ID = uid)
export interface RoomMembersCollection {
	uid: string;
	displayName: string;
	photoURL: string | null;
	role: 'manager' | 'member';
	joinedAt: Timestamp;
	invitedBy: string | null;
}

// rooms/{roomId}/messages
export interface MessagesCollection {
	id: string;
	senderId: string;
	senderName: string;
	senderPhotoURL: string | null;
	content: string;
	type: 'text' | 'system';
	createdAt: Timestamp;
}

export type SendMessageInput = Pick<MessagesCollection, 'content' | 'type'>;

// rooms/{roomId}/readStatus (문서 ID = uid)
export interface ReadStatusCollection {
	lastReadAt: Timestamp;
}

// inviteLinks 컬렉션
export interface InviteLinksCollection {
	id: string;
	roomId: string;
	createdBy: string;
	token: string;
	expiresAt: Timestamp;
	maxUses: number | null;
	useCount: number;
	isDisabled: boolean;
	createdAt: Timestamp;
}
