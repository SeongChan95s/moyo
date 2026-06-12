import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalStorage } from '@/hooks/storage';
import { Button } from '@/components/common/Button';
import type { LoginInput } from '@/types/auth';
import { useGlobalToastStore } from '@/components/global/Popup/GlobalToast';
import { TextField } from '@/components/common/TextField';
import { loginInputSchema } from '@/schemas/auth';
import { loginWithEmail } from '@/services/auth/loginWithEmail';
import { FirebaseError } from 'firebase/app';
import { Spinner } from '@/components/common/Spinner';

export default function EmailLoginPage() {
	const navigate = useNavigate();
	const callbackStorage = useLocalStorage<string>('callbackURL');

	const {
		register,
		formState: { isSubmitting, isValid },
		handleSubmit
	} = useForm<LoginInput>({
		resolver: zodResolver(loginInputSchema)
	});

	const onSubmit = async (data: LoginInput) => {
		try {
			await loginWithEmail(data.email, data.password);
			useGlobalToastStore.getState().push({
				message: '로그인에 성공했습니다.'
			});

			navigate(callbackStorage.get() ?? '/');
		} catch (error) {
			if (error instanceof FirebaseError) {
				useGlobalToastStore.getState().push({
					message: '이메일 혹은 비밀번호가 일치하지 않습니다.'
				});
			}
			if (error instanceof Error) throw error;
		}
	};

	return (
		<>
			<Helmet>
				<title>이메일 로그인</title>
			</Helmet>
			<main className="login-page mt-20 inner">
				<form onSubmit={handleSubmit(onSubmit)}>
					<ul>
						<li>
							<TextField
								label="이메일"
								placeholder="이메일을 입력해 주세요."
								size="lg"
								{...register('email')}
								fill
							/>
						</li>
						<li className="mt-32">
							<TextField
								type="password"
								label="비밀번호"
								placeholder="8자 이상의 비밀번호"
								size="lg"
								{...register('password')}
								fill
							/>
						</li>
					</ul>

					<div className="button-wrap mt-56">
						<Button size="lg" type="submit" color="primary" fill disabled={!isValid}>
							{isSubmitting ? <Spinner size="xs" /> : '로그인'}
						</Button>
						<Link
							to="/auth/find/password"
							className="block w-fit mt-25 mr-auto ml-auto text-[12px] text-gray-700">
							비밀번호 찾기
						</Link>
					</div>
				</form>
			</main>
		</>
	);
}
