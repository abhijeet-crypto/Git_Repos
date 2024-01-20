async function performSearch(event) {
  event.preventDefault();
  var search = document.getElementById("search").value;
  var originalName = search.split(" ").join("");
  //   console.log(originalName);

  // profile

  const container = document.getElementById("card-body");

  //   console.log(data);
  container.innerHTML = "";

  const loader = document.createElement("div");
  loader.classList.add("loader");
  container.appendChild(loader);

  const data = await fetchData(originalName);
  const profileData = await fetchProfileData(originalName);
  container.removeChild(loader);

  //    profile
  const profileContainer = document.getElementById("profileID");
  profileContainer.innerHTML = "";
  const image = document.createElement("img");
  image.classList.add("user-img");
  image.src = profileData?.avatar_url;
  image.alt = "logo";
  profileContainer.appendChild(image);
  const name = document.createElement("div");
  name.classList.add("profilename");
  name.textContent =
    profileData?.name.charAt(0).toUpperCase() + profileData?.name.slice(1);
  profileContainer.appendChild(name);

  //   Repository

  if (data.length === 0) {
    const noRepo = document.createElement("h1");
    noRepo.classList.add("norepo");
    noRepo.textContent = "No Repositories Available";
    container.appendChild(noRepo);
  }
  for (let i = 0; i < data.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");

    // console.log(data, "data printed");

    const header = document.createElement("div");
    header.classList.add("card-header");
    header.textContent =
      data[i]?.name.charAt(0).toUpperCase() + data[i].name.slice(1) ??
      "Name Not Available";

    const description = document.createElement("div");
    description.classList.add("description");
    description.textContent =
      data[i]?.description ?? "Description Not Available";

    const language = document.createElement("div");
    language.classList.add("language");
    language.textContent = data[i]?.language ?? "Language Not Available";

    card.appendChild(header);
    card.appendChild(description);
    card.appendChild(language);

    container.appendChild(card);
  }
  event.target.form.reset();
}

async function fetchData(originalName) {
  try {
    const response = await fetch(
      "https://api.github.com/users/" + originalName + "/repos" // ?per_page=10
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
