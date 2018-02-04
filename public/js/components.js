'use strict';

// main

const dispatcher_view_b = Vue.component('dispatcher_view_b', {
  template: '<p>TJA</p>'
});

const order_view_b = Vue.component('order_view_b', {
  data: function () {
    return {
      app: {}
    }
  },
  created: function () {
    this.app = this.$router.app;
  },
  template: '' +
  '<section class="order_view_b">' +
  '<section class="burgers_b">' +
  '<burger_b v-for="burger in app.burgers" :burger="burger" :key="burger.uid" :action="app.addBurger"></burger_b>' +
  '</section>' +
  '<section class="order_b">' +
  '<form>' +
  '<input type="text" v-model="app.order.name" placeholder="Name">' +
  '<input type="text" v-model="app.order.email" placeholder="E-mail">' +
  '<input type="text" v-model="app.order.address" placeholder="Address">' +
  '<select v-model="app.order.payment">' +
  '<option disabled value="">Payment</option>' +
  '<option>Credit card</option>' +
  '<option>Cash</option>' +
  '</select>' +
  '<select v-model="app.order.gender">' +
  '<option disabled value="">Gender</option>' +
  '<option>Male</option>' +
  '<option>Female</option>' +
  '<option>Other</option>' +
  '</select>' +
  '<select v-model="app.order.gun">' +
  '<option disabled value="">Gun of choice</option>' +
  '<option>Shotgun</option>' +
  '<option>Sniper</option>' +
  '<option>Bazooka</option>' +
  '</select>' +
  '<div id="map"></div>' +
  '<button>{{ app.order.submit }}</button>' +
  '</form>' +
  '</section>' +
  '<section class="cart_b">' +
  '<item_b v-for="item in app.cart.items" :item="item" :key="item.burger.uid" :action="app.removeBurger"></item_b>' +
  '<div class="item_b">' +
  '<span>Total price ({{ app.cart.amount }} items)</span>' +
  '<span>{{ app.cart.price }} :-</span>' +
  '</div>' +
  '</section>' +
  '</section>'
});

// stand-alone components

const burger_b = Vue.component('burger_b', {
  props: ['burger', 'action'],
  template: '' +
  '<div class="burger_b" v-bind:style="{backgroundImage: \'url(\' + burger.url + \')\'}" @click="action(burger)">' +
  '<div class="overlay">' +
  '<div class="title">' +
  '<h2>{{ burger.title }}</h2>' +
  '<p>{{ burger.description }}</p>' +
  '<p class="meta">' +
  '<span>{{ burger.meta.calories }} kcal</span>' +
  '<span v-if="burger.meta.lactose">, lactose</span>' +
  '<span v-if="burger.meta.gluten">, gluten</span>' +
  '</p>' +
  '</div>' +
  '</div>' +
  '</div>'
});

const item_b = Vue.component('item_b', {
  props: ['item', 'action'],
  template: '' +
  '<div class="item_b" @click="action(item.burger)">' +
  '<span>{{ item.burger.title }} x {{ item.amount }}</span>' +
  '<span>{{ item.burger.price }} :-</span>' +
  '</div>'
});
