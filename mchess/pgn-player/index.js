const WebSocket = require('ws');

const url = 'ws://192.168.10.51:8001/ws';
const connection = new WebSocket(url);
const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const fs = require('fs');
const path = require('path');

function loadRandomPGN() {
  const files = fs.readdirSync(path.join(process.cwd(), '/python-mchess/mchess/pgn-player/pgn'));

  const max = files.length - 1;
  const min = 0;

  const index = Math.round(Math.random() * (max - min) + min);
  const file = files[index];

  console.log('Random PGN is', file);

  try {
    return fs.readFileSync(path.join(process.cwd(), '/python-mchess/mchess/pgn-player/pgn', file), 'utf8');
  } catch (err) {
    console.error(err);
  }
}

const delta = 500;
let lastKeypressTime = 0;
const doubled = false;

process.stdin.on('keypress', (str, key) => {
  let thisKeypressTime = new Date();
  console.log(`${thisKeypressTime - lastKeypressTime}`);

  if (thisKeypressTime - lastKeypressTime <= delta) {
    var doubled = true;
    // optional - if we'd rather not detect a triple-press
    // as a second double-press, reset the timestamp
    thisKeypressTime = 0;
  }
  lastKeypressTime = thisKeypressTime;

  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    if (key.name === '1') {
      moveBackward();
    } else if (key.name === '3') {
      moveForward();
    } else if (key.name === '2') {
      loadPGN();
      if (doubled == true) {
        console.log('Move Start');
        move_start();
      }
    }
    console.log(`You pressed the "${key.name}" key`);
  }
});
console.log('Press any key...');

connection.onopen = () => {
  console.log('opened');
};

connection.onerror = (error) => {
  console.log(`WebSocket error: ${JSON.stringify(error)}`);
};

function loadPGN() {
  connection.send(JSON.stringify({
    cmd: 'import_pgn',
    pgn: loadRandomPGN(),
    actor: 'WebAgent',
  }));
}

function move_start() {
  connection.send(JSON.stringify({
    cmd: 'move_start',
    actor: 'WebAgent',
  }));
}
function moveForward() {
  connection.send(JSON.stringify(
    {
      cmd: 'move_forward',
      actor: 'WebAgent',
    },
  ));
}

function moveBackward() {
  connection.send(JSON.stringify(
    {
      cmd: 'move_back',
      actor: 'WebAgent',
    },
  ));
}
