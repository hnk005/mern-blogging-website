import { lazy, Suspense, ReactElement, PropsWithChildren } from "react";
import { Outlet, RouteObject, createBrowserRouter } from "react-router-dom";
import { rootPaths } from "./paths";
import paths from "./paths";
import { AuthPageProps } from "@/pages/AuthPage";
import PageLoader from "@/components/loader/PageLoader";
import RequireAuth from "@/components/guards/RequireAuth";

const App = lazy<() => ReactElement>(() => import("@/App"));

const MainLayout = lazy<({ children }: PropsWithChildren) => ReactElement>(
  () => import("@/layouts/MainLayout")
);

const AuthPage = lazy<({ type }: AuthPageProps) => ReactElement>(
  () => import("@/pages/AuthPage")
);

const HomePage = lazy<() => ReactElement>(() => import("@/pages/HomePage"));

const routes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<PageLoader />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: paths.home,
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        children: [
          {
            path: paths.home,
            index: true,
            element: (
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            ),
          },
          {
            path: paths.signin,
            element: <AuthPage type="sign-in" />,
          },
          {
            path: paths.signup,
            element: <AuthPage type="sign-up" />,
          },
        ],
      },
    ],
  },
  // {
  //   path: '*',
  //   element: <ErrorPage />,
  // },
];

const router = createBrowserRouter(routes);

export default router;
