var cartId = "cart"; // ключ в localStorage


// Работа с LocalStorage
// saveCart
// getCart
// clearCart
var localAdapter = {

    saveCart: function (object) {

        var stringified = JSON.stringify(object);
        localStorage.setItem(cartId, stringified);
        return true;

    },
    getCart: function () {

        return JSON.parse(localStorage.getItem(cartId));

    },
    clearCart: function () {

        localStorage.removeItem(cartId);

    }

};
var storage = localAdapter;
var ajaxAdapter = {

    saveCart: function (object) {

        var stringified = JSON.stringify(object);
        // по надобности отправляем ajax запрос

    },
    getCart: function () {
        console.log(data)
        return JSON.parse(data);

    },
    clearCart: function () {

        //do an ajax request here

    }

};

// Работа с html
// getHtml
// setHTML
// itemData
// updateView
// emptyView
// updateTotal
var helpers = {

    getHtml: function (id) {

        return document.getElementById(id).innerHTML;

    },
    setHtml: function (id, html) {

        document.getElementById(id).innerHTML = html;
        return true;

    },
    itemData: function (object) {

        var count = object.querySelector(".count"),
            patt = new RegExp("^[1-9]([0-9]+)?$");
        count.value = (patt.test(count.value) === true) ? parseInt(count.value) : 1;

        var item = {

            name: object.getAttribute('data-name'),
            price: object.getAttribute('data-price'),
            id: object.getAttribute('data-id'),
            count: count.value,
            total: parseInt(object.getAttribute('data-price')) * parseInt(count.value)

        };
        return item;

    },
    updateView: function () {

        var items = cart.getItems(),
            template = this.getHtml('cartT'),
            compiled = _.template(template, {
                items: items
            });
        this.setHtml('cartItems', compiled);
        this.updateTotal();

    },
    emptyView: function () {

        this.setHtml('cartItems', '<p>Nothing to see here</p>');
        this.updateTotal();

    },
    updateTotal: function () {

        this.setHtml('totalPrice', cart.total + '$');

    }

};


// Работа с корзиной
// count -всего товаров в корзине по каждому товару
// total - общая стоимость по каждому товару
// items - товары 
// getItems
// setItems 
// clearItems
// addItem
// containsItem
// updateItem
var cart = {

    count: 0,
    total: 0,
    items: [],
    getItems: function () {

        return this.items;

    },

    setItems: function (items) {

        this.items = items;
        for (var i = 0; i < this.items.length; i++) {
            var _item = this.items[i];
            this.total += _item.total;
        }

    },

    clearItems: function () {

        this.items = [];
        this.total = 0;
        storage.clearCart();
        helpers.emptyView();

    },
    addItem: function (item) {

        if (this.containsItem(item.id) === false) {

            this.items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                count: item.count,
                total: item.price * item.count
            });

            storage.saveCart(this.items);


        } else {

            this.updateItem(item);

        }
        this.total += item.price * item.count;
        this.count += item.count;
        helpers.updateView();

    },
    containsItem: function (id) {

        if (this.items === undefined) {
            return false;
        }

        for (var i = 0; i < this.items.length; i++) {

            var _item = this.items[i];

            if (id == _item.id) {
                return true;
            }

        }
        return false;

    },
    updateItem: function (object) {

        for (var i = 0; i < this.items.length; i++) {

            var _item = this.items[i];

            if (object.id === _item.id) {

                _item.count = parseInt(object.count) + parseInt(_item.count);
                _item.total = parseInt(object.total) + parseInt(_item.total);
                this.items[i] = _item;
                storage.saveCart(this.items);

            }

        }

    }

};

document.addEventListener('DOMContentLoaded', function () {

    if (storage.getCart()) {

        cart.setItems(storage.getCart());
        helpers.updateView();

    } else {

        helpers.emptyView();

    }
    var products = document.querySelectorAll('.product button');
    products.forEach( function (product) {

        product.addEventListener('click', function (e) {

            var item = helpers.itemData(this.parentNode);
            cart.addItem(item);


        });

    });

    var cartItems = document.getElementById('cartItems');
    cartItems.addEventListener('click', function (e) {
        if(e.target.className == 'close-button')
        {
            var item = helpers.itemData(this.parentNode);
            cart.removeItem(item);
        }
    });

    document.querySelector('#clear').addEventListener('click', function (e) {

        cart.clearItems();

    });


});
