import admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";
import rawServiceAccount from "../../mear-blogging-firebase-adminsdk-fbsvc-4c90cef65c.json";

const serviceAccount = rawServiceAccount as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
