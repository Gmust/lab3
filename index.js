const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const searchGitHubRepos = async (query) => {
    try {
        const response = await axios.get(`https://api.github.com/search/repositories?q=${query}`);
        return response.data.items.map((repo, index) => ({
            id: index + 1,
            name: repo.full_name,
            description: repo.description || 'N/A',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            language: repo.language || 'N/A'
        }));
    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        return [];
    }
};

const displayRepoList = (repos) => {
    repos.forEach(repo => {
        console.log(`${repo.id}. ${repo.name}`);
    });
};

const displayRepoInfo = (repo) => {
    console.log(`Name: ${repo.name}`);
    console.log(`Description: ${repo.description}`);
    console.log(`Stars: ${repo.stars}`);
    console.log(`Forks: ${repo.forks}`);
    console.log(`Language: ${repo.language}`);
    console.log(`URL: ${repo.url}`);
};

rl.question('Enter text to search GitHub repositories: ', (query) => {
    searchGitHubRepos(query).then(repos => {
        if (repos.length === 0) {
            console.log('No repositories found.');
            rl.close();
            return;
        }

        console.log('GitHub repositories:');
        displayRepoList(repos);

        rl.question('Enter the ID of the repository to view details (or type "exit" to quit): ', (id) => {
            if (id === 'exit') {
                rl.close();
                return;
            }

            const selectedRepo = repos.find(repo => repo.id === parseInt(id));
            if (selectedRepo) {
                console.log('Details of the selected repository:');
                displayRepoInfo(selectedRepo);
            } else {
                console.log('Invalid repository ID.');
            }

            rl.close();
        });
    });
});
