import { useQuery } from '@tanstack/react-query';
import { getRoomMembers } from '../../services/chat/roomsService';

export const useRoomMembers = (roomId: string) => {
	return useQuery({
		queryKey: ['rooms', roomId, 'members'],
		queryFn: () => getRoomMembers(roomId),
		enabled: !!roomId
	});
};
