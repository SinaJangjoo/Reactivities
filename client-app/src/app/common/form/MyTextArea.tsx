
import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface Props {
  placeholder: string;
  name: string;
  rows:number;
  label?: string;
}

export default function MyTextArea(props: Props) {
  const [field, meta] = useField(props.name); //useField() hook is from formik

  return (
    // error={meta.touched && !! meta.error} in this line we check if the line has been touched AND we check if error object exists!
    // When we put  "!!" before the object, we cast that to Boolean! because meta.error is in type String!
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <textarea {...field} {...props} />
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}