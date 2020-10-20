// close modal utility function
const closeModal = (selector) => {
  const modal = document.querySelector(selector);
  M.Modal.getInstance(modal).close();
};

// utility function to collect data
const collectAll = (doc) => {
  return { ...doc.data(), id: doc.id };
};

// add admin cloud function.
const adminForm = document.querySelector(".admin-actions");
adminForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { value: email } = document.querySelector("#admin-email");

  const addAdminRole = functions.httpsCallable("addAdminRole");
  const res = await addAdminRole({ email });
  console.log(res);
});

// get data;
const getGuides = async () => {
  await db.collection("guides").onSnapshot((snapshot) => {
    setupGuides(snapshot.docs.map(collectAll));
  });
};

// listen for auth state changes.
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const token = await user.getIdTokenResult();
    user.admin = token.claims.admin;
    setupUI(user);
    getGuides();
  } else {
    setupUI();
    setupGuides([]);
  }
});

// create new guide;
const createForm = document.querySelector("#create-form");

createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { value: title } = createForm["title"];
  const { value: content } = createForm["content"];

  try {
    await db.collection("guides").add({
      title,
      content,
    });

    // close modal and reset form.
    closeModal("#modal-create");
    createForm.reset();
  } catch (error) {
    alert("Creating guide failed", error.message);
  }
});

//
//
// sign up handler
const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  //   get user info, destructure the value and reassign it.
  const { value: email } = signupForm["signup-email"];
  const { value: password } = signupForm["signup-password"];
  const { value: bio } = signupForm["signup-bio"];

  try {
    // sign up the user.
    const cred = await auth.createUserWithEmailAndPassword(email, password);

    // create user document.
    await db.collection("users").doc(cred.user.uid).set({
      email,
      bio,
    });

    closeModal("#modal-signup");
    signupForm.reset();
    signupForm.querySelector(".error").innerHTML = "";
  } catch (error) {
    signupForm.querySelector(".error").innerHTML = error.message;
  }
});

// logout handler;
const logout = document.querySelector("#logout");

logout.addEventListener("click", async (e) => {
  e.preventDefault();
  await auth.signOut();
});

// login handler.
const login = document.querySelector("#login-form");

login.addEventListener("submit", async (e) => {
  e.preventDefault();

  //   get user info, destructure the value and reassign it.
  const { value: email } = login["login-email"];
  const { value: password } = login["login-password"];

  try {
    // sign up the user.
    await auth.signInWithEmailAndPassword(email, password);
    // close modal and reset form
    closeModal("#modal-login");
    login.querySelector(".error").innerHTML = "";
    login.reset();
  } catch (error) {
    login.querySelector(".error").innerHTML = error.message;
  }
});
