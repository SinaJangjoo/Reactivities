import { Button, Header, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik, Form} from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { v4 as uuid } from "uuid";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const { loading, loadActivity, loadingInitial, createActivity,updateActivity } = activityStore;

  const { id } = useParams(); // The id of root parameters

  const navigate = useNavigate();

  //Edit mode & with populate past values inside input MyTextInputs
  const [activity, setActivity] = useState<Activity>({
    id: "",
    category: "",
    city: "",
    date: null,
    description: "",
    title: "",
    venue: "",
  });

  //--------------------------- Validation --------------------------
  const validationSchema = Yup.object({
    title: Yup.string().required("The activity title is required!"),
    description: Yup.string().required("The activity description is required!"),
    category: Yup.string().required("The activity category is required!"),
    date: Yup.string().required("The activity date is required!").nullable(),
    venue: Yup.string().required("The activity venue is required!"),
    city: Yup.string().required("The activity city is required!"),
  });

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(activity!));
  }, [id, loadActivity]);

  function handleFormSubmit(activity:Activity) {
    if (!activity.id) {
      //When we hit submit btn in creation mode, we have to generate the GUID first for creating our id and then start creating the body by using createActivity() function!
      activity.id = uuid();
      createActivity(activity).then(() =>
        navigate(`/activities/${activity.id}`)
      );
    } else {
      updateActivity(activity).then(() =>
        navigate(`/activities/${activity.id}`)
      );
    }
  }

  // // We have to create a func to be able to change inputs! and show the past input values for if we want change or not!
  // // our inputs must have two properties! "name" & "value" and they must have match each other
  // //The name of every inputs is that id! and their value is what is inside that and shows us
  // function handleChange(
  //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) {
  //   const { name, value } = event.target;
  //   setActivity({ ...activity, [name]: value });
  // }

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal"/>
      <Formik
        validationSchema={validationSchema}  // for our validations!
        enableReinitialize // if we don't write this, in edit mode our inputs gets empty in first
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {/* We use  these three properties: "isValid, isSubmitting, dirty" to submitting the form in <Button/> below*/}
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            
            <MyTextInput name="title" placeholder="Title"/>

            <MyTextArea rows={3} placeholder="Description" name="description" />
            <MySelectInput options={categoryOptions} placeholder="Category" name="category" />
            <MyDateInput
            placeholderText="Date"
             name="date" 
             showTimeSelect
             timeCaption="time"
             dateFormat="MMM d, yyy h:m aa"
             />
             <Header content="Location Details" sub color="teal"/>
            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />
            <Button
            disabled={isSubmitting || !isValid || !dirty}
              loading={loading}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              as={Link}
              to="/activities"
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
