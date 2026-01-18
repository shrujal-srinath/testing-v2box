import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"; // Added getDoc
import { db } from "./firebase";
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

// UPDATED: Only create if it doesn't exist!
export const createGame = async (gameId: string, initialData: BasketballGame) => {
  const gameRef = doc(db, "games", gameId);
  const docSnap = await getDoc(gameRef);

  if (!docSnap.exists()) {
    await setDoc(gameRef, initialData);
  } else {
    console.log("Game already exists, skipping creation.");
  }
};