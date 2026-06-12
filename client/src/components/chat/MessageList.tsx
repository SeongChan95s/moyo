import { useEffect, useRef } from 'react';
import type { MessagesCollection } from '../../types/chat';
import MessageBubble from './MessageBubble';
import styles from './MessageList.module.scss';

interface Props {
	messages: MessagesCollection[];
	currentUid: string | undefined;
}

export default function MessageList({ messages, currentUid }: Props) {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<div className={styles.list}>
			{messages.map(msg => (
				<MessageBubble key={msg.id} message={msg} isMe={msg.senderId === currentUid} />
			))}
			<div ref={bottomRef} />
		</div>
	);
}
