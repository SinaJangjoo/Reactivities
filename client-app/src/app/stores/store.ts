// This file stores all defined stores inside MobX

import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ModalStore from "./modalStore";

interface Store {
  activityStore: ActivityStore;
  commonStore: CommonStore;
  userStore: UserStore;
  modalStore: ModalStore;
}

//Implement all stores that we defined inside stores folder
export const store: Store = {
  activityStore: new ActivityStore(),
  commonStore: new CommonStore(),
  userStore: new UserStore(),
  modalStore: new ModalStore()
};

// React Context
//Make all defined stores TOGETHER to to call them at once
export const StoreContext = createContext(store);


//This Hook allow us to use all stores inside our components
export function useStore(){
    return useContext(StoreContext);
}

//After this we go to main.tsx file to make our store GLOBALLY which is defined by React Context named "StoreContext"