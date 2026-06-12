import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { getInviteByToken, acceptInvite } from '../../services/chat/inviteService';
import { getRoom } from '../../services/chat/roomsService';
import { useUserState } from '../../hooks/auth/useUserStateChanged';
import type { RoomsCollection } from '../../types/chat';
import styles from './InvitePage.module.scss';

export default function InvitePage() {
	const { token } = useParams<{ token: string }>();
	const navigate = useNavigate();
	const user = useUserState(state => state.user);
	const userData = useUserState(state => state.data);

	const [room, setRoom] = useState<RoomsCollection | null>(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [joining, setJoining] = useState(false);

	useEffect(() => {
		if (!token) return;
		(async () => {
			try {
				const inv = await getInviteByToken(token);
				if (!inv) { setError('유효하지 않은 초대 링크입니다.'); return; }
				if (inv.isDisabled) { setError('비활성화된 초대 링크입니다.'); return; }
				if (inv.expiresAt.toDate() < new Date()) { setError('만료된 초대 링크입니다.'); return; }
				if (inv.maxUses !== null && inv.useCount >= inv.maxUses) {
					setError('사용 횟수가 초과된 초대 링크입니다.'); return;
				}
				const r = await getRoom(inv.roomId);
				setRoom(r);
			} catch {
				setError('초대 링크를 확인하는 중 오류가 발생했습니다.');
			} finally {
				setLoading(false);
			}
		})();
	}, [token]);

	const handleJoin = async () => {
		if (!token || !user || !userData) return;
		setJoining(true);
		try {
			const roomId = await acceptInvite(token, user, userData);
			navigate(`/chat/${roomId}`, { replace: true });
		} catch (e) {
			setError(e instanceof Error ? e.message : '참여에 실패했습니다.');
			setJoining(false);
		}
	};

	return (
		<>
			<Helmet>
				<title>Talk - 채팅방 초대</title>
			</Helmet>
			<div className={styles.page}>
				{loading ? (
					<p>초대 링크 확인 중...</p>
				) : error ? (
					<div className={styles.error}>
						<p>{error}</p>
						<Button variant="outlined" onClick={() => navigate('/chat')}>
							홈으로
						</Button>
					</div>
				) : room ? (
					<div className={styles.card}>
						<h2 className={styles.roomTitle}>{room.title}</h2>
						<p className={styles.desc}>{room.memberCount}명 참여 중</p>
						<Button onClick={handleJoin} disabled={joining}>
							{joining ? '참여 중...' : '채팅방 입장'}
						</Button>
					</div>
				) : null}
			</div>
		</>
	);
}
