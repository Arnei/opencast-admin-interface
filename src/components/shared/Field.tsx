import { FastField as FormikFastField } from "formik";

/**
 * Wrapper for the Formik Fields
 */
// TODO: Add strong typing
// The line below is currently just a fancy way of saying "any"
// Find a way to properly type this wrapper
type FieldProps = React.ComponentProps<typeof FormikFastField>;
export const Field = (props: FieldProps) => {
  return (
    <FormikFastField
      {...props}
      onKeyDown={(event: KeyboardEvent) => {
        // Handler for basic html inputs to remove focus, if no custom component is passed
        if (event.key === "Enter" || event.key === "Escape") {
          (event.currentTarget as HTMLInputElement).blur();
        }
      }}
    />
  );
};
