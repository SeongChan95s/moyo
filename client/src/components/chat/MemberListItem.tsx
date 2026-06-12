import type { RoomMembersCollection } from '../../types/chat';
import styles from './MemberListItem.module.scss';

interface Props {
	member: RoomMembersCollection;
	currentUid: string;
	isManager: boolean;
	onKick?: (uid: string) => void;
}

export default function MemberListItem({ member, currentUid, isManager, onKick }: Props) {
	const isMe = member.uid === currentUid;

	return (
		<div className={styles.item}>
			<div className={styles.avatar}>
				{member.photoURL ? (
					<img src={member.photoURL} alt="" />
				) : (
					<span>{member.displayName[0]}</span>
				)}
			</div>
			<div className={styles.info}>
				<span className={styles.name}>
					{member.displayName}
					{isMe && <span className={styles.meTag}> (나)</span>}
				</span>
				{member.role === 'manager' && <span className={styles.managerTag}>매니저</span>}
			</div>
			{isManager && !isMe && (
				<button className={styles.kickButton} onClick={() => onKick?.(member.uid)}>
					추방
				</button>
			)}
		</div>
	);
}
