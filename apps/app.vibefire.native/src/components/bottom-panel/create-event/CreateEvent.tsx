import { CreateEventForm } from "./views/CreateEventForm";
import { CreateEventFromPreviousController } from "./views/CreateEventFromPrevious";

export const CreateEvent = (props: { fromPrevious: boolean }) => {
  const { fromPrevious } = props;

  if (fromPrevious) {
    return <CreateEventFromPreviousController />;
  }

  return <CreateEventForm />;
};
