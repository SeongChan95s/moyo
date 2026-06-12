export interface NaverTokenRequest {
	code: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

export interface NaverUserInfo {
	id: string;
	email?: string;
	nickname?: string;
	profile_image?: string;
}

export interface NaverAuthData {
	customToken: string;
	user: NaverUserInfo;
	isNewUser: boolean;
}

export interface KakaoTokenRequest {
	code: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

export interface KakaoTokenData {
	id_token: string;
	access_token: string;
}
