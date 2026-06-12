import { useMutation } from '@tanstack/react-query';
import { acceptInvite, createInviteLink, getInviteByToken } from '../../services/chat/inviteService';
import { useUserState } from '../auth/useUserStateChanged';

export const useCreateInviteLink = (roomId: string) => {
	const user = useUserState(state => state.user);
	return useMutation({
		mutationFn: (expiresInHours?: number) =>
			createInviteLink(roomId, user!.uid, expiresInHours)
	});
};

export const useAcceptInvite = () => {
	const user = useUserState(state => state.user);
	const userData = useUserState(state => state.data);
	return useMutation({
		mutationFn: (token: string) => acceptInvite(token, user!, userData!)
	});
};

export const useGetInvite = () => {
	return useMutation({
		mutationFn: (token: string) => getInviteByToken(token)
	});
};
