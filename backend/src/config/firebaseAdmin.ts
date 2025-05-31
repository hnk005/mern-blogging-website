import admin from "firebase-admin";

export const initAminFireBase = () => {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_ADMIN_CREDENTIAL, "base64").toString(
      "utf8"
    )
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return admin;
};
