const gridContainer = document.getElementById('grid-container');
const randomizeButton = document.getElementById('randomize-button');
const numObstaclesInput = document.getElementById('num-obstacles');
let obstacleCount = 0; 

function generateGrid() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // Add data-index attribute here
      cell.setAttribute('data-index', col + (row * 8) + 1); 

      gridContainer.appendChild(cell);
    }
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setStartAndEndPoints() {
    const cells = gridContainer.querySelectorAll('.cell');
    let startCell, endCell;

    // Randomly select start and end cells
    do {
        const randomStartIndex = getRandomInt(0, cells.length - 1);
        startCell = cells[randomStartIndex];

        const randomEndIndex = getRandomInt(0, cells.length - 1);
        endCell = cells[randomEndIndex];
    } while (startCell === endCell || calculateDistance(startCell, endCell) < 8); // Ensure start and end are sufficiently apart

    // Set start and end markers
    startCell.textContent = 'S';
    endCell.textContent = 'G';
    startCell.classList.add('green');
    endCell.classList.add('red');
}

function setObstacles() {
  const cells = gridContainer.querySelectorAll('.cell');
  const numObstacles = parseInt(numObstaclesInput.value);
  const startCell = gridContainer.querySelector('.green');
  const endCell = gridContainer.querySelector('.red');

  // Find bounding box based on start and end cells
  const startRowIndex = parseInt(startCell.getAttribute('data-index') / 8);
  const startColIndex = startCell.getAttribute('data-index') % 8;
  const endRowIndex = parseInt(endCell.getAttribute('data-index') / 8);
  const endColIndex = endCell.getAttribute('data-index') % 8;

  const minRow = Math.min(startRowIndex, endRowIndex);
  const maxRow = Math.max(startRowIndex, endRowIndex);
  const minCol = Math.min(startColIndex, endColIndex);
  const maxCol = Math.max(startColIndex, endColIndex);

  // Place obstacles randomly within the bounding box
  let obstaclesPlaced = 0;
  while (obstaclesPlaced < numObstacles) {
    const randomIndex = getRandomInt(0, cells.length - 1);
    const cell = cells[randomIndex];
    const cellRowIndex = parseInt(cell.getAttribute('data-index') / 8);
    const cellColIndex = cell.getAttribute('data-index') % 8;

    if (cellRowIndex >= minRow && cellRowIndex <= maxRow &&
        cellColIndex >= minCol && cellColIndex <= maxCol &&
        !cell.classList.contains('green') && 
        !cell.classList.contains('red') && 
        !cell.classList.contains('obstacle')) {

      cell.classList.add('obstacle');
      cell.textContent = obstacleCount + 1; 
      obstaclesPlaced++;
      obstacleCount++; 
    }
  }
}


function calculateDistance(cell1, cell2) {
  const index1 = parseInt(cell1.getAttribute('data-index'));
  const index2 = parseInt(cell2.getAttribute('data-index'));

  const row1 = Math.floor(index1 / 8); 
  const col1 = index1 % 8;
  const row2 = Math.floor(index2 / 8);
  const col2 = index2 % 8;

  const dx = row1 - row2;
  const dy = col1 - col2;

  return Math.sqrt(dx * dx + dy * dy);
}


generateGrid();
setStartAndEndPoints();

randomizeButton.addEventListener('click', () => {
    gridContainer.innerHTML = '';
    obstacleCount = 0; 
    generateGrid();
    setStartAndEndPoints();
    setObstacles(); 
});

// Preset Data (Ensure coordinates are grouped as [row, col] pairs within arrays)
const presets = {
    a: {
        obstacles: [
            [1, 2], [3, 5], [4, 1]
        ],
        start: [1, 2],
        goal: [6, 6]
    },
    b: {
        obstacles: [
            [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], 
            [2, 4], [3, 4], [4, 4], [5, 4], [6, 4]
        ],
        start: [1, 1],
        goal: [8, 8]
    },
    c: {
        obstacles: [
            [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], 
            [2, 4], [3, 4], [4, 4], [5, 4], [6, 4]
        ],
        start: [3, 3],
        goal: [8, 8]
    },
    d: {
        obstacles: [
            [3, 3], [3, 7], [3, 4], [3, 5], [3, 6], 
            [5, 3], [5, 7], [5, 4], [5, 5], [5, 6]
        ],
        start: [2, 1],
        goal: [8, 8]
    }
};

// Function to set a preset scenario
function setPreset(presetName) {
    const preset = presets[presetName];
    console.log('preset:', preset);  
    console.log('preset.obstacles:', preset.obstacles); 

    gridContainer.innerHTML = ''; 
    generateGrid();

    console.log('After grid generation - preset.obstacles:', preset.obstacles); // Check here


    // Add obstacles
  let count = 0; 
  preset.obstacles.forEach(coord => { 
      const [row, col] = coord;

      // Updated cell selection using data-index
      const cell = gridContainer.querySelector(`[data-index="${col + (row * 8) + 1}"]`); 

      cell.classList.add('obstacle'); 
      cell.textContent = count + 1; 
      count++; 
  });

// Set Start 
const [startRow, startCol] = preset.start;
const startCellIndex = startCol + (startRow - 1) * 8;
const startCell = gridContainer.querySelector(`.cell:nth-child(${startCellIndex})`);
startCell.textContent = '';
startCell.textContent = 'S';
startCell.classList.add('green');

// Set Goal 
const [goalRow, goalCol] = preset.goal;
const goalCellIndex = goalCol + (goalRow - 1) * 8;
const goalCell = gridContainer.querySelector(`.cell:nth-child(${goalCellIndex})`);
goalCell.textContent = ''; 
goalCell.textContent = 'G';
goalCell.classList.add('red');

}

function collectGridObstacleData() {
    const obstacles = [];
    const cells = document.querySelectorAll('.cell.obstacle'); 
    cells.forEach(cell => {
        const dataIndex = parseInt(cell.getAttribute('data-index')); 
        const row = Math.floor((dataIndex - 1) / 8);
        const col = (dataIndex - 1) % 8;
        obstacles.push([row+1, col+1]);
    });
    return obstacles;
}

function collectStartData() {
    const startCell = document.querySelector('.cell.green'); // Assuming 'green' marks the start
    if (!startCell) return null; // Handle the case where no start is set

    const dataIndex = parseInt(startCell.getAttribute('data-index')); 
    const row = Math.floor((dataIndex - 1) / 8);
    const col = (dataIndex - 1) % 8;
    return [row+1, col+1];
}

function collectGoalData() {
    const goalCell = document.querySelector('.cell.red'); // Assuming 'red' marks the goal
    if (!goalCell) return null; // Handle the case where no goal is set

    const dataIndex = parseInt(goalCell.getAttribute('data-index'));
    const row = Math.floor((dataIndex - 1) / 8);
    const col = (dataIndex - 1) % 8;
    return [row+1, col+1];
}

// function testPathfinding() {
//     const obstacles = collectGridObstacleData(); 
//     const start = collectStartData();
//     const goal = collectGoalData();

//     fetch('http://127.0.0.1:3000/calculate_path', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ obstacles, start, goal })
// })
// .then(response => {
//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }
//     return response.json();
// })
// .then(data => {
//     if (data.message === 'No path found') {
//         // Display a message to the user (e.g., an alert or update a text element)
//         alert('No path could be found between the start and goal!'); 
//     } else {
//         visualizePath(data);
//     } 
// })
// .catch(error => {
//     console.error('Error:', error);
// });
// }

const postObstaclesEndpoint = 'https://fgakuonqpd.execute-api.ap-south-1.amazonaws.com/postObstacles';
const getRouteEndpoint = 'https://fgakuonqpd.execute-api.ap-south-1.amazonaws.com/getRoute';

// Function to post obstacles 
function postObstacles(obstacles) {
  const start = collectStartData();
  const goal = collectGoalData();
  fetch(postObstaclesEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ obstacles, start, goal }) 
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error posting obstacles');
    }
    // Add specific success handling if needed (e.g., display a message)
  })
  .catch(error => {
    console.error('Error posting obstacles:', error);
    alert('An error occurred while sending obstacles to the server. Please try again.');
  });
}

// Function to calculate and retrieve the route
function calculateRoute() {
  const start = collectStartData();
  const goal = collectGoalData();

  fetch(getRouteEndpoint, {
    method: 'GET', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ start, goal }) 
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error getting route');
    }
    return response.json();
  })
  .then(data => {
    if (data.message === 'No path found') {
      alert('No path could be found between the start and goal!');
    } else {
      visualizePath(data);
    }
  })
  .catch(error => {
    console.error('Error getting route:', error);
    alert('An error occurred while calculating the path. Please check your network connection and try again.');
  });
}


// function testPathfinding() {
//   const obstacles = collectGridObstacleData();
//   const start = collectStartData();
//   const goal = collectGoalData();

//   // API Call Section
//   const apiEndpoint = 'https://your-api-id.execute-api.your-region.amazonaws.com/your-stage/calculate_path'; // Replace with your actual API endpoint

//   fetch(apiEndpoint, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ obstacles, start, goal })
//   })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   })
//   .then(data => {
//     // Handle API response 
//     if (data.message === 'No path found') {
//       alert('No path could be found between the start and goal!');
//     } else {
//       visualizePath(data);
//     }
//   })
//   .catch(error => {
//     console.error('Error:', error);
//     alert('An error occurred while calculating the path. Please check your network connection and try again.');
//   });
// }

function visualizePath(pathData) {
    const path = pathData.path;
    const visited = pathData.visited;

    const gridContainer = document.getElementById('grid-container');  
    const cells = gridContainer.querySelectorAll('.cell'); 

    // Clear existing styles
    cells.forEach(cell => cell.classList.remove('path', 'visited'));

    // Style visited cells (e.g., lighter background)
    visited.forEach(coord => { 
        const [row, col] = coord;
        const cellIndex = (col-1) + ((row-1) * 8) + 1; 
        const cell = gridContainer.querySelector(`[data-index="${cellIndex}"]`);
        cell.classList.add('visited'); 
    });

    // Style path cells (e.g., blue background)
    path.forEach(coord => {
        const [row, col] = coord;
        const cellIndex = (col-1) + ((row-1) * 8) + 1; 
        const cell = gridContainer.querySelector(`[data-index="${cellIndex}"]`);
        cell.classList.add('path'); 
    });

}

let isCreatingObstacles = false;
let obstacles = [];
let startCell = null;
let goalCell = null;

function handleCreateButtonClick() {
    isCreatingObstacles = true;
    obstacles = [];
    startCell = null;
    goalCell = null;

    // Remove existing start, goal, obstacle markers, path, and visited styles
    const cells = gridContainer.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('green', 'red', 'obstacle', 'path', 'visited');
    });

    gridContainer.addEventListener('click', handleCellClick);
}

function handleCellClick(event) {
  if (!isCreatingObstacles) return;

  const cell = event.target.closest('.cell');
  if (!cell) return;

  if (!startCell) {
    startCell = cell;
    cell.textContent = 'S';
    cell.classList.add('green');
  } else if (!goalCell) {
    goalCell = cell;
    cell.textContent = 'G';
    cell.classList.add('red');
  } else {  // Obstacle placement logic
    if (cell.classList.contains('green') || cell.classList.contains('red')) {
      return; // Don't allow overwriting start/goal
    }

    obstacles.push([parseInt(cell.getAttribute('data-index'))]);
    cell.classList.add('obstacle');
  }
}


function showConfirmModal() {
    const confirmModal = document.createElement('div');
    confirmModal.classList.add('confirm-modal');
    confirmModal.innerHTML = `
        <div class="modal-content">
            <h2>Confirm Scenario</h2>
            <p>Choose a preset to save your scenario:</p>
            <div class="preset-buttons">
                <button id="save-preset-a">A</button>
                <button id="save-preset-b">B</button>
                <button id="save-preset-c">C</button>
                <button id="save-preset-d">D</button>
            </div>
            <button id="cancel-confirm">Cancel</button>
        </div>
    `;

    document.body.appendChild(confirmModal);

    const cancelButton = confirmModal.querySelector('#cancel-confirm');
    cancelButton.addEventListener('click', () => {
        confirmModal.remove();
        isCreatingObstacles = false;
        gridContainer.removeEventListener('click', handleCellClick);
    });

    const savePresetButtons = confirmModal.querySelectorAll('.preset-buttons button');
    savePresetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const presetName = button.id.replace('save-preset-', '');
            saveUserScenario(presetName);
            confirmModal.remove();
            isCreatingObstacles = false;
            gridContainer.removeEventListener('click', handleCellClick);
        });
    });
}

function saveUserScenario(presetName) {
  const obstacleCoords = obstacles.map(index => {
    const row = Math.floor((index - 1) / 8);  // No adjustment needed
    const col = (index - 1) % 8;              // No adjustment needed
    return [row + 1, col + 1];                // Add 1 to offset for server
  });

  const startCoord = [
    Math.floor((parseInt(startCell.getAttribute('data-index')) - 1) / 8) + 1, 
    (parseInt(startCell.getAttribute('data-index')) - 1) % 8 + 1          
  ];

  const goalCoord = [
    Math.floor((parseInt(goalCell.getAttribute('data-index')) - 1) / 8) + 1,
    (parseInt(goalCell.getAttribute('data-index')) - 1) % 8 + 1          
  ];

  presets[presetName] = {
    obstacles: obstacleCoords,
    start: startCoord,
    goal: goalCoord
  };
}




// Button Event Listeners (Revised)
document.addEventListener('DOMContentLoaded', function() { // Ensure DOM is loaded
    document.getElementById('button-a').addEventListener('click', () => setPreset('a'));
    document.getElementById('button-b').addEventListener('click', () => setPreset('b'));
    document.getElementById('button-c').addEventListener('click', () => setPreset('c')); 
    document.getElementById('button-d').addEventListener('click', () => setPreset('d'));
    document.getElementById('calculate-path-button').addEventListener('click', () => {
  postObstacles(collectGridObstacleData()); // Post the initial obstacles
  calculateRoute(); // Calculate the route
});
//     document.getElementById('create-button').addEventListener('click', handleCreateButtonClick); 
//     document.getElementById('done-button').addEventListener('click', () => {
//   showConfirmModal();
//   gridContainer.removeEventListener('click', handleCellClick);  
// });

});


