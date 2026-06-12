import { AppBar } from '@/components/common/AppBar';
import { Button } from '@/components/common/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

export default function ServiceTerms() {
	const navigate = useNavigate();

	return (
		<>
			<Helmet>
				<title>이용약관</title>
			</Helmet>
			<main>
				<div className="text-body pt-32 pr-18 pl-18">
					<h3 className="text-[18px] font-bold text-gray-900">Talk 이용약관</h3>
					<div className="mt-21 text-[12px] text-[#272727]">
						<dl>
							<dt className="font-bold">제1조 (목적)</dt>
							<dd>
								본 약관은 Talk(이하 "서비스")가 제공하는 채팅 서비스의
								이용 조건 및 절차, 회원과 서비스 제공자의 권리와 의무를 규정합니다.
							</dd>
						</dl>
						<dl className="mt-12">
							<dt className="font-bold">제2조 (서비스의 내용)</dt>
							<dd>
								1. 서비스는 광고 수익 기반의 무료 서비스입니다.
								<br />
								2. 주요 기능 - 채팅방 생성 및 관리 - 실시간 채팅 - 초대 링크를 통한 멤버 초대 <br />
								3. 서비스는 24시간 제공을 원칙으로 하나, 시스템 점검이나 장애 시 일시
								중단될 수 있습니다.
							</dd>
						</dl>
						<dl className="mt-12">
							<dt className="font-bold">제3조 (회원가입)</dt>
							<dd>
								1. 회원가입은 본 약관과 개인정보 처리방침에 동의한 후, 필요한 정보를
								입력하여 신청합니다.
								<br />
								2. 이메일/비밀번호 또는 소셜 로그인(구글, 카카오, 네이버)을 통해 가입할 수
								있습니다.
								<br />
								3. 다음의 경우 가입이 제한될 수 있습니다.
								<br />
								- 타인의 정보를 도용한 경우
								<br />- 허위 정보를 입력한 경우
							</dd>
						</dl>
						<dl className="mt-12">
							<dt className="font-bold">제4조 (회원의 의무)</dt>
							<dd>
								회원은 다음 행위를 해서는 안 됩니다.
								<br />
								1. 타인의 정보 도용 또는 허위 정보 입력 <br />
								2. 타인에게 불쾌감을 주거나 명예를 훼손하는 행위
								<br />
								3. 음란물, 불법 정보 게시
							</dd>
						</dl>
					</div>
				</div>
				<AppBar className="h-76">
					<div className="pt-12 pr-18 pl-18">
						<Button variant="outlined" fill onClick={() => navigate(-1)}>
							닫기
						</Button>
					</div>
				</AppBar>
			</main>
		</>
	);
}
