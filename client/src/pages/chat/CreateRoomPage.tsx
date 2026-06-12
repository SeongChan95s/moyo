import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { createRoom } from '../../services/chat/roomsService';
import { useUserState } from '../../hooks/auth/useUserStateChanged';
import type { CreateRoomInput } from '../../types/chat';
import styles from './CreateRoomPage.module.scss';

export default function CreateRoomPage() {
	const navigate = useNavigate();
	const user = useUserState(state => state.user);
	const userData = useUserState(state => state.data);
	const {
		register,
		handleSubmit,
		getValues,
		formState: { isSubmitting }
	} = useForm<CreateRoomInput>({
		defaultValues: { title: '', isPrivate: false, allowMemberInvite: true }
	});

	const onSubmit = async (data: CreateRoomInput) => {
		if (!user || !userData) return;
		const roomId = await createRoom(data, user, userData);
		navigate(`/chat/${roomId}`, { replace: true });
	};

	return (
		<>
			<Helmet>
				<title>Talk - 채팅방 만들기</title>
			</Helmet>
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.field}>
					<label className={styles.label}>채팅방 이름</label>
					<input
						className={styles.input}
						{...register('title', { required: true })}
						placeholder="채팅방 이름을 입력하세요(20자 이내)"
						maxLength={20}
					/>
				</div>

				<div className={styles.field}>
					<label className={styles.checkboxLabel}>
						<input type="checkbox" {...register('isPrivate')} />
						비공개 채팅방
					</label>
					<p className={styles.hint}>
						비공개 채팅방은 초대받은 사람만 참여할 수 있습니다.
					</p>
				</div>

				<div className={styles.field}>
					<label className={styles.checkboxLabel}>
						<input type="checkbox" {...register('allowMemberInvite')} />
						멤버도 초대 가능
					</label>
					<p className={styles.hint}>
						체크 해제 시 매니저만 새 멤버를 초대할 수 있습니다.
					</p>
				</div>

				<Button type="submit" disabled={isSubmitting} className={styles.submitButton}>
					{isSubmitting ? '생성 중...' : '채팅방 만들기'}
				</Button>
			</form>
		</>
	);
}
