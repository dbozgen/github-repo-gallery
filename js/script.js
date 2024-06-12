const profile = document.querySelector(".overview");
const username = "dbozgen"; 
const repoList = document.querySelector(".repo-list");
const allRepos = document.querySelector(".repos");
const repoDataContainer = document.querySelector(".repo-data");
const backButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const gitProfile = async function(){
    const responseData = await fetch (`https://api.github.com/users/${username}`);
    const data = await responseData.json();
    DisplayUserInfo(data);
};

gitProfile();

const DisplayUserInfo  = function(data){
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML =`
        <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>`; 
    profile.append(div);
    readyRepos();
};

const readyRepos = async function () {
  const selectedRepos = await fetch (`https://api.github.com/users/${username}/repos?sort=update&per_page=100`);
  const repoData = await selectedRepos.json();
  displayRepos (repoData);
};

const displayRepos = function (repos) {
  filterInput.classList.remove("hide");

  for (const repo of repos) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`; 
    repoList.append(repoItem);
  }
};

repoList.addEventListener("click", function(e){
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText; 
    specificRepoInfo(repoName);
  }
});

const specificRepoInfo = async function(repoName){
  const pullRepoData = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
  const repoInfo = await pullRepoData.json();
  console.log(repoInfo);
  const fetchLanguages = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`);
  const languageData = await fetchLanguages.json();
  console.log(languageData);
  const languages = [];
  for (const language in languageData){
    languages.push(language);
  }; 
  console.log(languages);
  showSpecificRepo(repoInfo, languages);
};

const showSpecificRepo = function(repoInfo, languages){
  repoDataContainer.innerHTML = "";
  const div = document.createElement("div");
  div.innerHTML =`
  <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
  repoDataContainer.append(div);
  repoDataContainer.classList.remove("hide");
  allRepos.classList.add("hide");
  backButton.classList.remove("hide");

};

backButton.addEventListener("click", function(){
  allRepos.classList.remove("hide");
  repoDataContainer.classList.add("hide");
  backButton.classList.add("hide");
});

filterInput.addEventListener("input", function(e){
  const searchText = e.target.value;
  const repos = document.querySelectorAll(".repo");
  const searchTextLower = searchText.toLowerCase();
  for (const repo of repos){
    const repoTextLower = repo.innerText.toLowerCase();
    if (repoTextLower.includes(searchTextLower)){
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  }
});