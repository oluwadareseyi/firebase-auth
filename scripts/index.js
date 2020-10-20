const guideList = document.querySelector(".guides");
const loggedOut = document.querySelectorAll(".logged-out");
const loggedIn = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");
const admin = document.querySelectorAll(".admin");

// user UI
const setupUI = async (user) => {
  if (user) {
    // Account info

    // get user bio from db;
    await db
      .collection("users")
      .doc(user.uid)
      .onSnapshot((snapshot) => {
        const userInfo = collectAll(snapshot);
        const html = `
          <div>Logged in as ${user.email}</div>
          <div>Bio: ${userInfo.bio}</div>
          <div class="pink-text">${user.admin ? "Admin User" : ""}</div>
    `;
        accountDetails.innerHTML = html;
      });

    // toggle nav elements
    loggedIn.forEach((link) => (link.style.display = "block"));
    loggedOut.forEach((link) => (link.style.display = "none"));

    // show admin controls if user is admin.
    user.admin && admin.forEach((link) => (link.style.display = "block"));
  } else {
    // hide account info;
    accountDetails.innerHTML = "";

    // toggle nav elements
    loggedIn.forEach((link) => (link.style.display = "none"));
    loggedOut.forEach((link) => (link.style.display = "block"));

    // Hide if not an admin/on logout.
    admin.forEach((link) => (link.style.display = "none"));
  }
};

// get guides and populate;
const setupGuides = (data) => {
  let html = "";
  if (data.length) {
    data.forEach((doc) => {
      const li = `
    <li>
      <div class="collapsible-header grey lighten-4">${doc.title}</div>
      <div class="collapsible-body white">${doc.content}</div>
    </li>
    `;
      html += li;
    });

    guideList.innerHTML = html;
  } else {
    guideList.innerHTML = `<h5 class="center-align">Login to view guides</h5>`;
  }
};

// setup materialize components
document.addEventListener("DOMContentLoaded", () => {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});
