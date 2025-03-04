import { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./Navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .get<Activity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        console.log(response);
        setActivities(response.data);
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

  function handleFormClose() {
    setEditMode(false);
  }

  // function handleCreateOrEdiActivity(activity: Activity) {
  //   activity.id
  //     ? setActivities([
  //         ...activities.filter((x) => x.id !== activity.id),
  //         activity,
  //       ]) 
  //     : setActivities([...activities, { ...activity, id: uuid() }]); 
  //   setEditMode(false);
  //   setSelectedActivity(activity);
  // }

  // ↓↓↓↓ the function below is more undrestandable ↓↓↓↓

  function handleCreateOrEdiActivity(activity:Activity) {
    if (activity.id) {
        // If the activity has an ID (editing mode), replace the existing activity with the updated one
        setActivities([
            ...activities.filter((x) => x.id !== activity.id), // Remove the old version of the activity
            activity, // Add the updated activity
        ]);
    } else {
        // If the activity doesn't have an ID (creating mode), assign a new ID in GUID type and add it to the list
        setActivities([...activities, { ...activity, id: uuid() }]);
    }
    
    // Close the edit mode
    setEditMode(false);

    // Set the selected activity in the state
    setSelectedActivity(activity);
}

  // Delete function (as simple it is)
  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter((x) => x.id !== id)]);
  }

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
        />
      </Container>
    </>
  );
}

export default App;
