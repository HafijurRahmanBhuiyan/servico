import { createBrowserRouter } from "react-router";
import Root from "../layout/Root";
import Home from "../pages/frontend/Home/Home";
 

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);

export default router;
