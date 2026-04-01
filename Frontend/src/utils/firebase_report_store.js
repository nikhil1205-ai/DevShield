import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import { serverTimestamp } from "firebase/firestore";

export const saveScanToFirebase = async (scanId, SATSresults, DASTresults) => {
  try {
    const user = auth.currentUser;

    if (!user) throw new Error("User not logged in");

    const safeScanId = String(scanId);

    const scanRef = doc(db, "users", user.uid, "scans", safeScanId);

    await setDoc(scanRef, {
      scanId: safeScanId,
      SATSresults: SATSresults || [],
      DASTresults: DASTresults || [],
      createdAt:  serverTimestamp()
    });

    console.log("✅ Scan saved successfully");
  } catch (err) {
    console.error("❌ Firebase Error:", err);
  }
};