import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import RoomListItem from '../../components/chat/RoomListItem';
import { useMyRooms } from '../../hooks/chat/useRooms';
import styles from './ChatListPage.module.scss';

export default function ChatListPage() {
	const navigate = useNavigate();
	const { data: rooms, isLoading } = useMyRooms();

	return (
		<>
			<Helmet>
				<title>Talk - 채팅</title>
			</Helmet>
			<main className={styles.page}>
				<div className={styles.header}>
					<Button size="sm" onClick={() => navigate('/chat/create')}>
						+ 새 채팅방
					</Button>
				</div>
				{isLoading ? (
					<div className={styles.empty}>불러오는 중...</div>
				) : !rooms?.length ? (
					<div className={styles.empty}>
						<p>참여 중인 채팅방이 없습니다.</p>
						<p>새 채팅방을 만들어보세요!</p>
					</div>
				) : (
					<ul className={styles.list}>
						{rooms.map(room => (
							<li key={room.id}>
								<RoomListItem room={room} />
							</li>
						))}
					</ul>
				)}
			</main>
		</>
	);
}
