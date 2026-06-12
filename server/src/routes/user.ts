import { Router, Request, Response } from 'express';
import admin from 'firebase-admin';

const router = Router();

router.get('/display-names', async (req: Request, res: Response) => {
	const { userIds } = req.query;

	if (!userIds) {
		res.status(400).json({ error: '필수 파라미터가 누락되었습니다.' });
		return;
	}

	const ids = (Array.isArray(userIds) ? userIds : [userIds]) as string[];

	try {
		const results = await Promise.all(
			ids.map(async (uid) => {
				const user = await admin.auth().getUser(uid);
				return [uid, user.displayName ?? uid] as const;
			})
		);

		res.json(Object.fromEntries(results));
	} catch (error) {
		console.error('displayName 조회 실패:', error);
		res.status(500).json({ error: '사용자 정보 조회에 실패했습니다.' });
	}
});

export default router;
