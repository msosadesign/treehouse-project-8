const randomUsersUrl =
  "https://randomuser.me/api/?results=12&nat=us,gb,es&inc=name,email,location,cell,dob,picture";
const gridContainer = document.getElementsByClassName("grid-layout")[0];
const modal = document.getElementById("modal");
const closeOverlayButton = document.getElementById("close-overlay");
const changeRight = document.getElementById("change-right");
const changeLeft = document.getElementById("change-left");
const searchUser = document.getElementById("search-user");

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
    const address = `${userObj.location.street.number} ${userObj.location.street.name}, ${userObj.location.state} ${userObj.location.postcode}`;
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
  const previousUser = users[i - 1];
  const nextUser = users[i + 1];

  if (toLeft) {
    if (previousUser) {
      updatePopup(previousUser);

      // Shows button when previous user is available
      if (users[i]) {
        changeRight.style.display = "flex";
      }
    }

    // Removes button when reaching limit
    if (!users[i - 2]) {
      changeLeft.style.display = "none";
    }
  } else if (!toLeft) {
    if (nextUser) {
      updatePopup(nextUser);

      // Shows button when next user is available
      if (users[i]) {
        changeLeft.style.display = "flex";
      }
    }

    // Removes button when reaching limit
    if (!users[i + 2]) {
      changeRight.style.display = "none";
    }
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
    let i = 0;

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
    card.addEventListener("click", () => {
      // If the cards are limits, hide change buttons
      if (data.indexOf(user) == 0) {
        changeLeft.style.display = "none";
      }

      if (data.indexOf(user) == data.length - 1) {
        changeRight.style.display = "none";
      }

      openPopup(user);
    });
  });
  return data;
}

// Event Listeners

searchUser.addEventListener("input", (e) => {
  const input = e.target.value;
  const cards = document.getElementsByClassName("user-card");

  // Helps refreshing the list when any input occurs
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    card.style.display = "grid";
  }

  // If input inserted matches any name, otherwise hide it
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const name = card.getElementsByTagName("h2")[0].textContent;
    if (
      input.slice(0, input.length).toLowerCase() !==
      name.slice(0, input.length).toLowerCase()
    ) {
      card.style.display = "none";
    }
  }
});

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
