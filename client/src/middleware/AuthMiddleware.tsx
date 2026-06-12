import { IconAlertFilled } from '@/components/common/Icon';
import { useGlobalToastStore } from '@/components/global/Popup/GlobalToast';
import { getAsyncUser } from '@/utils/auth/getAsyncUser';
import { redirect } from 'react-router-dom';

export const AuthMiddleware = async () => {
	const user = await getAsyncUser();
	if (!user) {
		useGlobalToastStore.getState().push({
			icon: <IconAlertFilled />,
			message: '로그인이 필요한 서비스 입니다.'
		});
		throw redirect('/auth/login');
	}
};
