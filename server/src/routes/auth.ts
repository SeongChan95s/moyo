import { Router, Request, Response } from 'express';
import axios from 'axios';
import admin from 'firebase-admin';
import type { ApiResponse } from '../types/index.js';
import type {
	NaverTokenRequest,
	NaverUserInfo,
	NaverAuthData,
	KakaoTokenRequest,
	KakaoTokenData
} from '../types/auth.js';

const router = Router();


router.post('/naver', async (req: Request, res: Response<ApiResponse<NaverAuthData>>) => {

	try {
		const { code, clientId, clientSecret, redirectUri } =
			req.body as NaverTokenRequest;

		if (!code || !clientId || !clientSecret || !redirectUri) {
			res.status(400).json({ success: false, message: '필수 파라미터가 누락되었습니다.' });
			return;
		}

		const tokenResponse = await axios.post('https://nid.naver.com/oauth2.0/token', {
			grant_type: 'authorization_code',
			client_id: clientId,
			client_secret: clientSecret,
			code,
			redirect_uri: redirectUri
		}, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			validateStatus: () => true
		});

		if (tokenResponse.status >= 400) {
			const errorText = typeof tokenResponse.data === 'string' ? tokenResponse.data : JSON.stringify(tokenResponse.data);
			console.error('네이버 토큰 교환 실패:', errorText);
			res.status(tokenResponse.status).json({
				success: false,
				message: `네이버 토큰 교환 실패: ${tokenResponse.status}`
			});
			return;
		}

		const tokenData = tokenResponse.data;

		const userInfoResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`
			},
			validateStatus: () => true
		});

		if (userInfoResponse.status >= 400) {
			const errorText = typeof userInfoResponse.data === 'string' ? userInfoResponse.data : JSON.stringify(userInfoResponse.data);
			console.error('네이버 사용자 정보 조회 실패:', errorText);
			res.status(userInfoResponse.status).json({
				success: false,
				message: `네이버 사용자 정보 조회 실패: ${userInfoResponse.status}`
			});
			return;
		}

		const userInfo = userInfoResponse.data.response as NaverUserInfo;
		const uid = `${userInfo.id}`;

		try {
			let isNewUser = false;
			try {
				await admin.auth().getUser(uid);
			} catch (getError) {
				if ((getError as any).code === 'auth/user-not-found') {
					await admin.auth().createUser({
						uid,
						displayName: userInfo.nickname,
						photoURL: userInfo.profile_image,
						email: userInfo.email
					});
					isNewUser = true;
				} else {
					throw getError;
				}
			}

			const customToken = await admin.auth().createCustomToken(uid, {
				provider: 'naver'
			});

			res.json({
				success: true,
				message: '네이버 로그인 성공',
				data: { customToken, user: userInfo, isNewUser }
			});
		} catch (error) {
			console.error('Custom Token 생성 실패:', error);
			res.status(500).json({ success: false, message: 'Custom Token 생성에 실패했습니다.' });
		}
	} catch (error) {
		console.error('네이버 토큰 교환 중 오류 발생:', error);
		res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
	}
});


router.post('/kakao', async (req: Request, res: Response<ApiResponse<KakaoTokenData>>) => {
	try {
		const { code, clientId, clientSecret, redirectUri } = req.body as KakaoTokenRequest;

		if (!code || !clientId || !clientSecret || !redirectUri) {
			res.status(400).json({ success: false, message: '필수 파라미터가 누락되었습니다.' });
			return;
		}

		const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', {
			grant_type: 'authorization_code',
			client_id: clientId,
			client_secret: clientSecret,
			code,
			redirect_uri: redirectUri
		}, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
			},
			validateStatus: () => true
		});

		if (tokenResponse.status >= 400) {
			const errorText = typeof tokenResponse.data === 'string' ? tokenResponse.data : JSON.stringify(tokenResponse.data);
			res.status(tokenResponse.status).json({
				success: false,
				message: `카카오 토큰 교환 실패: ${tokenResponse.status} ${errorText}`
			});
			return;
		}

		res.json({ success: true, message: '카카오 로그인 성공', data: tokenResponse.data });
	} catch (error) {
		res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
	}
});

export default router;
