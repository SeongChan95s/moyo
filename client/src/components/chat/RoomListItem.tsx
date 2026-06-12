import { Link } from 'react-router-dom';
import type { RoomsCollection } from '../../types/chat';
import styles from './RoomListItem.module.scss';

interface Props {
	room: RoomsCollection;
	hasUnread?: boolean;
}

export default function RoomListItem({ room, hasUnread }: Props) {
	return (
		<Link className={styles.item} to={`/chat/${room.id}`}>
			<div className={styles.info}>
				<div className={styles.titleRow}>
					<span className={styles.title}>{room.title}</span>
					<span className={styles.memberCount}>{room.memberCount}명</span>
				</div>
				{room.lastMessage && (
					<span className={styles.preview}>{room.lastMessage}</span>
				)}
			</div>
			{hasUnread && <span className={styles.unreadDot} />}
		</Link>
	);
}
