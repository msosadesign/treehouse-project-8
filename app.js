const randomUsersUrl =
  "https://randomuser.me/api/?results=12&nat=us,gb,es&inc=name,email,location,cell,dob,picture";
const gridContainer = document.getElementsByClassName("grid-layout")[0];

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

function insertUsers(data) {
  const usersArray = data.results;
  console.log(usersArray);

  usersArray.forEach((user) => {
    const name = `${user.name.first} ${user.name.last}`;
    const email = user.email;
    const city = user.location.city;
    const img = user.picture.large;

    const article = document.createElement("article");
    article.className = "user-card";

    article.innerHTML = `
    <img
    src="${img}"
    alt="Image of ${name}"
    />
    <h2>${name}</h2>
    <a href="mailto:${email}">${email}</a>
    <p>${city}</p>
    `;

    gridContainer.appendChild(article);
  });
}

fetchData(randomUsersUrl)
  .then(insertUsers)
  .catch((err) => {
    gridContainer.innerHTML = `<h2>Error fetching users, please reload the page.</h2>`;
    gridContainer.style.display = "block";
  });
