const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// To serve static files
app.use(express.static('public'));

// URLs
//// Main page (Listener for device events)
app.get('/', (request, response) => {
    response.sendFile(__dirname+'/views/index.html');
});

//// Device page (emits device events)
app.get('/device', (request, response) => {
    response.sendFile(__dirname+'/views/device.html');
});

io.on('connection', (client) => {

    // When a listener connects
    client.on('createRoom', (roomID) => {
       client.roomID = roomID;
       client.join(roomID);
       console.log(`Room ${client.roomID} created`);
    });

    // When a device connects
    client.on('enterRoom', (roomID) => {
        client.roomID = roomID;
        console.log(Buffer.from("abc"));
    });

    client.on('disconnect', () => {
        io.to(client.roomID).emit('disconnected', {clientId: client.id});
    });

    client.on('deviceAccelerometerUpdate', (accelerometerData) => {
        io.to(client.roomID).emit('accelerometerData', accelerometerData);
    });

    client.on('deviceOrientationChange', (orientationAngle) => {
        io.to(client.roomID).emit('orientationAngle', orientationAngle);
    });
});

// To start server
/// const port = process.env.PORT;      // For glitch
const port = process.argv[2] || 8000;
server.listen(port, () => {
    console.log(`Listening on ${port}`);
});