var
  Q             = require("q"),
  VehicleSchema = require('./schema.js'),
  mongoose      = require('mongoose');

/**
 * find vehicle by license plate
 * @param licensePlate
 * @returns {*} 
 */
function _findByLicensePlate(licensePlate){
    var deffered = Q.defer();
    
    model.findOne({licensePlate : licensePlate}, function(err, data){
        if(err) return deffered.reject(error("MONGO_ERROR"));
        deffered.resolve(data);
    });

    return deffered.promise;
};

/**
 * find vehicle by id
 * @param id
 * @returns {*}
 */
function _findById(id){
    var deffered = Q.defer();

    if(!id) deffered.resolve(null);

    model.findOne({"_id" : mongoose.Types.ObjectId(id)}, function(err, data){
        if(err) return deffered.reject(error("MONGO_ERROR"));
        deffered.resolve(data);
    });

    return deffered.promise;
};

/**
 * Find vehicle by license plate
 * @param licensePlate
 * @returns {*}
 */
VehicleSchema.statics.findByLicensePlate = function(licensePlate){
    return _findByLicensePlate(licensePlate);
};

/**
 * Find vehicle by id
 * @param id
 * @returns {*}
 */
VehicleSchema.statics.findById = function(id){
    return _findById(id);
};

/**
 * Find all vehicles
 * @returns {*}
 */
VehicleSchema.statics.findAll = function(){
    var deffered = Q.defer();

    model.find({}, function(err, vehicles){
        if(err){
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to get all vehicles');
            return deffered.reject(error("MONGO_ERROR"));
        }
        return deffered.resolve(vehicles);
    });

    return deffered.promise;
};

/**
 * Add vehicle
 * @param vehicle
 * @returns {*}
 */
VehicleSchema.statics.add = function(vehicle){
    var deffered = Q.defer();

    _findByLicensePlate(vehicle.licensePlate).then(function(found){
        if(found) return deffered.reject(error("ALREADY_REGISTERED"));

        vehicle = new model(vehicle);

        vehicle.save(function(err, data){
            if(err){
                logger.error('Database error - ' + JSON.stringify(err) + ' while trying to add new vehicle');
                return deffered.reject(error("MONGO_ERROR"));
            }
            return deffered.resolve(data);
        });

    }).fail(function(err){
        deffered.reject(err);
    });
    
    return deffered.promise;
};

/**
 * Update vehicle
 * @param vehicleId
 * @param data
 * @returns {*}
 */
VehicleSchema.statics.update = function(vehicleId, data){
    var deffered = Q.defer();

    _findById(vehicleId).then(function(found){
        if(!found) return deffered.reject(error("NOT_FOUND"));
        
        if(data.name) found.name = data.name;
        if(data.model) found.model = data.model;
        if(data.numberOfSeats) found.numberOfSeats = data.numberOfSeats;
        if(data.productionYear) found.productionYear = data.productionYear;
        if(data.numberOfKmPassed) found.numberOfKmPassed = data.numberOfKmPassed;
        
        found.save(function(err, vehicle){
            if(err){
                logger.error('Database error - ' + JSON.stringify(err) + ' while trying to update vehicle with id ' + id);
                return deffered.reject(error("MONGO_ERROR"));
            }
            return deffered.resolve(vehicle);
        });

    }).fail(function(err){
        deffered.reject(err);
    });

    return deffered.promise;
};

/**
 * Delete vehicle
 * @param id
 * @returns {*}
 */
VehicleSchema.statics.delete = function(id){
    var deffered = Q.defer();

    _findById(id).then(function(found){
        if(!found) return deffered.reject(error("NOT_FOUND"));

        model.remove({_id : mongoose.Types.ObjectId(id)}, function(err, vehicle){
            if(err){
                logger.error('Database error - ' + JSON.stringify(err) + ' while trying to delete vehicle with id ' + id);
                return deffered.reject(error("MONGO_ERROR"));
            };
            return deffered.resolve(vehicle);
        });

    }).fail(function(err){
        deffered.reject(err);
    });

    return deffered.promise;
};

// /**
//  * Increase vehicle km passed
//  * @param id
//  * @param numberOfKmsToAdd
//  * @returns {*}
//  */
// VehicleSchema.statics.increaseKms = function(id, numberOfKmsToAdd){
//     var deffered = Q.defer();

//     _findVehicleById(id).then(function(found){
//         if(!found) return deffered.reject(error("NOT_FOUND"));

//         found.numberOfKmPassed += numberOfKmsToAdd;

//         found.save(function(err, vehicle){
//             if(err){
//                 logger.error('Database error - ' + JSON.stringify(err) + ' while trying to add kms to vehicle with id ' + id);
//                 return deffered.reject(error("MONGO_ERROR"));
//             };
//             return deffered.resolve(vehicle);
//         });
//     }).fail(function(err){
//         deffered.reject(err);
//     });

//     return deffered.promise;
// };

/**
 * Extend vehicle registration
 * @param id
 * @param data
 */
VehicleSchema.statics.extendRegistration = function(id, data){
    var deffered = Q.defer();

    _findById(id).then(function(found){
        if(!found) return deffered.reject(error("NOT_FOUND"));

        found.licensePlate = data.licensePlate;
        found.licenseExpireDate = data.licenseExpireDate;

        found.save(function(err, vehicle){
            if(err){
                logger.error('Database error - ' + JSON.stringify(err) + ' while trying to extend registration for vehicle with id ' + id + ', because license plate ' + data.licensePlate + ' already exists');
                return deffered.reject(error("MONGO_ERROR"));
            }
            return deffered.resolve(vehicle);
        });

    }).fail(function(err){
        deffered.reject(err);
    })

    return deffered.promise;
}


var model = mongoose.model('vehicles', VehicleSchema);

module.exports = model;