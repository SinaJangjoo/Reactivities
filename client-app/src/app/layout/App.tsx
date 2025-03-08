import { useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./Navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

function App() {

  //It comes from a Hook which is defined inside stores.ts to throw all the stores together at once!
  const {activityStore} = useStore();

  //Axios calling...
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]); // pass the activityStore as a dependency to our useEffect

  // set loading before fetching data
  if (activityStore.loadingInitial) return <LoadingComponent content="Loading app" />;

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard />
      </Container>
    </>
  );
}

export default observer(App);
