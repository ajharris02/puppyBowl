/*             Feel free to use this skeleton I have provided or delete everything and do your own thing!             */

//If you would like to, you can create a variable to store the API_URL here.
//This is optional. if you do not want to, skip this and move on.

/////////////////////////////
/*This looks like a good place to declare any state or global variables you might need*/
let players = [];
let singlePlayer = null;
let teams = [];
let selectedPlayerId = null;
const playersInBowl = document.querySelector("#listOfPlayers");
const singlePlayerDiv = document.querySelector("#details");
const selectPlayerDiv = document.querySelector("#selectPlayer");
const puppyForm = document.querySelector("#puppyForm");
const teamSelect = document.querySelector("#teamSelect");
////////////////////////////

/**
 * Fetches all players from the API.
 * This function should not be doing any rendering
 * Instead, this function should be keeping our state up to date
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(
      "https://fsa-puppy-bowl.herokuapp.com/api/2605-Antonio/players",
    );
    const result = await response.json();
    players = result.data.players;
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

playersInBowl.addEventListener("click", async (event) => {
  if (event.target.classList.contains("playerName")) {
    selectedPlayerId = event.target.dataset.playerid;

    const previousHighlight = document.querySelector(".playerName.highlighted");

    if (previousHighlight) {
      previousHighlight.classList.remove("highlighted");
    }

    event.target.classList.add("highlighted");

    await fetchSinglePlayer(selectedPlayerId);
    console.log(singlePlayer);
    render();
  }
});

const fetchAllTeams = async () => {
  try {
    const response = await fetch(
      "https://fsa-puppy-bowl.herokuapp.com/api/2605-Antonio/teams",
    );
    const result = await response.json();
    teams = result.data.teams;
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Fetches a single player from the API.
 * This function should not be doing any rendering
 * Instead, this function should be keeping our state up to date
 * @param {number} playerId
 */
/**
 * Note: In order to call fetchSinglePlayer() a player's id is required.
 * Unless we know the id of the player we are trying to fetch, we cannot call fetchSinglePlayer()
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(
      `https://fsa-puppy-bowl.herokuapp.com/api/2605-Antonio/players/${playerId}`,
    );
    const { data } = await response.json();
    singlePlayer = data.player;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Adds a new player to the roster via the API.
 * Once a player is added to the database, the new player
 * should appear in the all players page without having to refresh
 * @param {Object} newPlayer the player to add
 */
/* Note: we need data from our user to be able to add a new player
 * What does that sound like we need?
 */
/**
 * Note#2: addNewPlayer() expects you to pass in a
 * new player object when you call it. How can we
 * create a new player object and then pass it to addNewPlayer()?
 */

const addNewPlayer = async (newPlayer) => {
  try {
    const response = await fetch(
      "https://fsa-puppy-bowl.herokuapp.com/api/2605-Antonio/players/",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newPlayer),
      },
    );
    const result = await response.json();
    if (!result.success) {
      console.log(result.error);
      return;
    }
    console.log(response.status);
    console.log(result);
    players.push(result.data.newPlayer);
  } catch (error) {
    console.log(error);
  }
};
puppyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(puppyForm);
  const newPlayer = {
    name: formData.get("pName"),
    breed: formData.get("breed"),
    status: formData.get("status"),
    imageUrl: formData.get("imageUrl"),
    teamId: formData.get("teamId"),
  };
  console.log("New Player:", newPlayer);
  await addNewPlayer(newPlayer);
  console.log(newPlayer);

  render();
});

/**
 * Removes a player from the roster via the API.
 * Once the player is removed from the database,
 * the player should also be removed from our view without refreshing
 * @param {number} playerId the ID of the player to remove
 */
/**
 * Note: In order to call removePlayer() a player's id is required.
 * Unless we know the id of the player we are trying to remove, we cannot call removePlayer()
 */

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(
      `https://fsa-puppy-bowl.herokuapp.com/api/2605-Antonio/players/${playerId}`,
      {
        method: "DELETE",
      },
    );
    players = players.filter((player) => {
      return Number(player.id) !== Number(playerId);
    });
    singlePlayer = null;
  } catch (error) {
    console.log(error);
  }
};
singlePlayerDiv.addEventListener("click", async (event) => {
  if (event.target.classList.contains("deleteButton")) {
    await removePlayer(event.target.dataset.singleplayerid);
    render();
  }
});
/**
 * Updates html to display a list of all players or a single player page.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player in the all player list is displayed with the following information:
 * - name
 * - image (with alt text of the player's name)
 *
 * Additionally, for each player we should be able to:
 * - See details of a single player. The page should show
 *    specific details about the player clicked such as: name, id, breed, status, image, and team or unassigned if no team
 * - Remove from roster. When a button is clicked, should remove the player
 *    from the database and our current view without having to refresh
 *
 */
const render = () => {
  const playerHTML = players.map((player) => {
    return `
    <div class="listOfPlayers"> 
     <img class="photo" src="${player.imageUrl}"alt="${player.name}"/>
    <h2 class="playerName" data-playerId=${player.id}>${player.name}</h2>
    </div>
    `;
  });
  playersInBowl.innerHTML = playerHTML.join("");

  const teamHTML = teams.map((team) => {
    return `
    <option value=${team.id}> ${team.name}</option>
    `;
  });
  teamSelect.innerHTML =
    `<option value="">Select a Team</option>` + teamHTML.join("");

  if (!singlePlayer) {
    selectPlayerDiv.innerHTML = "Please Select Player Name to View Details.";
    singlePlayerDiv.innerHTML = "";
  } else {
    selectPlayerDiv.innerHTML = "";
    singlePlayerDiv.innerHTML = `
  <div>
  <h2 class="playerName"><strong>Name:</strong> ${singlePlayer.name}</h2>
  <h2 class="playerId"><strong>Id:</strong>  ${singlePlayer.id}</h2>
  <h2 class="playerBreed"><strong>Breed:</strong> ${singlePlayer.breed}</h2>
  <h2 class="playerStatus"><strong>Status:</strong> ${singlePlayer.status}</h2>
  <img class="playerPhoto" src=${singlePlayer.imageUrl || ""} alt=${singlePlayer.name}/>
  <h2 class="playerTeamName"><strong>Team:</strong>  ${singlePlayer.team ? singlePlayer.team.name : "Unassigned"}</h2>
  <br />
  <button class="deleteButton" data-singlePlayerId=${singlePlayer.id}>Delete</button>
  </div>`;
  }
};

/**
 * Initializes the app by calling render
 * HOWEVER....
 */
const init = async () => {
  await fetchAllPlayers();
  await fetchAllTeams();
  render();
};

init();
