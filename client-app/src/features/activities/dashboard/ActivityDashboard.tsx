import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";

export default observer(function ActivityDashboard() {
  //It comes from a Hook which is defined inside stores.ts to throw all the stores together at once!
  const { activityStore } = useStore();
  const { loadActivities, activityRegistry } = activityStore;

  //Axios calling inside...
  // this part of code is define if we load list of activities once and it get inside memory our loading will set,
  // but for the second time if we would load activities the loading will not appear again because we have them inside memory!
  useEffect(() => {
    if (activityRegistry.size <= 0) loadActivities();
  }, [activityRegistry.size]); // pass the activityRegistry.size as a dependency to our useEffect

  // set loading before fetching data
  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading app" />;

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters/>
      </Grid.Column>
    </Grid>
  );
});
