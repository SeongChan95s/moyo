import type { MessagesCollection } from '../../types/chat';
import styles from './MessageBubble.module.scss';

interface Props {
	message: MessagesCollection;
	isMe: boolean;
}

export default function MessageBubble({ message, isMe }: Props) {
	if (message.type === 'system') {
		return <div className={styles.system}>{message.content}</div>;
	}

	return (
		<div className={`${styles.bubble} ${isMe ? styles.me : styles.other}`}>
			{!isMe && <span className={styles.senderName}>{message.senderName}</span>}
			<div className={styles.content}>{message.content}</div>
		</div>
	);
}
