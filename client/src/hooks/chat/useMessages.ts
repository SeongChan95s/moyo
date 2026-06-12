import { useEffect } from 'react';
import { create } from 'zustand';
import { subscribeMessages } from '../../services/chat/messagesService';
import type { MessagesCollection } from '../../types/chat';

interface MessagesStore {
	messages: Record<string, MessagesCollection[]>;
	setMessages: (roomId: string, msgs: MessagesCollection[]) => void;
	clearMessages: (roomId: string) => void;
}

const useMessagesStore = create<MessagesStore>(set => ({
	messages: {},
	setMessages: (roomId, msgs) =>
		set(state => ({ messages: { ...state.messages, [roomId]: msgs } })),
	clearMessages: (roomId) =>
		set(state => {
			const next = { ...state.messages };
			delete next[roomId];
			return { messages: next };
		})
}));

export const useMessages = (roomId: string): MessagesCollection[] => {
	const setMessages = useMessagesStore(state => state.setMessages);
	const clearMessages = useMessagesStore(state => state.clearMessages);

	useEffect(() => {
		const unsubscribe = subscribeMessages(roomId, msgs => {
			setMessages(roomId, msgs);
		});
		return () => {
			unsubscribe();
			clearMessages(roomId);
		};
	}, [roomId]);

	return useMessagesStore(state => state.messages[roomId] ?? []);
};
