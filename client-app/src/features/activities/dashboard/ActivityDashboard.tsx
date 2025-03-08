import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

export default observer(function ActivityDashboard() {

  const {activityStore} = useStore();
  const {selectedActivity , editMode} = activityStore;  // we destructure these two values because our condition in line 38

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList/>
      </Grid.Column>
      <Grid.Column width="6">
        {/* When we press Edit btn details will disappear because of  "!editMode" this in line below! */}
        {selectedActivity && !editMode && (
          <ActivityDetails />
        )}
        {/* we only show thw ActivityForm only if we are in editMode! so we define like this: */}
        {editMode && (
          <ActivityForm />
        )}
      </Grid.Column>
    </Grid>
  );
})
