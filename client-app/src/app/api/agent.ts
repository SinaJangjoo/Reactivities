// AXIOS - This going to contain all our requests that go to our API (centralize file)
import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/activity";

//To set timer for loading before fetching data (axios interceptors)
const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.interceptors.response.use(async (response) => {
  try {
    await sleep(1000); //loading period: 1 sec
    return response; //then return responses
  } catch (error) {
    //if error occurred during loading return:
    console.log(error);
    return await Promise.reject(error);
  }
});

// 1- Define our base URL
axios.defaults.baseURL = "http://localhost:5000/api";

// 2- Define our axios response which is get from API (only data will returned)
// We define our response in generic type (<T>) to receive all types in a single code line rather than duplicate coding!
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

// 3- Define an object that is store our request make to axios to  GET / POST / PUT & DELETE
const request = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

// 4- Each organizes inside our app have their own object!   for eg. Activities api calls!

//Our activities axios
const Activities = {
  list: () => request.get<Activity[]>("/activities"), //GET ALL
  details: (id: string) => request.get<Activity>(`/activities/${id}`), //GET
  create: (activity: Activity) =>request.post<void>("/activities", activity), //POST
  update: (activity: Activity) =>request.put<void>(`/activities/${activity.id}`, activity), //PUT
  delete: (id: string) => request.del<void>(`/activities/${id}`), //DELETE
};

// 5- The agent that return all the axios by calling them together
const agent = {
  Activities,
};

export default agent;
