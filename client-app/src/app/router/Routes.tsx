import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/Test";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/users/LoginForm";

//We define our rotes inside here
export const routes : RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children:[
            {path: 'activities', element: <ActivityDashboard/>},  //Activity List
            {path: 'activities/:id', element: <ActivityDetails/>},  //Activity Details
            {path: 'createActivity', element: <ActivityForm key='create'/>},  //Create Activity
            {path: 'manage/:id', element: <ActivityForm key='manage'/>},  //Edit Activity
            {path: 'login', element: <LoginForm/>},  //Login users
            {path: 'errors', element: <TestErrors />},  //Testing Errors
            {path: 'not-found', element: <NotFound />},  //NotFound Page
            {path: '*', element: <Navigate replace to="/not-found" />},  //if we write any incorrect path in URL we return back to NotFound page either!
            {path: 'server-error', element: <ServerError />},  //NotFound Page
        ]
    },
]

export const router = createBrowserRouter(routes)