import { Button } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default function ActivityDetails() {
  const { activityStore } = useStore();
  const { selectedActivity: activity, openForm, cancelSelectedActivity } = activityStore;
  if (!activity) return <LoadingComponent/>; // Just to handle an "undefined error" while we using for example activity.category

  return (
    <div className="ui card fluid">
      <div className="image">
        <img src={`/assets/categoryImages/${activity.category}.jpg`} />
      </div>
      <div className="content">
        <a className="header">{activity.title}</a>
        <div className="meta">
          <span className="date">{activity.date}</span>
        </div>
        <div className="description">{activity.description}</div>
      </div>
      <div className="extra content">
        <Button.Group widths="2">
          <Button
            onClick={() => openForm(activity.id)}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            onClick={cancelSelectedActivity}
            basic
            color="grey"
            content="Cancel"
          />
        </Button.Group>
      </div>
    </div>
  );
}