import { Button } from '@/components/common/Button';
import { IconEmailCircle } from '@/components/common/Icon';
import { Spinner } from '@/components/common/Spinner';
import { TextField } from '@/components/common/TextField';
import { useGlobalToastStore } from '@/components/global/Popup/GlobalToast';
import { handleFirebaseAuthErrorMessage } from '@/utils/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import z from 'zod';

export default function FindPasswordPage() {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { isValid, isSubmitting, isSubmitSuccessful }
	} = useForm<{ email: string }>({
		resolver: zodResolver(
			z.object({
				email: z.email('이메일 형식이 아닙니다.')
			})
		)
	});

	const onSubmit = async ({ email }: { email: string }) => {
		if (!isSubmitSuccessful) {
			try {
				const auth = getAuth();
				await sendPasswordResetEmail(auth, email);
				useGlobalToastStore
					.getState()
					.push({ message: '비밀번호 초기화 이메일이 발송되었습니다.' });
			} catch (error) {
				if (error instanceof FirebaseError) {
					useGlobalToastStore
						.getState()
						.push({ message: handleFirebaseAuthErrorMessage(error) });
				} else if (error instanceof Error) {
					useGlobalToastStore
						.getState()
						.push({ message: '알수없는 에러가 발생했습니다.' });
					throw Error;
				}
			}
		} else {
			navigate('/auth/login/email', { replace: true });
		}
	};

	return (
		<>
			<Helmet>
				<title>비밀번호 찾기</title>
			</Helmet>
			<main>
				<div className="flex items-center gap-8 h-48 inner bg-gray-50">
					<IconEmailCircle />
					<span className="text-[12px] text-gray-700">
						가입 시 등록한 이메일 주소를 입력해 주세요.
					</span>
				</div>
				<div className="inner mt-25">
					<form name="findPassword" onSubmit={handleSubmit(onSubmit)}>
						<TextField
							label="이메일"
							placeholder="이메일을 입력해 주세요."
							size="lg"
							fill
							{...register('email', { required: true })}
						/>
						<Button
							className="mt-56"
							type="submit"
							color="primary"
							fill
							disabled={!isValid}>
							{isSubmitting ? (
								<Spinner size="xs" />
							) : isSubmitSuccessful ? (
								'로그인 화면으로'
							) : (
								'이메일 보내기'
							)}
						</Button>
					</form>
				</div>
			</main>
		</>
	);
}
