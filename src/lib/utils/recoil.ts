import { atom } from "recoil";

export const messageAtom = atom<string>({
  key: "message",
  default: "",
});

export const isEditMessageAtom = atom<boolean>({
  key: "isEditMessage",
  default: false,
});

export const isCreateNewMessageAtom = atom<boolean>({
  key: "isCreateNewMessage",
  default: false,
});
