import { atom } from "jotai";

export const userIdAtom = atom();
export const usernameAtom = atom();

export const userInformationAtom = atom((get) => {
  const userId = get(userIdAtom);
  const username = get(usernameAtom);
  return {
    userId,
    username,
  };
});
