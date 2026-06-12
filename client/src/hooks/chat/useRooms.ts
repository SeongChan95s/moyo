import { useQuery } from '@tanstack/react-query';
import { getMyRooms, getRoom } from '../../services/chat/roomsService';
import { useUserState } from '../auth/useUserStateChanged';

export const useMyRooms = () => {
	const user = useUserState(state => state.user);
	return useQuery({
		queryKey: ['rooms', 'my', user?.uid],
		queryFn: () => getMyRooms(user!.uid),
		enabled: !!user?.uid
	});
};

export const useRoom = (roomId: string) => {
	return useQuery({
		queryKey: ['rooms', roomId],
		queryFn: () => getRoom(roomId),
		enabled: !!roomId
	});
};
