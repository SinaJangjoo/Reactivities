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
  loadingInitial = true;

  constructor() {
    makeAutoObservable(this);
  }

  //Computed property
  // To sort our activities by date and move newest activities on top rather than end of list!
  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(b.date) - Date.parse(a.date)
    );
  }

  ////////////////////////////////////////////////// Activity Dashboard ///////////////////////////////////////////////////////////

  // because we want to bind this function to a class we have to define this function as arrow function!
  loadActivities = async () => {
    try {
      //Axios calling to get list of activities!
      //Because it is async it won't execute next line until it returns all activities!
      const activities = await agent.Activities.list();

      // before we set our activities we have to optimize our date to correct format without UTC time or sth else!
      activities.forEach((activity) => {
        activity.date = activity.date.split("T")[0];
        // this.activities.push(activity);  ↓↓↓↓↓↓
        this.activityRegistry.set(activity.id, activity);
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  //Separated function to call loading and pass it a boolean to set handy anywhere whatever we want to rather than using runInAction()
  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };
  ////////////////////////////////////////////////// Activity Details /////////////////////////////////////////////////////////////

  //When we hit "View" btn in activity dashboard
  //To find selected activity id and pass it to ActivityDashboard to finally show beside inside that
  selectActivity = (id: string) => {
    // this.selectedActivity = this.activities.find((a) => a.id === id);  ↓↓↓↓↓↓
    this.selectedActivity = this.activityRegistry.get(id);
  };

  //When we hit "Cancel" btn on activities details
  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  //When we het "Edit" btn on activities details
  //The id is nullable because if we Edit we have id and if we Create we don't have
  //This function has optional value! if the id was exist it means user want to edit so we pass the id if not, we close the details!
  openForm = (id?: string) => {
    id ? this.selectActivity(id) : this.cancelSelectedActivity();
    this.editMode = true;
  };

  closeForm = () => {
    this.editMode = false;
    runInAction(() => {
      this.loading = false;
    });
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

        if (this.selectedActivity?.id === id) this.cancelSelectedActivity(); //Remove the deleted activity details on right side
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
