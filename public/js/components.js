'use strict';

// main

const dispatcher_view_b = Vue.component('dispatcher_view_b', {
  data: function () {
    return {
      app: {}
    }
  },
  created: function () {
    this.app = this.$router.app;
  },
  mounted: function () {
    this.app.initMap();
    this.app.addAllMarkers();
  },
  template: '' +
  '<section class="dispatcher_view_b">' +
  '<div id="map-dispatcher"></div><section class="orders_b">' +
  '<order_b v-for="order in app.orders" :order="order" :key="order.uid"></order_b>' +
  '</section>' +
  '</section>'
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
  mounted: function () {
    this.app.initMap();
  },
  template: '' +
  '<section class="order_view_b">' +
  '<section class="burgers_b">' +
  '<burger_b v-for="burger in app.burgers" :burger="burger" :key="burger.uid" :action="app.addBurger"></burger_b>' +
  '</section>' +
  '<section class="input_b">' +
  '<div class="form">' +
  '<input type="text" v-model="app.order.name" placeholder="Name" :disabled="app.disabled">' +
  '<input type="text" v-model="app.order.email" placeholder="E-mail" :disabled="app.disabled">' +
  '<input type="text" v-model="app.order.address" placeholder="Address" :disabled="app.disabled">' +
  '<select v-model="app.order.payment" :disabled="app.disabled">' +
  '<option disabled value="">Payment</option>' +
  '<option>Credit card</option>' +
  '<option>Cash</option>' +
  '</select>' +
  '<select v-model="app.order.gender" :disabled="app.disabled">' +
  '<option disabled value="">Gender</option>' +
  '<option>Male</option>' +
  '<option>Female</option>' +
  '<option>Other</option>' +
  '</select>' +
  '<select v-model="app.order.gun" :disabled="app.disabled">' +
  '<option disabled value="">Gun of choice</option>' +
  '<option>Shotgun</option>' +
  '<option>Sniper</option>' +
  '<option>Bazooka</option>' +
  '</select>' +
  '<div id="map-order"></div>' +
  '<p class="alert" v-if="app.error">{{ app.alert }}</p>' +
  '<button @click="app.addOrder" :disabled="app.disabled">{{ app.order.submit }}</button>' +
  '<button v-if="app.disabled" @click="app.resetOrder">New order</button>' +
  '</div>' +
  '</section>' +
  '<section class="cart_b">' +
  '<item_b v-for="item in app.order.cart.items" :item="item" :key="item.burger.uid" :action="app.removeBurger"></item_b>' +
  '<div class="item_b">' +
  '<span>Total price ({{ app.order.cart.amount }} items)</span>' +
  '<span>{{ app.order.cart.price }} :-</span>' +
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
  '<div class="item_b">' +
  '<span>{{ item.burger.title }} x {{ item.amount }} </span>' +
  '<span class="remove" @click="action(item.burger)">Remove</span>' +
  '<span>{{ item.burger.price }} :-</span>' +
  '</div>'
});

const order_b = Vue.component('order_b', {
  props: ['order'],
  template: '' +
  '<div class="order_b">' +
  '<h4>#{{ order.uid }} {{ order.name }} ({{ order.cart.price }} SEK)</h4>' +
  '<ul>' +
  '<li v-for="item in order.cart.items">🍔 {{ item.burger.title }} x {{ item.amount }}</li>' +
  '<li>Payment: {{ order.payment }}</li>' +
  '<li>E-mail: {{ order.email }}</li>' +
  '<li>Gun: {{ order.gun }}</li>' +
  '</ul>' +
  '</div>'
});
