# python-mchess

![Alpha status](https://img.shields.io/badge/Project%20status-Alpha-red.svg)

`python-mchess` is a collections of libraries to work with Millennium's Chess Genius Exclusive chess board via the Chess Link interface.

It provides two layers of functionality:
* A hardware driver for the Chess Genius Exclusive chess board, supporting piece recognition and leds via USB or Bluetooth LE
* A sample implementation to connect arbitrary UCI engines to the chess board.

Currently, the following platforms are under development:

|              | Linux | Raspberry Pi | macOS | Windows
|--------------|-------|--------------|-------|--------
| USB          |    x  |     x        |   x   |    x
| Bluetooth LE |    x  |     x        |       | 


## Alpha installation instructions

Warning! This project is under development, and basically everything described below will change at some point.

### Dependencies
`python-mchess` is written for Python 3.x

`python-mchess` board driver for Chess Link depends on `PySerial` and (Linux/Raspberry Pi only) `BluePy`

In order to use UCI engines with mchess, additionally `python-chess` is used.


```bash
pip3 install pyserial [bluepy] [python-chess]
```

Then clone the repository
```bash
git clone https://github.com/domschl/python-mchess
```

Now copy:
```
cd mchess
cp uci_engines.json.default uci_engines.json
```
and edit the paths to valid UCI engines.

Then simply start from console:
```bash
python3 chess_mboard.py
```

This will start chess agents for the chess board, automatically detecting board hardware via USB or BLuetooth LE (Linux, Raspberry PI only), and load the UCI engine (testet with Leela Chess Zero (Lc0) and Stockfish 9).

Note: Bluetooth LE hardware detection requires admin privileges for the one-time intial bluetooth scan. For first time start with Bluetooth LE support, use:
```bash
sudo python3 chess_mboard.py
```
Once the board is found, stop the program and restart without `sudo`. You might want to set ownership for `chess_link_config.json` to your user-account, since the file will be rewritten, if the detected board orientation is changed.

![Console mchess](https://raw.github.com/domschl/python-mchess/master/images/MchessAlpha.png)

## Architecture
```
                                +--------------------+
                                |   chess_mboard.py  |   Start and connect agents
                                +--------------------+
                                   |     |     |
                        +----------+     |     +---------+
                        |                |               |
         +---------------------+  +--------------+  +-------------------+
         | chess_link_agent.py |  | uci_agent.py |  | terminal_agent.py |   agents represent
         +---------------------+  +--------------+  +-------------------+   player activities 
                        |            uci-engines         I/O hardware
                        |            Stockfish,
                        |            Lc0 etc.                
 -  -  -  -  -  -  -  - | -  -  -  -  -  -  -  -  -  -  -  -
               +---------------+
               | chess_link.py |           Python 3 chess link library, can be
               +---------------+           reused for other projects without agents above
                  |         |
  +-------------------+  +----------------------+
  | chess_link_usb.py |  | chess_link_bluepy.py |
  +-------------------+  +----------------------+
         Chess Genius Exclusive board hardware
         via Chess Link
```
## Documentation

[API Documentation](https://domschl.github.io/python-mchess/doc/build/html/index.html) (incomplete!)
