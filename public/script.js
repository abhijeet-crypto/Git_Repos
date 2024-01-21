// const {userData} from './constant.js'
let currentPage = 1;
let itemsPerPage = 10;

function displaySelectedRepo() {
  // Get the selected value from the dropdown
  var selectedRepo = document.getElementById("repoSelector").value;

  // Display a message with the selected repository number
  itemsPerPage = selectedRepo;
  // alert("Selected Repository: " + selectedRepo);
}

async function performSearch(event) {
  event.preventDefault();
  var search = document.getElementById("search").value;
  var originalName = search.split(" ").join("");

  const container = document.getElementById("card-body");
  const profileContainer = document.getElementById("profileID");
  const divToRemove = document.getElementById("initial");
  if (divToRemove) {
    divToRemove.remove();
  }
  container.innerHTML = "";
  profileContainer.innerHTML = "";

  const loader = document.createElement("div");
  loader.classList.add("loader");
  container.appendChild(loader);

  const data = await fetchData(originalName);
  const profileData = await fetchProfileData(originalName);
  container.removeChild(loader);

  printProfile(profileData, profileContainer);

  if (data.length === 0) {
    const noRepo = document.createElement("h1");
    noRepo.classList.add("norepo");
    noRepo.textContent = "No Repositories Available";
    container.appendChild(noRepo);
  } else {
    printRepo(data, container, currentPage);
  }
  updatePaginationButtons(data, container);
  event.target.form.reset();
}

// "site_admin": false,
// "name": null,
// "company": null,
// "blog": "",
// "location": null,
// "email": null,
// "hireable": null,
// "bio": null,
// "twitter_username": null,

function printProfile(profileData, profileContainer) {
  const image = document.createElement("img");
  image.classList.add("user-img");
  image.src = profileData?.avatar_url;
  image.alt = "logo";
  profileContainer.appendChild(image);
  const name = document.createElement("div");
  name.classList.add("profilename");
  const name2 = profileData?.name === null ? "" : profileData?.name;
  name.textContent = name2.charAt(0).toUpperCase() + name2.slice(1) ?? "";
  profileContainer.appendChild(name);
  const company1 = document.createElement("div");
  company1.classList.add("profileinfo");
  company1.textContent =
    profileData?.company === null ? "HIII" : "Company: " + profileData?.company;
  const location1 = document.createElement("div");
  location1.classList.add("profileinfo");
  location1.textContent =
    profileData?.location === null ? "" : "Location: " + profileData?.location;
  const emailadderess = document.createElement("div");
  emailadderess.classList.add("profileinfo");
  emailadderess.textContent =
    profileData?.email === null ? "" : "Email: " + profileData?.email;

  const twitter = document.createElement("div");
  twitter.classList.add("profileinfo");
  twitter.textContent =
    profileData?.twitter_username === null
      ? ""
      : "Twitter: " + profileData?.twitter_username;

  profileContainer.appendChild(location1);
  profileContainer.appendChild(company1);
  profileContainer.appendChild(twitter);
}

async function printRepo(data, container, page) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  container.innerHTML = "";
  for (let i = start; i < end && i < data.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    const lang = await fetchLanguage(data[i]?.languages_url);
    const link = data[i]?.html_url;
    // console.log(lang, "data printed");
    // console.log(data, "data printed");

    const header = document.createElement("div");
    header.classList.add("card-header");
    const anchor = document.createElement("a");
    anchor.href = link;
    anchor.classList.add("anchor");
    anchor.textContent = data[i]?.name;
    header.appendChild(anchor);

    const description = document.createElement("div");
    description.classList.add("description");
    description.textContent = data[i]?.description;

    const languageoutside = document.createElement("div");
    languageoutside.classList.add("language-outside");
    for (const language2 in lang) {
      const language = document.createElement("div");
      language.classList.add("language");
      language.textContent = language2;
      languageoutside.appendChild(language);
    }
    card.appendChild(header);
    card.appendChild(description);
    card.appendChild(languageoutside);

    container.appendChild(card);
  }
}

async function fetchData(originalName) {
  try {
    const response = await fetch(
      "https://api.github.com/users/" + originalName + "/repos?per_page=20" // ?per_page=10
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching repository data:", error);
  }
}
async function fetchProfileData(originalName) {
  try {
    const response = await fetch(
      "https://api.github.com/users/" + originalName
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // https://api.github.com/users/abhijeet-crypto
    const profileData2 = await response.json();
    // console.log(profileData2);
    return profileData2;
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }
}

async function fetchLanguage(originalName) {
  try {
    const response = await fetch(originalName);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const languagedata = await response.json();

    return languagedata;
  } catch (error) {
    console.error("Error fetching Languages data:", error);
  }
}

function updatePaginationButtons(data, container) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(data.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("li");
    button.textContent = i;
    button.addEventListener("click", () => {
      currentPage = i;
      printRepo(data, container, currentPage);
      updatePaginationButtons(data, container);
    });

    if (i === currentPage) {
      button.style.backgroundColor = "white";
      button.style.color = "black";
    }

    paginationContainer.appendChild(button);
  }
}
