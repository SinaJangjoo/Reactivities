// This file stores all defined stores inside MobX

import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface Store {
  activityStore: ActivityStore;
}

//Implement all stores that we defined inside stores folder
export const store: Store = {
  activityStore: new ActivityStore(),
};

// React Context
//Make all defined stores TOGETHER to to call them at once
export const StoreContext = createContext(store);


//This Hook allow us to use all stores inside our components
export function useStore(){
    return useContext(StoreContext);
}

//After this we go to main.tsx file to make our store GLOBALLY which is defined by React Context named "StoreContext"