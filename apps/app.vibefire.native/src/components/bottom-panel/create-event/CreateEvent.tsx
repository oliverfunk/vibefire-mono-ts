import { CreateEventForm } from "./views/CreateEventForm";
import { CreateEventFromPreviousController } from "./views/CreateEventFromPrevious";

export const CreateEvent = (props: { navString: string }) => {
  const { navString } = props;

  const [create, fromPrevious] = navString.split(",");

  if (fromPrevious) {
    return <CreateEventFromPreviousController />;
  }

  return <CreateEventForm />;
};
