import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import MessageList from '../../components/chat/MessageList';
import MessageInput from '../../components/chat/MessageInput';
import { useMessages } from '../../hooks/chat/useMessages';
import { useRoom } from '../../hooks/chat/useRooms';
import { useUserState } from '../../hooks/auth/useUserStateChanged';
import { sendMessage, updateReadStatus } from '../../services/chat/messagesService';
import styles from './ChatRoomPage.module.scss';

export default function ChatRoomPage() {
	const { roomId } = useParams<{ roomId: string }>();
	const navigate = useNavigate();
	const { data: room } = useRoom(roomId!);
	const messages = useMessages(roomId!);
	const user = useUserState(state => state.user);

	useEffect(() => {
		if (!roomId || !user) return;
		updateReadStatus(roomId, user.uid);
		return () => {
			updateReadStatus(roomId, user.uid);
		};
	}, [roomId, user?.uid]);

	const handleSend = async (content: string) => {
		if (!roomId || !user) return;
		await sendMessage(roomId, { content, type: 'text' }, user);
	};

	const isManager = room?.managerIds.includes(user?.uid ?? '');

	return (
		<>
			<Helmet>
				<title>Talk : {room?.title ?? '채팅방'}</title>
			</Helmet>
			<div className={styles.page}>
				{isManager && (
					<button
						className={styles.settingsButton}
						onClick={() => navigate(`/chat/${roomId}/settings`)}
					>
						설정
					</button>
				)}
				<MessageList messages={messages} currentUid={user?.uid} />
				<MessageInput onSend={handleSend} disabled={!user} />
			</div>
		</>
	);
}
