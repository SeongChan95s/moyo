import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/common/Button';
import MemberListItem from '../../components/chat/MemberListItem';
import { useRoom } from '../../hooks/chat/useRooms';
import { useRoomMembers } from '../../hooks/chat/useRoomMembers';
import { useCreateInviteLink } from '../../hooks/chat/useInvite';
import { useUserState } from '../../hooks/auth/useUserStateChanged';
import { kickMember, updateRoomSettings, deleteRoom } from '../../services/chat/roomsService';
import styles from './RoomSettingsPage.module.scss';

export default function RoomSettingsPage() {
	const { roomId } = useParams<{ roomId: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const user = useUserState(state => state.user);

	const { data: room } = useRoom(roomId!);
	const { data: members } = useRoomMembers(roomId!);
	const createLink = useCreateInviteLink(roomId!);

	const [tab, setTab] = useState<'settings' | 'members' | 'invite'>('settings');
	const [title, setTitle] = useState('');
	const [isPrivate, setIsPrivate] = useState(false);
	const [allowMemberInvite, setAllowMemberInvite] = useState(true);
	const [inviteUrl, setInviteUrl] = useState('');

	const isManager = room?.managerIds.includes(user?.uid ?? '');

	useEffect(() => {
		if (!isManager && room) navigate(-1);
	}, [isManager, room]);

	useEffect(() => {
		if (room) {
			setTitle(room.title);
			setIsPrivate(room.isPrivate);
			setAllowMemberInvite(room.allowMemberInvite);
		}
	}, [room]);

	const handleSaveSettings = async () => {
		if (!roomId) return;
		await updateRoomSettings(roomId, { title, isPrivate, allowMemberInvite });
		queryClient.invalidateQueries({ queryKey: ['rooms', roomId] });
	};

	const handleKick = async (uid: string) => {
		if (!roomId) return;
		await kickMember(roomId, uid);
		queryClient.invalidateQueries({ queryKey: ['rooms', roomId, 'members'] });
	};

	const handleDeleteRoom = async () => {
		if (!roomId || !confirm('채팅방을 삭제하시겠습니까?')) return;
		await deleteRoom(roomId);
		navigate('/chat', { replace: true });
	};

	const handleCreateInvite = async () => {
		const token = await createLink.mutateAsync(24);
		setInviteUrl(`${window.location.origin}/invite/${token}`);
	};

	const handleCopyInvite = () => {
		navigator.clipboard.writeText(inviteUrl);
	};

	return (
		<>
			<Helmet>
				<title>Talk : 채팅방 설정</title>
			</Helmet>
			<div className={styles.page}>
				<div className={styles.tabs}>
					{(['settings', 'members', 'invite'] as const).map(t => (
						<button
							key={t}
							className={`${styles.tab} ${tab === t ? styles.active : ''}`}
							onClick={() => setTab(t)}
						>
							{t === 'settings' ? '설정' : t === 'members' ? '멤버' : '초대'}
						</button>
					))}
				</div>

				{tab === 'settings' && (
					<div className={styles.section}>
						<div className={styles.field}>
							<label className={styles.label}>채팅방 이름</label>
							<input
								className={styles.input}
								value={title}
								onChange={e => setTitle(e.target.value)}
							/>
						</div>
						<label className={styles.checkboxLabel}>
							<input
								type="checkbox"
								checked={isPrivate}
								onChange={e => setIsPrivate(e.target.checked)}
							/>
							비공개 채팅방
						</label>
						<label className={styles.checkboxLabel}>
							<input
								type="checkbox"
								checked={allowMemberInvite}
								onChange={e => setAllowMemberInvite(e.target.checked)}
							/>
							멤버도 초대 가능
						</label>
						<Button onClick={handleSaveSettings}>저장</Button>
						<Button variant="outlined" onClick={handleDeleteRoom} className={styles.deleteButton}>
							채팅방 삭제
						</Button>
					</div>
				)}

				{tab === 'members' && (
					<ul className={styles.memberList}>
						{members?.map(m => (
							<li key={m.uid}>
								<MemberListItem
									member={m}
									currentUid={user?.uid ?? ''}
									isManager={!!isManager}
									onKick={handleKick}
								/>
							</li>
						))}
					</ul>
				)}

				{tab === 'invite' && (
					<div className={styles.section}>
						<Button onClick={handleCreateInvite} disabled={createLink.isPending}>
							{createLink.isPending ? '생성 중...' : '초대 링크 생성 (24시간)'}
						</Button>
						{inviteUrl && (
							<div className={styles.inviteBox}>
								<span className={styles.inviteUrl}>{inviteUrl}</span>
								<button className={styles.copyButton} onClick={handleCopyInvite}>
									복사
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
}
