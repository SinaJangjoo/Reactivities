import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";

export default class ActivityStore {
  // activities: Activity[] = [];
  activityRegistry = new Map<string, Activity>(); // Javascript Map Object for our arrays like Activity[] instead of directly set Activity[] as an array!
  selectedActivity: Activity | undefined = undefined; //State value
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  //Computed property
  // To sort our activities by date and move newest activities on top rather than end of list!
  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  //Computed property ( S3 F9 )
  //Group activities by their date
  //if we had multiple activities inside same date they will be in one group by the key (their date)
  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = activity.date;
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  ////////////////////////////////////////////////// Activity Dashboard ///////////////////////////////////////////////////////////

  //List of Activities
  // because we want to bind this function to a class we have to define this function as arrow function!
  loadActivities = async () => {
    this.setLoadingInitial(true);
    try {
      //Axios calling to get list of activities!
      //Because it is async it won't execute next line until it returns all activities!
      const activities = await agent.Activities.list();

      // before we set our activities we have to optimize our date to correct format without UTC time or sth else!
      activities.forEach((activity) => {
        this.setActivity(activity);
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  //Single Activity
  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        runInAction(() => (this.selectedActivity = activity));
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };

  private setActivity = (activity: Activity) => {
    activity.date = activity.date.split("T")[0];
    // this.activities.push(activity);  ↓↓↓↓↓↓
    this.activityRegistry.set(activity.id, activity);
  };

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  //Separated function to call loading and pass it a boolean to set handy anywhere whatever we want to rather than using runInAction()
  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  ////////////////////////////////////////////////// CREATE - EDIT - DELETE /////////////////////////////////////////////////////////////

  createActivity = async (activity: Activity) => {
    this.loading = true;
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      //If the API response of creation was successful then we push inside runInAction() method
      runInAction(() => {
        // this.activities.push(activity);  ↓↓↓↓↓↓
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity; //to see the current activity that we create inside activity details
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
      //this.setLoading(false);
    }
  };

  updateActivity = async (activity: Activity) => {
    this.loading = true;

    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        // this.activities = [
        //   ...this.activities.filter((x) => x.id !== activity.id), // Remove the old version of the activity
        //   activity, // Add the updated activity
        // ];  ↓↓↓↓↓

        this.activityRegistry.set(activity.id, activity);

        // this.activities.filter((x) => x.id !== activity.id);
        // this.activities.push(activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id); // Remove the activity inside server side (API)
      runInAction(() => {
        //this.activities = [...this.activities.filter((x) => x.id !== id)];
        //Remove the activity from the list ↓↓↓↓↓
        this.activityRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
