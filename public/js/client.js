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

new Vue({
  router: router,
  el: '#app',
  data: {
    trump: 'It\'s great',
    burgers: [],
    order: {name: '', email: '', address: '', payment: '', gender: '', gun: '', submit: 'Send order'},
    cart: {price: 0, amount: 0, items: []}
  },
  mounted: function () {
    socket.on('getBurgers', function (data) {
      this.burgers = data.burgers;
    }.bind(this));

    setInterval(this.updateTrump, 5000);

    var map = L.map('map').setView([51.505, -0.09], 13);
  },
  methods: {
    addBurger: function (burger) {
      var pos = this.getBurgerByUid(burger.uid);
      var cart = this.cart;
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
      var pos = this.getBurgerByUid(burger.uid);
      if (pos === -1) return;

      var cart = this.cart;
      var items = cart.items;

      cart.price -= burger.price * items[pos].amount;
      cart.amount -= items[pos].amount;
      items.splice(pos, 1);
    },
    getBurgerByUid: function (uid) {
      var items = this.cart.items;

      for (var i = 0; i < items.length; i++) {
        if (items[i].burger.uid === uid)
          return i;
      }

      return -1;
    },
    updateTrump: function () {
      const quotes = ['It\'s great.', 'Best burger, trust me.', 'China!', 'Bad reviews are fake reviews.', 'I will build a great burger.'];
      this.trump = quotes[(Math.random() * quotes.length | 0)];
    }
  }
});

