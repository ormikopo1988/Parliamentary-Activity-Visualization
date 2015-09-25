var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  fs = require('fs'),
  mysql = require('mysql'),
  url = require('url'),
  connectionsArray = [],
  /*connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
	database: 'wordpress',
    port: 3306
  }),*/
  POLLING_INTERVAL = 20000,
  pollingTimer,
  flag = 0,
  id_prev;
  
var db_config = {
	host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'wordpress',
	port: 3306
};

var connection;

function handleDisconnect() {
	connection = mysql.createConnection(db_config); // Recreate the connection, since
													// the old one cannot be reused.
													
	connection.connect(function(err) {              // The server is either down
		if(err) {                                     // or restarting (takes a while sometimes).
			console.log('error when connecting to db:', err);
			setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
		}                                     // to avoid a hot loop, and to allow our node script to
	});                                     // process asynchronous requests in the meantime.
					  // If you're also serving http, display a 503 error.
	connection.on('error', function(err) {
		console.log('db error', err);
		if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
			handleDisconnect();                         // lost due to either server restart, or a
		} else {                                      // connnection idle timeout (the wait_timeout
			throw err;                                  // server variable configures this)
		}
	});
}

handleDisconnect();

// If there is an error connecting to the database
/*connection.connect(function(err) {
  // connected! (unless `err` is set)
  console.log(err);
});*/

// creating the server ( localhost:8000 )
app.listen(8000);

// on server started we can load our client.html page
function handler(req, res) {
	var url_parts = url.parse(req.url, true);
	var id = url_parts.query.id;
	var path = url.parse(req.url, true).pathname;
    if(path=="/p"){
		pollingLoop2(0);
		fs.readFile(__dirname + '/client.html', function(err, data) {
			if (err) {
			  console.log(err);
			  res.writeHead(500);
			  return res.end('Error loading client.html');
			}
			res.writeHead(200);
			res.end(data);
	    });
    }else{
        fs.readFile(__dirname + '/client.html', function(err, data) {
			if (err) {
			  console.log(err);
			  res.writeHead(500);
			  return res.end('Error loading client.html');
			}
			res.writeHead(200);
			res.end(data);
	    });
    }
}

var pollingLoop = function() {

  // Doing the database query
  var query = connection.query('SELECT name, count FROM category_counter WHERE category=1 AND name!="Χωρίς κατηγορία" AND count!=0'),
  users = []; // this array will contain the result of our db query
  // setting the query listeners
  query
    .on('error', function(err) {
      // Handle error, and 'end' event will be emitted after this as well
      console.log(err);
      updateSockets(err);
    })
    .on('result', function(user) {
      // it fills our array looping on each user row inside the db
	  users.push(user);
    })
    .on('end', function() {
      // loop on itself only if there are sockets still connected
      if (connectionsArray.length) {
        pollingTimer = setTimeout(pollingLoop, POLLING_INTERVAL);

        updateSockets({
			users: users
        });
      }
    });
};

var pollingLoop2 = function(flag) {
	if (flag == 0) {
		//id_prev = id;
		flag = 1;
	}
	// Doing the database query
	var query = connection.query('SELECT name, count FROM category_counter WHERE category=0 AND count!=0'),
	posts = []; // this array will contain the result of our db query
	// setting the query listeners
	query
	.on('error', function(err) {
		// Handle error, and 'end' event will be emitted after this as well
		console.log(err);
		updateSockets2(err);
	})
	.on('result', function(user) {
		//console.log("Single post: " + JSON.stringify(user, null, 4));
		// it fills our array looping on each user row inside the db
		posts.push(user);
	})
	.on('end', function() {
		// loop on itself only if there are sockets still connected
		if (connectionsArray.length) {
			//if (id == id_prev) {
				setTimeout(function() { pollingLoop2(1) }, POLLING_INTERVAL);
				updateSockets2({
					posts: posts
				});
				flag = 0;
			//}
		}
	});
};

// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {

  console.log('Number of connections:' + connectionsArray.length);
  // starting the loop only if at least there is one user connected
  if (!connectionsArray.length) {
    pollingLoop();
  }

  socket.on('disconnect', function() {
    var socketIndex = connectionsArray.indexOf(socket);
    console.log('socket = ' + socketIndex + ' disconnected');
    if (socketIndex >= 0) {
      connectionsArray.splice(socketIndex, 1);
    }
  });

  console.log('A new socket is connected!');
  connectionsArray.push(socket);

});

var updateSockets = function(data) {
  // adding the time of the last update
  data.time = new Date();
  // sending new data to all the sockets connected
  connectionsArray.forEach(function(tmpSocket) {
    tmpSocket.volatile.emit('notification', data);
  });
};

var updateSockets2 = function(data) {
  // sending new data to all the sockets connected
  connectionsArray.forEach(function(tmpSocket) {
    tmpSocket.volatile.emit('notification2', data);
  });
};
