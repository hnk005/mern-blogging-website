import { lazy, Suspense, ReactElement, PropsWithChildren } from "react";
import {
  Outlet,
  RouteObject,
  createBrowserRouter,
} from "react-router-dom";
import { rootPaths } from "./paths";
import paths from "./paths";

const App = lazy<() => ReactElement>(() => import("@/App"));

const MainLayout = lazy<({ children }: PropsWithChildren) => ReactElement>(
  () => import("@/layouts/MainLayout")
);

const routes: RouteObject[] = [
  {
    element: (
      <Suspense>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: paths.home,
        element: (
          <MainLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        children: [
          // {
          //   path: paths.home,
          //   index: true,
          //   element: <Order />,
          // },
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
