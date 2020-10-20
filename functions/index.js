const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.addAdminRole = functions.https.onCall(async (data, context) => {
  // check if request is made by admin.
  if (context.auth.token.admin !== true) {
    return { error: "Only admins can add other admins, sucker" };
  }
  // get user and add custom clain (admin).
  try {
    const user = await admin.auth().getUserByEmail(data.email);
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
    });
    return {
      message: `success! ${data.email} has been made an admin`,
    };
  } catch (error) {
    return error;
  }
});
