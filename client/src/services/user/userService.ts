import { useGlobalToastStore } from '@/components/global/Popup/GlobalToast';

export const getUserDisplayNames = async (
	userIds: string[]
): Promise<Record<string, string>> => {
	try {
		const params = new URLSearchParams();
		userIds.forEach((id) => params.append('userIds', id));

		const res = await fetch(
			`${import.meta.env.VITE_SERVER_URL}/api/user/display-names?${params}`
		);

		if (!res.ok) {
			throw new Error(`서버 오류: ${res.status}`);
		}

		return res.json();
	} catch (error) {
		useGlobalToastStore.getState().push({
			message: error instanceof Error ? error.message : '사용자 정보 조회에 실패했습니다.'
		});

		throw error;
	}
};
