import { TextField } from '../../../components/common/TextField';
import { Helmet } from 'react-helmet-async';
import {
	useForm,
	useWatch,
	type Control,
	type UseFormRegister,
	type UseFormSetError,
	type UseFormTrigger
} from 'react-hook-form';
import type { RegisterEmailCredentialInput } from '../../../types/auth';
import { registerJoinInputSchema } from '../../../schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGlobalToastStore } from '../../../components/global/Popup/GlobalToast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { registerAuth } from '../../../services/auth/register';
import { useLocalStorage } from '@/hooks/storage';
import { HTTPError } from '@/utils/HTTPError';
import { FirebaseError } from 'firebase/app';
import { ZodError } from 'zod';
import { Button } from '@/components/common/Button';
import { useEffect, useRef } from 'react';
import { handleFirebaseAuthErrorMessage } from '@/utils/auth';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Spinner } from '@/components/common/Spinner';
import { ProgressBar } from '@/components/common/ProgressBar';
import { fetchSignInMethodsForEmail, getAuth } from 'firebase/auth';
import { regEmail, regPassword } from '@/constants/regex';

interface STEPProps {
	register: UseFormRegister<RegisterEmailCredentialInput>;
	control: Control<RegisterEmailCredentialInput>;
	handleNext?: (fields: (keyof RegisterEmailCredentialInput)[]) => Promise<void>;
	setError?: UseFormSetError<RegisterEmailCredentialInput>;
	clearErrors?: (
		name?: keyof RegisterEmailCredentialInput | (keyof RegisterEmailCredentialInput)[]
	) => void;
	trigger?: UseFormTrigger<RegisterEmailCredentialInput>;
	isSubmitting: boolean;
	error?: (string | undefined)[];
}

function STEP01({
	register,
	control,
	handleNext,
	setError,
	clearErrors,
	error,
	isSubmitting
}: STEPProps) {
	const watchedEmail = useWatch({ control, name: 'email' });

	useEffect(() => {
		if (watchedEmail && error?.[0]) {
			clearErrors?.('email');
		}
	}, [watchedEmail, clearErrors]);

	const handleEmailValidate = async () => {
		try {
			const auth = getAuth();
			const signInMethods = await fetchSignInMethodsForEmail(auth, watchedEmail);
			if (signInMethods.length > 0) {
				setError?.('email', {
					message: '이미 가입된 이메일 입니다.'
				});
				return;
			}

			handleNext?.(['email']);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	return (
		<li>
			<TextField
				id="email"
				label="이메일"
				placeholder="이메일을 입력해 주세요."
				size="lg"
				error={error?.[0]}
				fill
				{...register('email', { required: true })}
			/>

			{regEmail.test(watchedEmail || '') && !error?.[0] && (
				<Button
					className="mt-56"
					size="lg"
					type="button"
					color="primary"
					fill
					onClick={() => handleEmailValidate()}>
					{isSubmitting ? <Spinner size="xs" /> : '다음'}
				</Button>
			)}
		</li>
	);
}

function STEP02({
	register,
	control,
	handleNext,
	setError,
	clearErrors,
	error,
	isSubmitting
}: STEPProps) {
	const watchedPassword = useWatch({ control, name: 'password' });
	const watchedPasswordConfirm = useWatch({ control, name: 'passwordConfirm' });

	useEffect(() => {
		if (watchedPassword && regPassword.test(watchedPassword)) {
			clearErrors?.('password');
		}
		if (
			watchedPassword &&
			watchedPasswordConfirm &&
			watchedPassword === watchedPasswordConfirm
		) {
			clearErrors?.('passwordConfirm');
		}
	}, [watchedPassword, watchedPasswordConfirm, clearErrors]);

	const handleClick = () => {
		if (!!watchedPassword && watchedPassword != watchedPasswordConfirm) {
			setError?.('passwordConfirm', {
				message: '비밀번호가 일치하지 않습니다.'
			});
			return;
		}

		handleNext?.(['password', 'passwordConfirm']);
	};

	const isValid =
		!!watchedPassword &&
		regPassword.test(watchedPassword || '') &&
		watchedPassword === watchedPasswordConfirm;

	return (
		<li>
			<TextField
				type="password"
				size="lg"
				label="비밀번호"
				placeholder="영문+숫자+특수문자, 8자 이상"
				fill
				error={error?.[0]}
				{...register('password', { required: true })}
			/>
			<TextField
				className="mt-18"
				type="password"
				size="lg"
				label="비밀번호 확인"
				placeholder="비밀번호와 동일하게 입력해 주세요."
				fill
				error={error?.[1]}
				{...register('passwordConfirm', { required: true })}
			/>
			<Button
				className="mt-56"
				type="button"
				size="lg"
				color="primary"
				fill
				disabled={!isValid}
				onClick={() => handleClick()}>
				{isSubmitting ? <Spinner size="xs" /> : '다음'}
			</Button>
		</li>
	);
}

function STEP03({ register, control, isSubmitting, error }: STEPProps) {
	const watchedDisplayName = useWatch({ control, name: 'displayName' });
	const isValid = !!watchedDisplayName && !error?.[0];

	return (
		<li>
			<TextField
				label="닉네임"
				size="lg"
				placeholder="한글, 영문, 숫자 , '_', '-', 2~10자"
				fill
				error={error?.[0]}
				{...register('displayName', { required: true })}
			/>
			<Button
				className="mt-56"
				type="submit"
				size="lg"
				color="primary"
				disabled={!isValid}
				fill>
				{isSubmitting ? <Spinner size="xs" /> : '회원가입'}
			</Button>
		</li>
	);
}

export default function JoinPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const callbackStorage = useLocalStorage('callbackURL');

	const {
		register,
		control,
		formState: { errors, isSubmitting },
		handleSubmit,
		trigger,
		getValues,
		setError,
		clearErrors
	} = useForm<RegisterEmailCredentialInput>({
		resolver: zodResolver(registerJoinInputSchema)
		// mode: 'onChange'
	});

	const step = parseInt(searchParams.get('step') ?? '1', 10);
	const nodeRef1 = useRef<HTMLUListElement>(null);
	const nodeRef2 = useRef<HTMLUListElement>(null);
	const nodeRef3 = useRef<HTMLUListElement>(null);
	const nodeRef = step === 1 ? nodeRef1 : step === 2 ? nodeRef2 : nodeRef3;

	useEffect(() => {
		if (step === 1) return;
		const values = getValues();
		if (step > 1 && !values.email) {
			navigate(`?step=1`, { replace: true });
			return;
		}
		if (step > 2 && (!values.password || !values.passwordConfirm)) {
			navigate(`?step=2`, { replace: true });
			return;
		}
	}, [step, navigate, getValues]);

	const handleNext = async (fields: (keyof RegisterEmailCredentialInput)[]) => {
		const result = await trigger(fields);
		if (result) {
			navigate(`?step=${step + 1}`);
		}
	};

	const onSubmit = async (data: RegisterEmailCredentialInput) => {
		try {
			await registerAuth(data);
			useGlobalToastStore.getState().push({
				message: '회원가입에 성공했습니다.'
			});
			navigate(callbackStorage.get() ?? '/', { replace: true });
		} catch (error) {
			if (error instanceof FirebaseError)
				return useGlobalToastStore.getState().push({
					message: handleFirebaseAuthErrorMessage(error)
				});

			if (error instanceof HTTPError || error instanceof ZodError)
				return useGlobalToastStore.getState().push({
					message: error.message
				});
			if (error instanceof Error) throw error;
		}
	};

	return (
		<>
			<Helmet>
				<title>가입정보 입력</title>
			</Helmet>
			<main className="register-join-page flex-1">
				<ProgressBar percent={step == 1 ? 0 : step == 2 ? 35 : 75} />
				<form name="registerJoin" onSubmit={handleSubmit(onSubmit)}>
					<div className="pt-25 inner">
						<SwitchTransition>
							<CSSTransition key={step} nodeRef={nodeRef} classNames="fade" timeout={300}>
								<ul ref={nodeRef}>
									{step === 1 && (
										<STEP01
											register={register}
											control={control}
											handleNext={handleNext}
											error={[errors.email?.message]}
											setError={setError}
											clearErrors={clearErrors}
											isSubmitting={isSubmitting}
										/>
									)}
									{step === 2 && (
										<STEP02
											register={register}
											control={control}
											handleNext={handleNext}
											error={[errors.password?.message, errors.passwordConfirm?.message]}
											setError={setError}
											clearErrors={clearErrors}
											isSubmitting={isSubmitting}
										/>
									)}
									{step === 3 && (
										<STEP03
											register={register}
											control={control}
											isSubmitting={isSubmitting}
											error={[errors.displayName?.message]}
										/>
									)}
								</ul>
							</CSSTransition>
						</SwitchTransition>
					</div>
				</form>
			</main>
		</>
	);
}
