import { useGlobalToastStore } from '@/components/global/Popup/GlobalToast';
import { handleFirebaseAuthErrorMessage } from '@/utils/auth';
import { FirebaseError } from 'firebase/app';
import {
	GoogleAuthProvider,
	TwitterAuthProvider,
	signInWithPopup,
	getAuth
} from 'firebase/auth';
import { setRegisteredUserDataToDB } from './register';

export const loginWithKakao = async (): Promise<void> => {
	location.replace(
		`https://kauth.kakao.com/oauth/authorize?client_id=${
			import.meta.env.VITE_KAKAO_REST_API_KEY
		}&redirect_uri=${
			import.meta.env.VITE_CLIENT_URL
		}/auth/oauth/kakao/callback&response_type=code`
	);
};

export const loginWithNaver = async (): Promise<void> => {
	location.replace(
		`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${
			import.meta.env.VITE_NAVER_CLIENT_ID
		}&redirect_uri=${import.meta.env.VITE_CLIENT_URL}/auth/oauth/naver/callback`
	);
};

export const loginWithGoogle = async () => {
	try {
		const provider = new GoogleAuthProvider();
		const auth = getAuth();

		const userCredential = await signInWithPopup(auth, provider);
		await setRegisteredUserDataToDB(userCredential.user, 'google');
	} catch (error) {
		if (error instanceof FirebaseError) {
			const message = handleFirebaseAuthErrorMessage(error);
			useGlobalToastStore.getState().push({
				message
			});

			const callbackURL = localStorage.getItem('callbackURL') ?? '/';
			location.replace(callbackURL);
		} else {
			console.error('구글 로그인 오류:', error);
			useGlobalToastStore.getState().push({
				message: `알수없는 이유로 구글 로그인에 실패했습니다.`
			});
		}
	}
};

export const loginWithTwitter = async () => {
	try {
		const provider = new TwitterAuthProvider();
		const auth = getAuth();

		const userCredential = await signInWithPopup(auth, provider);
		await setRegisteredUserDataToDB(userCredential.user, 'twitter');
	} catch (error) {
		if (error instanceof FirebaseError) {
			const message = handleFirebaseAuthErrorMessage(error);
			useGlobalToastStore.getState().push({
				message
			});

			const callbackURL = localStorage.getItem('callbackURL') ?? '/';
			location.replace(callbackURL);
		} else {
			console.error('트위터 로그인 오류:', error);
			useGlobalToastStore.getState().push({
				message: `알수없는 이유로 트위터 로그인에 실패했습니다.`
			});
		}
	}
};
