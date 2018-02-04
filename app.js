'use strict';

// init ----------------------------------------------------------------------------------------------------------------

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var port = 1337;
app.set('port', (process.env.PORT || port));

app.use(express.static(path.join(__dirname, 'public/')));
app.use('/vue', express.static(path.join(__dirname, '/node_modules/vue/dist/')));
app.use('/vue-router', express.static(path.join(__dirname, '/node_modules/vue-router/dist/')));
app.use('/leaflet', express.static(path.join(__dirname, '/node_modules/leaflet/dist/')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/dispatcher', function (req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html/dispatcher'));
});

var server = http.listen(app.get('port'), function () {
  console.log('localhost:' + app.get('port'));
});

// functions -----------------------------------------------------------------------------------------------------------

function broadcast(message) {
  var date = new Date();
  var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  console.log(time + ' > ' + message);
}

function Data() {
  this.clients = [];
  this.orders = [];
  this.burgers = [
    {
      uid: 0,
      title: 'Umami Burger',
      description: 'Crispy chicken with truffle mayonnaise, gruyere cheese and red onions.',
      url: 'img/burger1.jpg',
      meta: {calories: 680, lactose: true, gluten: true},
      price: 90.0
    },
    {
      uid: 1,
      title: 'Basic Burger',
      description: 'Melting cheese, tomatoes and crispy salad served on a brioche bread.',
      url: 'img/burger2.jpg',
      meta: {calories: 560, lactose: false, gluten: true},
      price: 70.0
    },
    {
      uid: 2,
      title: 'Vegan Burger',
      description: 'Soy-based meat with a spicy salsa and coriander.',
      url: 'img/burger3.jpg',
      meta: {calories: 450, lactose: false, gluten: false},
      price: 80.0
    }
  ];
}

Data.prototype.addOrder = function (order) {
  this.orders.push(order);
};

Data.prototype.getOrders = function () {
  return this.orders;
};

Data.prototype.getBurgers = function () {
  return this.burgers;
};

Data.prototype.addClient = function (socket) {
  if (this.clients.indexOf(socket) !== -1) return;
  this.clients.push(socket);

  broadcast('clients: [' + this.clients.length + ']');
};

Data.prototype.removeClient = function (socket) {
  var pos = this.clients.indexOf(socket);
  if (pos === -1) return;

  this.clients.splice(pos, 1);

  broadcast('clients: [' + this.clients.length + ']');
};

var data = new Data();

// sockets -------------------------------------------------------------------------------------------------------------

io.on('connection', function (socket) {
  data.addClient(socket);
  socket.emit('getBurgers', {burgers: data.getBurgers()});

  socket.on('disconnect', function () {
    data.removeClient(socket);
  });

  socket.on('addOrder', function (data) {
    var order = {socket: socket, order: order};
    data.addOrder(order);
  });

});
