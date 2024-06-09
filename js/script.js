const profile = document.querySelector(".overview");
const username = "dbozgen"; 

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
    displayRepos();
};

const displayRepos = async function (repos) {
  const selectedRepos = await fetch (`https://api.github.com/users/${username}/repos?sort=update&per_page=100`);
  const repoData = await selectedRepos.json();
  displayRepos(repoData);


};