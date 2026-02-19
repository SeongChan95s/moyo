import { Helmet } from 'react-helmet-async';
import { Checkbox } from '../../../components/common/Checkbox';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Divider } from '@/components/common/Divider';
import { Button } from '@/components/common/Button';
import { ProgressBar } from '@/components/common/ProgressBar';

export default function AgreePage() {
	const [checkedState, setCheckedState] = useState([false, false, false]);
	const navigate = useNavigate();

	const handleCheck = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setCheckedState(state => {
			const newState = [...state];
			newState[i] = e.target.checked;
			return newState;
		});
	};

	const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCheckedState(checkedState.map(() => e.target.checked));
	};

	return (
		<>
			<Helmet>
				<title>약관동의</title>
			</Helmet>
			<main className="register-agree-page">
				<ProgressBar />
				<form>
					<div className="title-box mt-25 pr-18 pl-18">
						<h3 className="text-[18px] font-bold text-gray-900">
							모요 서비스 이용을 위해 동의가 필요해요.
						</h3>
						<p className="mt-11 text-[14px] text-[#272727]">
							본인확인 및 본인 인증을 위한 이메일 인증
							<br />
							서비스 이용 동의를 포함합니다.
						</p>
					</div>

					<div className="checkbox-wrap pl-18 pr-18 mt-20">
						<div className="checkbox-wrap-top border border-gray-200 rounded-md">
							<div className="pt-16 pr-16 pb-16 pl-16">
								<Checkbox
									className="text-[16px] font-semibold text-gray-700"
									checked={checkedState.every(el => el)}
									onChange={handleCheckAll}
									icon="round"
									color="primary">
									모두 동의합니다.
								</Checkbox>
							</div>
							<Divider className="bg-gray-200" />
							<ul className="checkbox-wrap-body pt-15 pr-12 pb-15 pl-15">
								<li>
									<Checkbox
										className="text-[13px]"
										checked={checkedState[0]}
										onChange={handleCheck(0)}
										icon="round"
										color="primary"
										variant="transparent">
										본인은 만 14세 이상입니다. (필수)
									</Checkbox>
								</li>
								<li className="flex justify-between items-center mt-16">
									<Checkbox
										className="text-[13px]"
										checked={checkedState[1]}
										onChange={handleCheck(1)}
										icon="round"
										color="primary"
										variant="transparent">
										서비스 이용약관 동의 (필수)
									</Checkbox>
									<Link
										to="/auth/register/service-terms"
										className="h-23 flex justify-center items-center pr-6 pl-8 text-[12px] text-gray-400 border border-gray-200 rounded-[5px]">
										약관 보기 &gt;
									</Link>
								</li>
								<li className="flex justify-between items-center mt-16">
									<Checkbox
										className="text-[13px]"
										checked={checkedState[2]}
										onChange={handleCheck(2)}
										icon="round"
										color="primary"
										variant="transparent">
										개인정보 수집 및 이용 동의 (필수)
									</Checkbox>
									<Link
										to="/auth/register/privacy-terms"
										className="h-23 flex justify-center items-center pr-6 pl-8 text-[12px] text-gray-400 border border-gray-200 rounded-[5px]">
										약관 보기 &gt;
									</Link>
								</li>
							</ul>
						</div>
					</div>
					{checkedState.every(el => el) && (
						<div className="pr-18 pl-18">
							<Button
								className="mt-15"
								type="button"
								size="lg"
								color="primary"
								fill
								onClick={() => navigate('/auth/register/join?step=1')}>
								다음
							</Button>
						</div>
					)}
				</form>
			</main>
		</>
	);
}
