const randomUsersUrl =
  "https://randomuser.me/api/?results=12&nat=us,gb,es&inc=name,email,location,cell,dob,picture";
const gridContainer = document.getElementsByClassName("grid-layout")[0];
const modal = document.getElementById("modal");
const closeOverlayButton = document.getElementById("close-overlay");
const changeRight = document.getElementById("change-right");
const changeLeft = document.getElementById("change-left");

class Person {
  constructor(name, email, city, phone, address, birthday, img) {
    this.name = name;
    this.email = email;
    this.city = city;
    this.phone = phone;
    this.address = address;
    this.birthday = birthday;
    this.img = img;
  }
}

function checkStatus(res) {
  if (res.ok) {
    return Promise.resolve(res);
  } else {
    return Promise.reject(new Error(res.statusText));
  }
}

async function fetchData(url) {
  const response = await fetch(url);
  const res = await checkStatus(response);
  return res.json();
}

function getUsers(data) {
  const usersArray = data.results;

  const users = usersArray.map((userObj) => {
    const name = `${userObj.name.first} ${userObj.name.last}`;
    const email = userObj.email;
    const city = userObj.location.city;
    const phone = userObj.cell;
    const address = `${userObj.location.street.number} ${userObj.location.street.name}, ${userObj.location.postcode}`;
    const birthday = new Date(userObj.dob.date);
    const img = userObj.picture.large;
    const user = new Person(name, email, city, phone, address, birthday, img);
    return user;
  });

  return users;
}

function switchUser(users, toLeft) {
  const name = document.getElementById("popup-name").textContent;
  const i = users.findIndex((user) => user.name == name);
  if (toLeft) {
    if (users[i - 1]) {
      updatePopup(users[i - 1]);
      if (users[i - 1] === 0) {
        changeLeft.remove();
      }
    }
  } else if (!toLeft) {
    updatePopup(users[i + 1]);
  }
}

function updatePopup(user) {
  const name = document.getElementById("popup-name");
  const email = document.getElementById("popup-email");
  const city = document.getElementById("popup-city");
  const phone = document.getElementById("popup-phone");
  const birthday = document.getElementById("popup-birthday");
  const address = document.getElementById("popup-address");
  const img = document.getElementById("popup-img");

  name.textContent = user.name;
  email.textContent = user.email;
  email.setAttribute("href", `mailto:${user.email}`);
  city.textContent = user.city;
  phone.textContent = user.phone;
  birthday.textContent = `Birthday: ${user.birthday.getDate()}/${user.birthday.getMonth()}/${user.birthday.getFullYear()}`;
  address.textContent = user.address;
  img.setAttribute("src", user.img);
  img.setAttribute("alt", `Picture of ${user.name}`);
}

function openPopup(user) {
  modal.style.display = "flex";

  updatePopup(user);
}

function insertUsers(data) {
  data.forEach((user) => {
    const card = document.createElement("article");
    card.className = "user-card";

    card.innerHTML = `
    <img
    src="${user.img}"
    alt="Image of ${user.name}"
    />
    <h2>${user.name}</h2>
    <a href="mailto:${user.email}">${user.email}</a>
    <p>${user.city}</p>
    `;

    gridContainer.appendChild(card);

    // Add event listener to open popup
    card.addEventListener("click", () => openPopup(user));
  });
  return data;
}

// Event Listeners

// Close overlay

const closeOverlay = () => (modal.style.display = "none");

closeOverlayButton.addEventListener("click", closeOverlay);
modal.addEventListener("click", (e) => {
  if (e.target == modal) {
    closeOverlay();
  }
});

// Fetch data!

fetchData(randomUsersUrl)
  .then(getUsers)
  .then(insertUsers)
  .then((users) => {
    changeRight.addEventListener("click", () => switchUser(users, false));
    changeLeft.addEventListener("click", () => switchUser(users, true));
  })
  .catch((err) => {
    console.error(err);
    gridContainer.innerHTML = `<h2>Error fetching users, please reload the page.</h2>`;
    gridContainer.style.display = "block";
  });
