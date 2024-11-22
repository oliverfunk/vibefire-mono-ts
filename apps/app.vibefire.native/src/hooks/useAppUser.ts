import { useAtomValue } from "jotai";

import { userAtom } from "!/atoms";

export const useAppUser = () => {
  return useAtomValue(userAtom);
};
