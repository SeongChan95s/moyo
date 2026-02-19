import { getUserDataByUid } from '@/services/auth/data';
import type { UsersCollection } from '@/types/auth';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect } from 'react';
import { create } from 'zustand';

interface UseUserState {
	user: User | null;
	data: UsersCollection | null;
	setUser: (value: User | null) => void;
	setData: (value: UsersCollection | null) => void;
}

export const useUserState = create<UseUserState>(set => ({
	user: null,
	data: null,
	setUser: value => set({ user: value }),
	setData: value => set({ data: value })
}));

/**
 * 로그인/로그아웃을 감지하여 유저 정보를 userUseState 에 저장
 */
export const useUserStateChanged = () => {
	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, user => {
			if (user) {
				useUserState.getState().setUser(user);

				const setUserDataToState = async () => {
					try {
						const userData = await getUserDataByUid(user.uid);
						useUserState.getState().setData(userData);
					} catch (error) {
						useUserState.getState().setData(null);
					}
				};

				setUserDataToState();
			} else {
				useUserState.getState().setData(null);
				useUserState.getState().setUser(null);
			}
		});

		return () => unsubscribe();
	}, []);
};
