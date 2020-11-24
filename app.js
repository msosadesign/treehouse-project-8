const randomUsersUrl =
  "https://randomuser.me/api/?results=12&nat=us,gb,es&inc=name,email,location,cell,dob,picture";
const gridContainer = document.getElementsByClassName("grid-layout")[0];
const modal = document.getElementById("modal");
const closeOverlayButton = document.getElementById("close-overlay");

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

function openPopup(userData) {
  const name = document.getElementById("popup-name");
  const email = document.getElementById("popup-email");
  const city = document.getElementById("popup-city");
  const phone = document.getElementById("popup-phone");
  const birthday = document.getElementById("popup-birthday");
  const address = document.getElementById("popup-address");
  const img = document.getElementById("popup-img");

  modal.style.display = "flex";

  name.textContent = userData.name;
  email.textContent = userData.email;
  email.setAttribute("href", `mailto:${userData.email}`);
  city.textContent = userData.city;
  phone.textContent = userData.phone;
  birthday.textContent = `Birthday: ${userData.birthday.getDate()}/${userData.birthday.getMonth()}/${userData.birthday.getFullYear()}`;
  address.textContent = userData.address;
  img.setAttribute("src", userData.img);
  img.setAttribute("alt", `Picture of ${userData.name}`);
}

function insertUsers(data) {
  const usersArray = data.results;

  usersArray.forEach((userObj) => {
    const name = `${userObj.name.first} ${userObj.name.last}`;
    const email = userObj.email;
    const city = userObj.location.city;
    const phone = userObj.cell;
    const address = `${userObj.location.street.number} ${userObj.location.street.name}, ${userObj.location.postcode}`;
    const birthday = new Date(userObj.dob.date);
    const img = userObj.picture.large;
    const userData = new Person(
      name,
      email,
      city,
      phone,
      address,
      birthday,
      img
    );

    const card = document.createElement("article");
    card.className = "user-card";

    card.innerHTML = `
    <img
    src="${userData.img}"
    alt="Image of ${userData.name}"
    />
    <h2>${userData.name}</h2>
    <a href="mailto:${userData.email}">${userData.email}</a>
    <p>${userData.city}</p>
    `;

    gridContainer.appendChild(card);

    // Add event listener to open popup
    card.addEventListener("click", () => openPopup(userData));
  });
}

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
  .then(insertUsers)
  .catch((err) => {
    console.error(err);
    gridContainer.innerHTML = `<h2>Error fetching users, please reload the page.</h2>`;
    gridContainer.style.display = "block";
  });
