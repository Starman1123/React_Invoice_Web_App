var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Alert = ReactBootstrap.Alert;

// A list of products that the user can choose from.
var productData = [{ productName: "Apple", price: 1.12, quantity: 1 }, { productName: "Banana", price: 2.30, quantity: 1 }, { productName: "Pear", price: 3.45, quantity: 1 }, { productName: "Peach", price: 1.10, quantity: 1 }, { productName: "Watermelon", price: 1.23, quantity: 1 }, { productName: "Lemon", price: 1.34, quantity: 1 }, { productName: "Kiwi", price: 1.43, quantity: 1 }, { productName: "Pineapple", price: 2.14, quantity: 1 }, { productName: "Apricot", price: 1.56, quantity: 1 }, { productName: "Plum", price: 1.34, quantity: 1 }, { productName: "Avocade", price: 1.58, quantity: 1 }];

// ItemTable Class. It takes care of adding, deleting and updating rows.
var ItemTable = React.createClass({
  getInitialState: function () {
    return { items: this.props.items, grand_total: 0.00 };
  },
  render: function () {
    return React.createElement(
      "table",
      { className: "table table-striped", items: this.state.items },
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          React.createElement(
            "th",
            null,
            "Product Name"
          ),
          React.createElement(
            "th",
            null,
            "Price $"
          ),
          React.createElement(
            "th",
            null,
            "Quantity"
          ),
          React.createElement(
            "th",
            null,
            "Total $"
          )
        )
      ),
      React.createElement(
        "tbody",
        null,
        this.renderRows(),
        React.createElement(GrandTotalItemRow, { grand_total: this.state.grand_total }),
        React.createElement(AddItemRow, { addRows: this.addRows })
      )
    );
  },
  renderRows: function () {
    res = [];
    for (var i = 0; i < this.state.items.length; i++) {
      res.push(React.createElement(ItemRow, { itemID: i, updateRow: this.updateRow, removeRow: this.removeRow, productName: this.state.items[i].productName, price: this.state.items[i].price, quantity: this.state.items[i].quantity, total: this.state.items[i].total }));
    }
    return res;
  },
  addRows: function () {
    var rows = [];
    var picker = document.getElementById("picker");
    for (var i = 0; i < picker.options.length; i++) {
      if (picker.options[i].selected) {
        rows.push([picker.options[i].text, productData[i].price, 0, 0.00]);
      }
    }
    var rowCount = rows.length;
    var newItems = [];
    for (var i = 0; i < rowCount; i++) {
      var n = rows[i][0];
      var p = rows[i][1];
      newItems.push({ productName: n, price: p, quantity: 0, total: 0.00 });
    }
    this.setState({ items: this.state.items.concat(newItems) });
    $('.selectpicker').selectpicker('val', '');
    $('.selectpicker').selectpicker('refresh');
  },
  removeRow: function (itemID) {
    this.state.grand_total = parseFloat(this.state.grand_total) - parseFloat(this.state.items[itemID].total);
    this.state.items.splice(itemID, 1);
    this.setState({ items: this.state.items, grand_total: this.state.grand_total.toFixed(2) });
  },
  updateRow: function (itemID, newPrice, newQuantity, newTotal) {
    this.state.items[itemID].price = newPrice;
    this.state.items[itemID].quantity = newQuantity;
    this.state.grand_total = parseFloat(this.state.grand_total) + parseFloat(newTotal) - parseFloat(this.state.items[itemID].total);
    this.state.items[itemID].total = newTotal;
    this.setState({ items: this.state.items, grand_total: this.state.grand_total.toFixed(2) });
  }
});

// Generic row that contains productName, price, quantity and subtotal
var ItemRow = React.createClass({
  render: function () {
    return React.createElement(
      "tr",
      null,
      React.createElement(
        "td",
        null,
        React.createElement(
          "button",
          { className: "btn btn-xs btn-danger", onClick: this.removeRow },
          React.createElement("span", { className: "glyphicon glyphicon-trash" })
        ),
        " " + this.props.productName
      ),
      React.createElement(
        "td",
        null,
        React.createElement("input", { id: "price" + this.props.itemID, value: isNaN(this.props.price) ? "" : this.props.price, type: "text", onChange: this.updateRow })
      ),
      React.createElement(
        "td",
        null,
        React.createElement("input", { id: "quantity" + this.props.itemID, value: isNaN(this.props.quantity) ? "0" : this.props.quantity, type: "text", onChange: this.updateRow })
      ),
      React.createElement(
        "td",
        null,
        React.createElement(
          "div",
          { id: "subtotal" + this.props.itemID, onChange: this.updateRow },
          this.props.total
        )
      )
    );
  },
  removeRow: function () {
    this.props.removeRow(this.props.itemID);
  },
  updateRow: function () {
    var price = document.getElementById("price" + this.props.itemID).value;
    var quantity = document.getElementById("quantity" + this.props.itemID).value;
    var res = parseFloat(price) * parseFloat(quantity);
    this.props.updateRow(this.props.itemID, price, quantity, isNaN(res) ? "0.00" : res.toFixed(2));
  }
});

// Row that displays the grand total
var GrandTotalItemRow = React.createClass({
  render: function () {
    return React.createElement(
      "tr",
      null,
      React.createElement("th", null),
      React.createElement("td", null),
      React.createElement(
        "td",
        null,
        "Grand Total:"
      ),
      React.createElement(
        "td",
        null,
        React.createElement(
          "div",
          { id: "grand_total" },
          this.props.grand_total
        )
      )
    );
  }
});

// AddItemRow Class. Could potentially be modified to get product data from DBs.
var AddItemRow = React.createClass({
  render: function () {
    return React.createElement(
      "tr",
      null,
      React.createElement(
        "td",
        null,
        React.createElement(
          "select",
          { id: "picker", className: "selectpicker", "data-live-search": "true", multiple: true },
          this.getProductOptions()
        ),
        React.createElement(
          Button,
          { bsStyle: "primary", onClick: this.addRows },
          "Add"
        )
      ),
      React.createElement("td", null),
      React.createElement("td", null),
      React.createElement(
        "td",
        null,
        React.createElement(
          Button,
          { bsStyle: "primary", onClick: this.save },
          "Save"
        )
      )
    );
  },
  getProductOptions: function () {
    res = [];
    for (var i = 0; i < productData.length; i++) {
      res.push(React.createElement(
        "option",
        { dataID: i },
        productData[i].productName
      ));
    }
    return res;
  },
  addRows: function () {
    this.props.addRows();
  }
});

// DateInput Class
var DateInput = React.createClass({
  render: function () {
    return React.createElement(
      "div",
      { className: "input-group input-append date", id: "datePicker" },
      React.createElement("input", { type: "text", className: "form-control" }),
      React.createElement(
        "span",
        { className: "input-group-addon add-on" },
        React.createElement("span", { className: "glyphicon glyphicon-calendar" })
      )
    );
  }
});

// DateInput Formatter
$(document).ready(function () {
  $('#datePicker').datepicker({ format: 'mm/dd/yyyy' });
});

// Render UI
ReactDOM.render(React.createElement(Input, { type: "text", placeholder: "customer_name" }), document.getElementById("customer_name"));
ReactDOM.render(React.createElement(Input, { type: "text", placeholder: "invoice_number" }), document.getElementById("invoice_number"));
ReactDOM.render(React.createElement(DateInput, null), document.getElementById("date"));
ReactDOM.render(React.createElement(ItemTable, { items: [] }), document.getElementById("table"));