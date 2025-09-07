import { atom } from "jotai";

export const messageAtom = atom<string>("");


export const isEditMessageAtom = atom<boolean>(false);

export const isCreateNewMessageAtom = atom<boolean>(false);
