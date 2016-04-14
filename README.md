# Acceptor Driver

----
## How it Works?

This piece of software takes the information from a Bill Acceptor and send it to a web interface.

It contains:

* Serial parcer - Hardware Controller (Python)
* Webserver - Main App (NodeJs)
* Website - GUI (HTML - JS)


The serial parser send requests to bill acceptor,takes the response back and parse it, extrating the Status of the device and the credit incerted.

Usually each bill have to pass over the 4 states:

* **Acepting:** In this point the bill is in his first state, and the credit will be set to 0
* **Escrowed:** In this point the bill is being dragged for the bill acceptor, in this point the credit will be the value for the inserted bill.
* **Stacked Idling:** In this point the bill is staked into the machine
* **Idling:** in this point the process of accepting the bill is finished, the credit will be the value of the bill.


## Usage

The hardware controller use the **sys.stdout** to send the state and the credit to the NodeJS App in a json string, with keys **"status"** and **"credit"**.

To grab that information the NodeJS app **_(app.js)_** use the following instructions:

```javascript
var spawn = require('child_process').spawn,
ls = spawn('python',['main.py', "/dev/ttyUSB0"]);

```

The first line calls the package **child_process** and the second one start the python driver **_(main.py)_** following the sintaxis descrived [here](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options), and connect his output with the app.   

```javascript
ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
    io.emit('credit', { credit: data.toString() });
});

```

The function abobe is the callback executed every time that the driver sends data. In this case it send the data to the browser **_(index.html)_** using sockets.

## Notes:

* The simulator contains an smallmodification, in the line 288 to 291 of the file **acceptor.py**, that to give it time to read the complete buffer.

```python
                while ser.inWaiting() > 0:
                    serial_in += ser.read(1)
                    time.sleep(0.01)  # this line is the modification!

```