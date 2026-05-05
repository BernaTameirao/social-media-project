import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./MainPage/MainPage";
import LoginPage from "./LoginPage/LoginPage";
import AccountPage from "./AccountPage/AccountPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainPage/>
	},
  {
    path: "/login",
    element: <LoginPage/>
  },
  {
    path: "/account/:username",
    element: <AccountPage/>,
  }
]);

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
