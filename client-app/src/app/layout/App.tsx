import { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./Navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  //Axios calling...
  useEffect(() => {
    agent.Activities.list().then((response) => {
      // before we set our activities we have to optimize our date to correct format without UTC time or sth else!
      let activities: Activity[] = [];
      response.forEach((activity) => {
        activity.date = activity.date.split("T")[0];
        activities.push(activity);
      });
      setActivities(activities);
      setLoading(false);
    });
  }, []);

  //To find selected activity id and pass it to ActivityDashboard to finally show details inside that
  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find((x) => x.id === id));
  }

  //To close the activity details (Cancel situation)
  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  //This function has optional value! if the id was exist it means user want to edit so we pass the id if not, we close the details!
  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  //To close form when user hit the Cancel btn
  function handleFormClose() {
    setEditMode(false);
    setSubmitting(false);
  }

  // POST - PUT function
  function handleCreateOrEdiActivity(activity: Activity) {
    setSubmitting(true);
    if (activity.id) {
      // If the activity has an ID (editing mode), replace the existing activity with the updated one
      agent.Activities.update(activity).then(() => {
        setActivities([
          ...activities.filter((x) => x.id !== activity.id), // Remove the old version of the activity
          activity, // Add the updated activity
        ]);
        //Set the selected activity in the state
        setSelectedActivity(activity);
        // Close the edit mode
        setEditMode(false);
        setSubmitting(false);
      });
    } else {
      // If the activity doesn't have an ID (creating mode), assign a new ID in GUID type and add it to the list

      activity.id = uuid(); //first we have to create an id for our new activity

      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        //Set the selected activity in the state
        setSelectedActivity(activity);
        // Close the edit mode
        setEditMode(false);
        setSubmitting(false);
      });
    }
  }

  // Delete function (as simple it is)
  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter((x) => x.id !== id)]);
      setSubmitting(false);
    })
  }

  // set loading before fetching data
  if (loading) return <LoadingComponent content="Loading app" />;

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEdiActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
