var React = require('react');
var _ = require('lodash');

var CategoryStore = require('../stores/CategoryStore');
var ExpenseStore = require('../stores/ExpenseStore');
var GraphCalculationUtils = require('../utils/GraphCalculationUtils');
var CategoryComponent = require('./Category.jsx');
var ExpenseComponent = require('./Expense.jsx');

var GraphComponent = React.createClass({
  getInitialState() {
    return {
      categories: [],
      expenses: []
    }
  },
  componentDidMount() {
    CategoryStore.addChangeListener(this._onChange);
    ExpenseStore.addChangeListener(this._onChange);
    this._onChange(); // remove this later, better to have it go through dispatcher
  },
  componentWillUnMount() {
    CategoryStore.removeChangeListener(this._onChange);
    ExpenseStore.removeChangeListener(this._onChange);
  },
  _onChange() {
    var categories = GraphCalculationUtils.calculateCategories();
    var expenses = GraphCalculationUtils.calculateExpenses();
    var links = GraphCalculationUtils.calculateLinks(categories, expenses);
    GraphCalculationUtils.positionGraph(categories, expenses, links);
    console.log(categories);
    console.log(expenses);
    console.log(links);

    this.setState({categories, expenses, links});
  },
  render() {
    var svgStyle = {width: 1000, height: 1000};
    var categories = this.state.categories && _.map(this.state.categories, (category) => {
      return (<CategoryComponent key={category.id} data={category} />);
    });
    var expenses = this.state.expenses && _.map(this.state.expenses, (expense) => {
      return (<ExpenseComponent key={expense.id} data={expense} />);
    });
    return (
      <svg style={svgStyle}>
        <g className="graph">
          {categories}
          {expenses}
        </g>
      </svg>
    );
  }
});

module.exports = GraphComponent;