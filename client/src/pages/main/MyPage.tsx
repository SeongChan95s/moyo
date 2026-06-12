import { Helmet } from 'react-helmet-async';
import { Button } from '../../components/common/Button';
import { getAuth, signOut } from 'firebase/auth';
import { useUserState } from '../../hooks/auth/useUserStateChanged';
import { useLogin } from '@/hooks/auth/useLogin';
import { IconPersonFilled } from '@/components/common/Icon';

export default function MyPage() {
	const login = useLogin();

	const user = useUserState(state => state.user);
	const data = useUserState(state => state.data);

	const logout = async () => {
		const auth = getAuth();
		await signOut(auth);
	};

	return (
		<>
			<Helmet>
				<title>Talk - 마이</title>
			</Helmet>
			<div className="my-page">
				<main className="my-page-main">
					<h2 className="hidden">마이 페이지</h2>
					<header className="my-page-header bg-gray-200">
						<div className="profile flex inner gap-8">
							<div className="thumbnail w-50 h-50 p-4">
								<div className="thumbnail-container w-full h-full rounded-full bg-gray-400">
									{user?.photoURL ? (
										<img src={user.photoURL} alt="" />
									) : (
										<div className="empty flex justify-center items-center w-full h-full">
											<IconPersonFilled className="text-gray-200" />
										</div>
									)}
								</div>
							</div>

							{user && data && (
								<p>
									{user.displayName} #{data.tag} 님 로그인을 환영합니다.
								</p>
							)}
						</div>
					</header>

					{user ? (
						<Button onClick={logout}>로그아웃</Button>
					) : (
						<Button onClick={login}>로그인</Button>
					)}
				</main>
			</div>
		</>
	);
}
