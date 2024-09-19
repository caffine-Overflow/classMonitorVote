// Access the elements
const form = document.getElementById("classMonitor");
const studentName = document.getElementById("studentName");
const choose = document.getElementById("choose");
const totalVoteSpan = document.querySelector(".totalVote");  // For overall total votes
const monitorVotesContainer = {};  // A container to hold each monitor's list of voters

// Axios API endpoint (replace with your crudcrud endpoint)
const crudcrudEndpoint = "https://crudcrud.com/api/a4a1149c51034ea1a9e92332419700b7/voteApp";

// Monitor vote containers (dynamically added)
const monitorSection = {
    option1: document.createElement('div'),
    option2: document.createElement('div'),
    option3: document.createElement('div')
};

document.body.appendChild(monitorSection.option1);
document.body.appendChild(monitorSection.option2);
document.body.appendChild(monitorSection.option3);

// Set monitor names and labels
monitorSection.option1.innerHTML = "<h2>Suhana</h2><ul class='votes-list'></ul><span class='vote-count'>Total Votes: 0</span>";
monitorSection.option2.innerHTML = "<h2>Deepak</h2><ul class='votes-list'></ul><span class='vote-count'>Total Votes: 0</span>";
monitorSection.option3.innerHTML = "<h2>Abhi</h2><ul class='votes-list'></ul><span class='vote-count'>Total Votes: 0</span>";

// Form submission event
form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Create a new vote object
    const newVote = {
        studentName: studentName.value,
        votedFor: choose.value
    };

    // Send the vote to crudcrud using POST
    axios.post(crudcrudEndpoint, newVote)
        .then((response) => {
            // Display the vote under the selected monitor
            displayVote(response.data);
            // Clear the form input
            studentName.value = "";
            // Update total votes for that monitor and overall total votes
            updateMonitorVotes(response.data.votedFor);
            updateTotalVotes();
        })
        .catch(error => console.log("Error:", error));
});

// Function to display the vote under the selected monitor
function displayVote(vote) {
    const monitorDiv = monitorSection[vote.votedFor];
    const voteList = monitorDiv.querySelector('.votes-list');

    const li = document.createElement('li');
    li.innerHTML = `${vote.studentName} <button class="delete-btn">Delete</button>`;
    voteList.appendChild(li);

    // Add delete functionality
    li.querySelector('.delete-btn').addEventListener('click', () => deleteVote(vote, li));
}

// Function to update total votes for a monitor
function updateMonitorVotes(monitor) {
    axios.get(crudcrudEndpoint)
        .then((response) => {
            const votes = response.data.filter(vote => vote.votedFor === monitor);
            const monitorDiv = monitorSection[monitor];
            const voteCountSpan = monitorDiv.querySelector('.vote-count');
            voteCountSpan.textContent = `Total Votes: ${votes.length}`;
        })
        .catch((error) => console.log("Error fetching votes:", error));
}

// Function to update the overall total votes across all monitors
function updateTotalVotes() {
    axios.get(crudcrudEndpoint)
        .then((response) => {
            const totalVotes = response.data.length;
            totalVoteSpan.textContent = `Total Votes: ${totalVotes}`;  // Update the total vote count below the heading
        })
        .catch((error) => console.log("Error updating total votes:", error));
}

// Function to delete a vote
function deleteVote(vote, li) {
    axios.delete(`${crudcrudEndpoint}/${vote._id}`)
        .then(() => {
            li.remove();  // Remove the student's name from the list
            updateMonitorVotes(vote.votedFor);  // Update the total votes for the monitor
            updateTotalVotes();  // Update the overall total votes
        })
        .catch(error => console.log("Error deleting vote:", error));
}

// Load votes when the page loads
window.addEventListener("DOMContentLoaded", () => {
    axios.get(crudcrudEndpoint)
        .then(response => {
            const votes = response.data;
            votes.forEach(vote => {
                displayVote(vote);
                updateMonitorVotes(vote.votedFor);
            });
            updateTotalVotes();  // Update the overall total votes on page load
        })
        .catch(error => console.log("Error loading votes:", error));
});
