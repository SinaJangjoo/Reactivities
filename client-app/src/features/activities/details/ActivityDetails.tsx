import { Button } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
  activity: Activity;
  cancelSelectActivity: () => void;
  openForm: (id: string) => void;
}

export default function ActivityDetails({
  activity,
  cancelSelectActivity,
  openForm
}: Props) {
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
          <Button onClick={()=> openForm(activity.id)} basic color="blue" content="Edit" />
          <Button
            onClick={cancelSelectActivity}
            basic
            color="grey"
            content="Cancel"
          />
        </Button.Group>
      </div>
    </div>
  );
}
