//This is our reusable text input file. one time define, multiple time uses!
//for example it use inside (ActivityForm.tsx)

import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface Props {
  placeholder: string;
  name: string;
  label?: string;
  type?:string;
}

export default function MyTextInput(props: Props) {
  const [field, meta] = useField(props.name); //useField() hook is from formik

  return (
    // error={meta.touched && !! meta.error} in this line we check if the line has been touched AND we check if error object exists!
    // When we put  "!!" before the object, we cast that toboolean! because meta.error is in type String!
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}
