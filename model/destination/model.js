var
  Q             = require("q"),
  DestinationSchema = require('./schema.js'),
  mongoose      = require('mongoose');

/**
 * find destination by id
 * @param destinationId
 * @param managerId
 * @returns {*}
 */
function _findById(destinationId, managerId){
    var deffered = Q.defer();

    model.findOne({"_id" : mongoose.Types.ObjectId(destinationId)}, function(err, destination){
        if(err){
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to find destination with id ' + id);
            return deffered.reject(error("MONGO_ERROR"));
        };
        deffered.resolve(destination);
    });

    return deffered.promise;
}

/**
 * find destination by id - 
 * @param destinationId
 * @param managerId
 * @returns {*}
 */
function _findByIdManager(destinationId, managerId){
    var deffered = Q.defer();

    model.findOne({"_id" : mongoose.Types.ObjectId(destinationId)}, function(err, destination){
        if(err){
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to find destination with id ' + id);
            return deffered.reject(error("MONGO_ERROR"));
        };
        if(destination) {
            if(destination.managerId != managerId) return deffered.reject(error("NOT_ALLOWED"));
        }
        
        deffered.resolve(destination);
    });

    return deffered.promise;
}

/**
 * find destinations by manager id
 * @param managerId
 * @returns {*}
 */
function _findByManagerId(managerId){
    var deffered = Q.defer();

    model.find({managerId : managerId}, function(err, destinations){
        if(err){
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to find destinations for manager id ' + managerId);
            return deffered.reject(error("MONGO_ERROR"));
        };
        deffered.resolve(destinations);
    });

    return deffered.promise;
}

/**
 * find destinations by vehicle id
 * @param vehicleId
 * @returns {*}
 */
function _findByVehicleId(vehicleId){
    var deffered = Q.defer();

    model.find({vehicleId : vehicleId}, function(err, destinations){
        if(err){
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to find destinations with vehicleId ' + vehicleId);
            return deffered.reject(error("MONGO_ERROR"));
        };
        deffered.resolve(destinations);
    });

    return deffered.promise;
}

/**
 * Find destination by id
 * @param destinationId
 * @returns {*}
 */
DestinationSchema.statics.findById = function(destinationId){
    return _findById(destinationId);
}

/**
 * Find destination by id for manager
 * @param destinationId
 * @param managerId
 * @returns {*}
 */
DestinationSchema.statics.findByIdManager = function(destinationId, managerId){
    return _findByIdManager(destinationId, managerId);
}

/**
 * Find destinations by manager id
 * @param managerId
 * @returns {*}
 */
DestinationSchema.statics.findByManagerId = function(managerId){
    return _findByManagerId(managerId);
}

/**
 * Find destinations by not manager id
 * @param managerId
 * @returns {*}
 */
DestinationSchema.statics.findByManagerIdNot = function(managerId){
    return _findByManagerIdNot(managerId);
}

/**
 * Find destination by vehicle id
 * @param vehicleId
 * @returns {*}
 */
DestinationSchema.statics.findByVehicleId = function(vehicleId){
    return _findByVehicleId(vehicleId);
}

/**
 * Find all destinations
 * @returns {*}
 */
DestinationSchema.statics.findAll = function(){
    var deffered = Q.defer();

    model.find({}, function(err, data){
        if(err){
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to find all destinations');
            return deffered.reject("MONGO_ERROR");
        };
        return deffered.resolve(data);
    });

    return deffered.promise;
}

/**
 * Find all finished destinations
 * @returns {*}
 */
DestinationSchema.statics.findAllFinished = function(){
    var deffered = Q.defer();

    model.find({endDate : { '$lte' : new Date()}}, function(err, data){
        if(err){
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to find all finished destinations');
            return deffered.reject("MONGO_ERROR");
        };
        return deffered.resolve(data);
    });

    return deffered.promise;
}

/**
 * Add destination
 * @param managerId
 * @param destination
 * @returns {*}
 */
DestinationSchema.statics.add = function(managerId, destination){
    var deffered = Q.defer();

    destination = new model(destination);
    destination.managerId = managerId;

    destination.save(function(err, data){
        if(err){
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to add destination');
            return deffered.reject(error("MONGO_ERROR"));
        };
        return deffered.resolve(data);
    });

    return deffered.promise;
}

/**
 * Update destination
 * @param destinationId
 * @param data
 * @param managerId
 * @returns {*}
 */
DestinationSchema.statics.update = function(destinationId, data, managerId){
    var deffered = Q.defer();
    
    _findByIdManager(destinationId, managerId).then(function(found){
        if(!found) return deffered.reject(error("NOT_FOUND"));

        if(data.startLocation) found.startLocation = data.startLocation;
        if(data.endLocation) found.endLocation = data.endLocation;
        if(data.startDate) found.startDate = data.startDate;
        if(data.endDate) found.endDate = data.endDate;
        if(data.driversPay) found.driversPay = data.driversPay;
        if(data.numberOfKms) found.numberOfKms = data.numberOfKms;
        if(data.fuelExpenses) found.fuelExpenses = data.fuelExpenses;
        if(data.requestPerKmPrice) found.requestPerKmPrice = data.requestPerKmPrice;

        found.save(function(err, destination){
            if(err){
                logger.error('Database error - ' + JSON.stringify(err) + ' while trying to update destination with id ' + destinationId);
                return deffered.reject(error("MONGO_ERROR"));
            };
            return deffered.resolve(destination);
        });

    }).fail(function(err){
        deffered.reject(err);
    });

    return deffered.promise;
}

/**
 * Delete destination
 *  @param destinationId
 *  @param managerId
 * @returns {*}
 */
DestinationSchema.statics.delete = function(destinationId, managerId){
    var deffered = Q.defer();

    _findByIdManager(destinationId, managerId).then(function(found){
        if(!found) return deffered.reject(error("NOT_FOUND"));

        model.remove({_id : mongoose.Types.ObjectId(id)}, function(err, destination){
            if(err){
                logger.error('Database error - ' + JSON.stringify(err) + ' while trying to delete destination with id ' + destinationId);
                return deffered.reject(error("MONGO_ERROR"));
            };
            return deffered.resolve(destination);
        });

    }).fail(function(err){
        deffered.reject(err);
    });

    return deffered.promise;
}

/**
 * check if driver is available
 * @param driverId
 * @param startDateEntry
 * @param endDateEntry
 * @returns {*}
 */
function _checkDestinationsForDriver(driverId, startDateEntry, endDateEntry){
    var deffered = Q.defer();

    model.find({drivers : driverId, startDate : { '$gte' : startDateEntry}, endDate : { '$lte' : endDateEntry}}, function(err, destinations){
        if(err){
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to check driver for destinations, driver id is ' + driverId);
            return deffered.reject(error('MONGO_ERROR'));
        }
        return deffered.resolve(destinations);
    });

    return deffered.promise;
}

/**
 * Check if driver is available
 * @param driverId
 * @param startDate
 * @param endDate
 * @returns {*}
 */
DestinationSchema.statics.checkDestinationsForDriver = function(driverId, startDate, endDate){
    return _checkDestinationsForDriver(driverId, startDate, endDate);
}

/**
 * Set destination drivers
 * @param destinationId
 * @param drivers
 * @param managerId
 * @returns {*}
 */
DestinationSchema.statics.setDrivers = function(destinationId, drivers, managerId){
    var deffered = Q.defer();

    _findByIdManager(destinationId, managerId).then(function(found){
        if(!found) return deffered.reject(error("NOT_FOUND"));

        found.drivers = drivers;

        found.save(function(err, destination){
            if(err){
                logger.error('Database error - ' + JSON.stringify(err) + ' while trying to set destination drivers with destination id ' + destinationId);
                return deffered.reject(error("MONGO_ERROR"));
            };
            return deffered.resolve(destination);
        });

    }).fail(function(err){
        deffered.reject(err);
    });

    return deffered.promise;
}

/**
 * check if vehicle is available
 * @param vehicleId
 * @param startDateEntry
 * @param endDateEntry
 * @returns {*}
 */
function _checkDestinationsForVehicle(vehicleId, startDateEntry, endDateEntry){
    var deffered = Q.defer();

    model.find({vehicleId : vehicleId, startDate : { "$gte" : startDateEntry}, endDate : { "$lte" : endDateEntry}}, function(err, destination){
        if(err){
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to check vehicle for destinations, vehicle id is ' + vehicleId);
            return deffered.reject(error('MONGO_ERROR'));
        }
        return deffered.resolve(destination);
    });

    return deffered.promise;
}

/**
 * Check if vehicle is available
 * @param vehicleId
 * @param startDate
 * @param endDate
 * @returns {*}
 */
DestinationSchema.statics.checkDestinationsForVehicle = function(vehicleId, startDate, endDate){
    return _checkDestinationsForVehicle(vehicleId, startDate, endDate);
}

/**
 * Set destination vehicle
 * @param destinationId
 * @param vehicleId
 * @param managerId
 * @returns {*}
 */
DestinationSchema.statics.setVehicle = function(destinationId, vehicleId, managerId){
    var deffered = Q.defer();

    _findByIdManager(destinationId, managerId).then(function(found){
        if(!found) return deffered.reject(error("NOT_FOUND"));

        found.vehicleId = vehicleId;

        found.save(function(err, destination){
            if(err){
                logger.error('Database error - ' + JSON.stringify(err) + ' while trying to set destination vehicle with id ' + destinationId);
                return deffered.reject(error("MONGO_ERROR"));
            };
            return deffered.resolve(destination);
        });

    }).fail(function(err){
        deffered.reject(err);
    });

    return deffered.promise;
}

var model = mongoose.model('destinations', DestinationSchema);

module.exports = model;