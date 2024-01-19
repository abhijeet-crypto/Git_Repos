async function performSearch(event) {
  event.preventDefault();
  var search = document.getElementById("search").value;
  var originalName = search.split(" ").join("");
  console.log(originalName);
  const data = await fetchData(originalName);
  const container = document.getElementById("card-body");
  //   console.log(data);

  for (let i = 0; i < data.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");

    console.log(data, "data printed");

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
}

async function fetchData(originalName) {
  try {
    const response = await fetch(
      "https://api.github.com/users/" + originalName + "/repos?per_page=10"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
