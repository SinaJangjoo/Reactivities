import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

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
        ]
    },
]

export const router = createBrowserRouter(routes)