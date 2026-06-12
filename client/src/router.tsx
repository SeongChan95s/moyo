import { lazy } from 'react';
import NotFoundPage from './pages/NotFoundPage';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import GuideLayout from './layouts/GuideLayout';
import MainLayout from './layouts/MainLayout';
import SubLayout from './layouts/SubLayout';
import CenterLayout from './layouts/CenterLayout';
import JoinPage from './pages/auth/register/JoinPage';
import AgreePage from './pages/auth/register/AgreePage';
import MyPage from './pages/main/MyPage';
import { AuthMiddleware } from './middleware/AuthMiddleware';
import KakaoRedirectPage from './pages/auth/oauth/KakaoRedirectPage';
import NaverRedirectPage from './pages/auth/oauth/NaverRedirectPage';
import LoginPage from './pages/auth/login/LoginPage';
import EmailLoginPage from './pages/auth/login/EmailLoginPage';
import ServiceTerms from './pages/auth/terms/ServiceTerms';
import PrivacyTerms from './pages/auth/terms/PrivacyTerms';
import FindPasswordPage from './pages/auth/find/FindPasswordPage';
import { LoginMiddleware } from './middleware/LoginMiddleware';

const ComponentGuidePage = lazy(() => import('./pages/guide/common/ComponentGuidePage'));
const PopupGuidePage = lazy(() => import('./pages/guide/common/PopupGuidePage'));
const GlobalPopupGuidePage = lazy(
	() => import('./pages/guide/global/GlobalPopupGuidePage')
);
const SheetGuidePage = lazy(() => import('./pages/guide/common/SheetGuidePage'));

const ChatListPage = lazy(() => import('./pages/main/ChatListPage'));
const ChatRoomPage = lazy(() => import('./pages/chat/ChatRoomPage'));
const CreateRoomPage = lazy(() => import('./pages/chat/CreateRoomPage'));
const RoomSettingsPage = lazy(() => import('./pages/chat/RoomSettingsPage'));
const InvitePage = lazy(() => import('./pages/chat/InvitePage'));

const router = createBrowserRouter([
	{
		element: <MainLayout />,
		middleware: [AuthMiddleware],
		children: [
			{
				path: '/',
				element: <Navigate to="/chat" replace />
			},
			{
				path: '/chat',
				element: <ChatListPage />
			},
			{
				path: '/my',
				element: <MyPage />
			}
		]
	},
	{
		element: <SubLayout />,
		middleware: [AuthMiddleware],
		children: [
			{
				path: '/chat/create',
				element: <CreateRoomPage />
			},
			{
				path: '/chat/:roomId/settings',
				element: <RoomSettingsPage />
			},
			{
				path: '/chat/:roomId',
				element: <ChatRoomPage />
			}
		]
	},
	{
		element: <CenterLayout />,
		middleware: [AuthMiddleware],
		children: [
			{
				path: '/invite/:token',
				element: <InvitePage />
			}
		]
	},
	{
		path: '/auth',
		middleware: [LoginMiddleware],
		children: [
			{
				path: 'login',
				element: <LoginPage />
			},
			{
				path: 'login',
				element: <SubLayout />,
				children: [
					{
						path: 'email',
						element: <EmailLoginPage />
					}
				]
			},
			{
				path: 'register',
				element: <SubLayout />,
				children: [
					{
						path: 'agree',
						element: <AgreePage />
					},
					{
						path: 'join',
						element: <JoinPage />
					},
					{
						path: 'service-terms',
						element: <ServiceTerms />
					},
					{
						path: 'privacy-terms',
						element: <PrivacyTerms />
					}
				]
			},
			{
				path: 'oauth',
				element: <CenterLayout />,
				children: [
					{
						path: 'kakao/callback',
						element: <KakaoRedirectPage />
					},
					{
						path: 'naver/callback',
						element: <NaverRedirectPage />
					}
				]
			},
			{
				path: 'find',
				element: <SubLayout />,
				children: [
					{
						path: 'password',
						element: <FindPasswordPage />
					}
				]
			}
		]
	},
	{
		element: <GuideLayout />,
		path: '/guide',
		children: [
			{
				path: 'common/component',
				element: <ComponentGuidePage />
			},
			{
				path: 'common/popup',
				element: <PopupGuidePage />
			},
			{
				path: 'common/sheet',
				element: <SheetGuidePage />
			},
			{
				path: 'global/popup',
				element: <GlobalPopupGuidePage />
			}
		]
	},
	{
		path: '*',
		element: <NotFoundPage />
	}
]);

export default function Router() {
	return <RouterProvider router={router} />;
}
