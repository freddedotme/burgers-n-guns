'use strict';

const socket = io('http://localhost:1337');

const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        main: order_view_b
      }
    },
    {
      path: '/dispatcher',
      components: {
        main: dispatcher_view_b
      }
    }
  ]
});

const app = new Vue({
  router: router,
  el: '#app',
  data: {
    trump: 'It\'s great',
    orders: [],
    burgers: [],
    order: {
      name: '',
      email: '',
      address: '',
      payment: '',
      gender: '',
      gun: '',
      location: {lat: 0.0, lng: 0.0},
      submit: 'Send order',
      cart: {price: 0, amount: 0, items: []}
    },
    map: [],
    icon: {},
    marker: {},
    error: false,
    alert: '',
    disabled: false
  },
  mounted: function () {
    socket.on('getBurgers', function (data) {
      this.burgers = data.burgers;
    }.bind(this));

    socket.on('getOrders', function (data) {
      this.orders = data.orders;
      this.addAllMarkers();
    }.bind(this));

    socket.on('newOrder', function (data) {
      this.orders.push(data.order);
      this.addMarker(data.order);
    }.bind(this));

    setInterval(this.updateTrump, 5000);
  },
  methods: {
    addBurger: function (burger) {
      if (this.disabled) return;

      var pos = this.getBurgerByUid(burger.uid);
      var cart = this.order.cart;
      var items = cart.items;

      if (pos === -1) {
        var item = {amount: 1, burger: burger};
        items.push(item);
      } else {
        items[pos].amount += 1;
      }

      cart.price += burger.price;
      cart.amount += 1;
    },
    removeBurger: function (burger) {
      if (this.disabled) return;

      var pos = this.getBurgerByUid(burger.uid);
      if (pos === -1) return;

      var cart = this.order.cart;
      var items = cart.items;

      cart.price -= burger.price * items[pos].amount;
      cart.amount -= items[pos].amount;
      items.splice(pos, 1);
    },
    getBurgerByUid: function (uid) {
      var items = this.order.cart.items;

      for (var i = 0; i < items.length; i++) {
        if (items[i].burger.uid === uid)
          return i;
      }

      return -1;
    },
    updateTrump: function () {
      const quotes = ['It\'s great.', 'Best burger, trust me.', 'China!', 'Bad reviews are fake reviews.', 'I will build a great burger.'];
      this.trump = quotes[(Math.random() * quotes.length | 0)];
    },
    addMarkerOnClick: function (data) {
      if (this.disabled) return;

      if (this.marker) {
        this.map[0].removeLayer(this.marker);
      }

      this.order.location.lat = data.latlng.lat;
      this.order.location.lng = data.latlng.lng;

      this.marker = L.marker(data.latlng, {icon: this.icon}).addTo(this.map[0]);
    },
    addMarker: function (data) {
      if (this.$route.fullPath !== '/dispatcher') return;

      L.marker([data.location.lat, data.location.lng], {icon: this.icon}).addTo(this.map[1]);
    },
    addAllMarkers: function () {
      if (this.$route.fullPath !== '/dispatcher') return;

      for (var i = 0; i < this.orders.length; i++) {
        L.marker([this.orders[i].location.lat, this.orders[i].location.lng], {icon: this.icon}).addTo(this.map[1]);
      }
    },
    addOrder: function () {
      this.error = false;
      var order = this.order;

      if (order.name === '') {
        this.error = true;
        this.alert = 'Name empty.';
      } else if (order.email === '') {
        this.error = true;
        this.alert = 'Email empty.';
      } else if (order.address === '') {
        this.error = true;
        this.alert = 'Address empty.';
      } else if (order.payment === '') {
        this.error = true;
        this.alert = 'Choose a payment option.'
      } else if (order.gender === '') {
        this.error = true;
        this.alert = 'Choose a gender.'
      } else if (order.gun === '') {
        this.error = true;
        this.alert = 'Choose a gun.'
      } else if (order.location.lat === 0.0 || order.location.lng === 0.0) {
        this.error = true;
        this.alert = 'Pick a location.'
      } else if (order.cart.amount === 0) {
        this.error = true;
        this.alert = 'Choose at least one burger.'
      } else {
        socket.emit('addOrder', {order: this.order});
        this.order.submit = 'Order sent!';
        this.disabled = true;
      }
    },
    resetOrder: function () {
      var order = this.order;
      order.name = '';
      order.email = '';
      order.address = '';
      order.payment = '';
      order.gender = '';
      order.gun = '';
      order.location.lat = 0.0;
      order.location.lng = 0.0;
      if (this.marker) this.map[0].removeLayer(this.marker);
      order.cart = {price: 0, amount: 0, items: []};
      this.disabled = false;
    },
    initMap: function () {
      var path = this.$route.fullPath;

      this.icon = L.icon({iconUrl: 'img/marker.png', iconSize: [70, 47]});

      if (path === '/') {
        this.map[0] = L.map('map-order').setView([59.8588200, 17.6388900], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoiZnJlZGRlZG90bWUiLCJhIjoiY2pkOHlwcmt1MHRjZDJycDUwZHRpN3NhbSJ9.JmijFQON5zz6R_8um_SYsg'
        }).addTo(this.map[0]);

        this.map[0].on('click', this.addMarkerOnClick);
      }
      else if (path === '/dispatcher') {
        this.map[1] = L.map('map-dispatcher').setView([59.8588200, 17.6388900], 11);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoiZnJlZGRlZG90bWUiLCJhIjoiY2pkOHlwcmt1MHRjZDJycDUwZHRpN3NhbSJ9.JmijFQON5zz6R_8um_SYsg'
        }).addTo(this.map[1]);
      }
    }
  }
});
