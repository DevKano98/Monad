import { createBrowserRouter } from "react-router-dom";

import { Layout } from "../components/layout/Layout";
import { DashboardPage } from "../pages/DashboardPage";
import { FeedPage } from "../pages/FeedPage";
import { IncidentPage } from "../pages/IncidentPage";
import { MapPage } from "../pages/MapPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ReputationPage } from "../pages/ReputationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "feed", element: <FeedPage /> },
      { path: "map", element: <MapPage /> },
      { path: "incidents", element: <IncidentPage /> },
      { path: "reputation", element: <ReputationPage /> }
    ]
  },
  { path: "*", element: <NotFoundPage /> }
]);
