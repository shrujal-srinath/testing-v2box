import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"; 
import { db } from "./firebase";
// FIXED LINE BELOW: Added 'type' keyword
import type { BasketballGame } from "../types";

export const subscribeToGame = (gameId: string, callback: (data: BasketballGame) => void) => {
  return onSnapshot(doc(db, "games", gameId), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as BasketballGame);
    }
  });
};

export const updateGameField = async (gameId: string, fieldPath: string, value: any) => {
  const gameRef = doc(db, "games", gameId);
  await updateDoc(gameRef, {
    [fieldPath]: value
  });
};

export const createGame = async (gameId: string, initialData: BasketballGame) => {
  await setDoc(doc(db, "games", gameId), initialData);
};