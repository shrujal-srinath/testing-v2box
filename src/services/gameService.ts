import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"; 
import { db } from "./firebase";
import { BasketballGame } from "../types";

// 1. SUBSCRIBE (Read)
// This listens to the database. When data changes, it calls 'callback'.
export const subscribeToGame = (gameId: string, callback: (data: BasketballGame) => void) => {
  return onSnapshot(doc(db, "games", gameId), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as BasketballGame);
    }
  });
};

// 2. UPDATE (Write)
// This sends specific updates (like score changes) to the cloud.
export const updateGameField = async (gameId: string, fieldPath: string, value: any) => {
  const gameRef = doc(db, "games", gameId);
  await updateDoc(gameRef, {
    [fieldPath]: value
  });
};

// 3. INITIALIZE (Create)
// Creates a blank game if one doesn't exist
export const createGame = async (gameId: string, initialData: BasketballGame) => {
  await setDoc(doc(db, "games", gameId), initialData);
};