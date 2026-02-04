import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
	loginWithKakao,
	loginWithNaver,
	loginWithGoogle,
	loginWithTwitter
} from '@/services/auth/oauth';
import { Button } from '@/components/common/Button';
import IconKakao from '@/components/common/Icon/IconKakao';
import IconNaver from '@/components/common/Icon/IconNaver';
import { IconButton } from '@/components/common/IconButton';
import IconGoogle from '@/components/common/Icon/IconGoogle';
import { IconTwitter } from '@/components/common/Icon';
import { TextButton } from '@/components/common/TextButton';
import { Divider } from '@/components/common/Divider';

export default function LoginPage() {
	const navigate = useNavigate();

	return (
		<>
			<Helmet>
				<title>로그인</title>
			</Helmet>
			<main className="login-page flex-1 flex justify-center items-center">
				<div className="login-container w-full pr-25 pl-25">
					<div className="logo w-120 mr-auto ml-auto">
						<img src="https://firebasestorage.googleapis.com/v0/b/party-scheduler-90227.firebasestorage.app/o/common%2Flogo.svg?alt=media&token=86e5a1ba-da28-4f51-94cb-838c76356dc7" />
					</div>

					<div className="main-container mt-80">
						<Button
							className="relative h-44 gap-5 border-[#FAE300] rounded-md text-[15px] font-semibold text-gray-900 bg-[#FAE300]"
							onClick={async () => await loginWithKakao()}
							fill>
							<span className="absolute top-0 transform-[translateY(-50%)] h-auto pt-2 pr-8 pb-2 pl-8 text-[11px] font-medium text-white rounded-full leading-15 bg-[#EC4242]">
								3초 만에 간편가입!
							</span>
							<IconKakao />
							카카오톡으로 계속하기
						</Button>
						<Button
							className="h-44 gap-5 border-[#1EC800] rounded-md mt-12 text-[15px] font-semibold text-white bg-[#1EC800]"
							size="lg"
							onClick={async () => await loginWithNaver()}
							fill>
							<IconNaver className="stroke-white" />
							네이버로 계속하기
						</Button>
					</div>

					<div className="flex justify-center items-center gap-12 pr-56 pl-56 mt-25">
						<Divider className="flex-1 h-0.5 bg-gray-300" />
						<span className="text-[12px] text-gray-400">또는</span>
						<Divider className="flex-1 h-0.5 bg-gray-300" />
					</div>

					<div className="icon-button-wrap flex justify-center gap-14 mt-14">
						<IconButton
							className="w-46 h-46 pt-9 pr-9 pb-9 pl-9 border-gray-100 border rounded-full"
							icon={<IconGoogle />}
							onClick={async () => await loginWithGoogle()}
						/>
						<IconButton
							className="w-46 h-46 pt-9 pr-9 pb-9 pl-9 border-gray-100 border rounded-full"
							icon={<IconTwitter />}
							onClick={async () => await loginWithTwitter()}></IconButton>
					</div>

					<div className="text-button-wrap flex justify-center items-center gap-11 mt-36">
						<TextButton
							className="text-[12px] text-gray-700"
							onClick={() => navigate('email')}
							fill>
							이메일 로그인
						</TextButton>
						<Divider className="w-0.5 h-10" />
						<TextButton
							className="text-[12px] text-gray-700"
							onClick={() => navigate('/auth/register/agree')}
							fill>
							이메일로 회원가입
						</TextButton>
					</div>

					<div className="flex justify-center gap-4 mt-45 text-gray-500">
						<p className="text-[14px]">로그인에 어려움이 있나요?</p>
						<TextButton className="pt-2 pr-8 pb-2 pl-8 border-[0.5px] border-gray-300 rounded-full text-[11px] leading-1">
							<IconKakao className="w-15 h-15 fill-gray-500" />
							문의하기
						</TextButton>
					</div>
				</div>
			</main>
		</>
	);
}
