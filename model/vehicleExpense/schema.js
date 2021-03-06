var mongoose = require('mongoose');

module.exports = (function () {
  var VehicleExpenseSchema = new mongoose.Schema({
    /**
     * VehicleExpense name
     */
    name: {
      type: String,
      required: true
    },
    /**
     * VehicleExpense amount
     */
    amount: {
      type: Number,
      required: true
    },
    /**
     * VehicleExpense bus id
     */
    vehicleId: {
      type: String,
      required: true
    },
    /**
     * VehicleExpense date
     */
    date: {
      type: Date,
      default: Date.now
    }
  });

  return VehicleExpenseSchema;
})();
