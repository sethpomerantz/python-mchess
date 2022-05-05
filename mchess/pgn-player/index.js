const WebSocket = require('ws')
const url = 'ws://127.0.0.1:8001/ws'
var connection = new WebSocket(url)
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);



const fs = require("fs");
const path = require("path");





function loadRandomPGN() {

    const files = fs.readdirSync(path.join(process.cwd(), "pgn"));


    let max = files.length - 1;
    let min = 0;

    let index = Math.round(Math.random() * (max - min) + min);
    let file = files[index];

    console.log("Random file is", file);

    try {
      const data = fs.readFileSync(path.join(process.cwd(),'pgn',file), 'utf8')
      return data;
    } catch (err) {
      console.error(err)
    }

}





process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {

    if (key.name === 'left') {
        moveBackward();
    } else if (key.name === 'right') {
        moveForward();
    } else if (key.name === 'down') {
        loadPGN();
    }
    console.log(`You pressed the "${key.name}" key`);
  }
});
console.log('Press any key...');


connection.onopen = () => {
    console.log('opened'); 
}
 
connection.onerror = (error) => {
  console.log(`WebSocket error: ${JSON.stringify(error)}`)
}
 

function loadPGN(data) {
          connection.send(JSON.stringify({
                  "cmd": "import_pgn",
                  "pgn": loadRandomPGN(), 
                  "actor": "WebAgent"
                }                ))
}


function moveForward() {
    connection.send(JSON.stringify(
        {
          "cmd": "move_forward",
          "actor": "WebAgent"
        }
    ))
}

function moveBackward() {
    connection.send(JSON.stringify(
        {
          "cmd": "move_back",
          "actor": "WebAgent"
        }
    ))
}