import { lazy, Suspense, ReactElement, PropsWithChildren } from "react";
import { Outlet, RouteObject, createBrowserRouter } from "react-router-dom";
import paths from "./paths";
import { AuthPageProps } from "@/pages/AuthPage";
import PageLoader from "@/components/loader/PageLoader";
import ProtectRoutes from "@/components/guards/ProtectRoutes";
import EditorProvider from "@/context/EditorContext";
import ProtectRoutesAuth from "@/components/guards/ProtectRoutesAuth";

const App = lazy<() => ReactElement>(() => import("@/App"));

const MainLayout = lazy<({ children }: PropsWithChildren) => ReactElement>(
  () => import("@/layouts/MainLayout")
);

const EditorLayout = lazy<({ children }: PropsWithChildren) => ReactElement>(
  () => import("@/layouts/EditorLayout")
);

const AuthPage = lazy<({ type }: AuthPageProps) => ReactElement>(
  () => import("@/pages/AuthPage")
);

const HomePage = lazy<() => ReactElement>(() => import("@/pages/HomePage"));
const SearchPage = lazy<() => ReactElement>(() => import("@/pages/SearchPage"));
const EditorPage = lazy<() => ReactElement>(() => import("@/pages/EditorPage"));
const ProfilePage = lazy<() => ReactElement>(
  () => import("@/pages/ProfilePage")
);
const PageNotFound = lazy<() => ReactElement>(() => import("@/pages/404Page"));

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
            element: <HomePage />,
          },
          {
            path: paths.search + "/:query",
            element: <SearchPage />,
          },
          {
            path: paths.user + "/:id",
            element: <ProfilePage />,
          },
          {
            element: <ProtectRoutesAuth />,
            children: [
              {
                path: paths.signIn,
                element: <AuthPage type="sign-in" />,
              },
              {
                path: paths.signUp,
                element: <AuthPage type="sign-up" />,
              },
            ],
          },
        ],
      },
      {
        element: (
          <EditorProvider>
            <EditorLayout>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </EditorLayout>
          </EditorProvider>
        ),
        children: [
          {
            element: <ProtectRoutes />,
            children: [
              {
                path: paths.editor,
                element: <EditorPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PageNotFound />
      </Suspense>
    ),
  },
];

const router = createBrowserRouter(routes);

export default router;
