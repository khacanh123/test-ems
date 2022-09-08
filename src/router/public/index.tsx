import AuthLayout from 'layout/Auth';
import { lazy } from 'react';
import { RouteType } from 'types';

const SignInContainer = lazy(() => import('pages/SignIn'));
const NotFound = lazy(() => import('components/NotFound'));

export const PublicRouter: RouteType[] = [
  {
    path: '/signin',
    element: SignInContainer,
    layout: AuthLayout,
  },
  {
    path: '/',
    element: SignInContainer,
    layout: AuthLayout,
  },
  {
    path: '*',
    element: NotFound,
    layout: AuthLayout,
  },
];
