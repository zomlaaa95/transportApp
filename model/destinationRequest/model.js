var
    Q = require("q"),
    DestinationRequestSchema = require('./schema.js'),
    mongoose = require('mongoose'),
    constants = require('../../lib/constants');

/**
 * find by id
 * @param id
 * @returns {*}
 */
function _findById(id) {
    var deffered = Q.defer();

    model.findOne({
        "_id": mongoose.Types.ObjectId(id)
    }, function (err, data) {
        if (err) {
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to find destination request with id ' + id);
            return deffered.reject(error("MONGO_ERROR"));
        };
        deffered.resolve(data);
    });

    return deffered.promise;
}

/**
 * find by status
 * @param status
 * @returns {*}
 */
function _findByStatus(status) {
    var deffered = Q.defer();

    model.findOne({
        status: status
    }, function (err, data) {
        if (err) {
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to find destination request with status ' + status);
            return deffered.reject(error("MONGO_ERROR"));
        };
        deffered.resolve(data);
    });

    return deffered.promise;
}

/**
 * find by destination id
 * @param destinationId
 * @returns {*}
 */
function _findByDestinationId(destinationId) {
    var deffered = Q.defer();

    model.find({
        destinationId: destinationId
    }, function (err, data) {
        if (err) {
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to find destination request with destination id ' + destinationId);
            return deffered.reject(error("MONGO_ERROR"));
        };
        deffered.resolve(data);
    });

    return deffered.promise;
}

/**
 * find by user id
 * @param userId
 * @returns {*}
 */
function _findByUserId(userId) {
    var deffered = Q.defer();

    model.findOne({
        userId: userId
    }, function (err, data) {
        if (err) {
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to find destination request with user id ' + userId);
            return deffered.reject(error("MONGO_ERROR"));
        };
        deffered.resolve(data);
    });

    return deffered.promise;
}

/**
 * Find by id
 * @param id
 * @returns {*}
 */
DestinationRequestSchema.statics.findById = function (id) {
    return _findById(id);
}

/**
 * Find by status
 * @param status
 * @returns {*}
 */
DestinationRequestSchema.statics.findByStatus = function (status) {
    return _findByStatus(status);
}

/**
 * Find by destination id
 * @param destinationId
 * @returns {*}
 */
DestinationRequestSchema.statics.findByDestinationId = function (destinationId) {
    return _findByDestinationId(destinationId);
}

/**
 * Find by user id
 * @param userId
 * @returns {*}
 */
DestinationRequestSchema.statics.findByUserId = function (userId) {
    return _findByUserId(userId);
}

/**
 * DestinationRequest find all
 * @returns {*}
 */
DestinationRequestSchema.statics.findAll = function () {
    var deffered = Q.defer();

    model.find({}, function (err, data) {
        if (err) {
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to find all destination requests');
            return deffered.reject(error("MONGO_ERROR"));
        };
        return deffered.resolve(data);
    });

    return deffered.promise;
}

/**
 * find all submitted
 * @returns {*}
 */
function _findAllSubmitted() {
    var deffered = Q.defer();

    model.find({
        status: constants.status.SUBMITTED
    }, function (err, data) {
        if (err) {
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to find destination request with user id ' + userId);
            return deffered.reject(error("MONGO_ERROR"));
        };
        deffered.resolve(data);
    });

    return deffered.promise;
}

/**
 * Find all submitted
 * @returns {*}
 */
DestinationRequestSchema.statics.findAllSubmitted = function () {
    return _findAllSubmitted();
}

/**
 * DestinationRequest add
 * @param userId
 * @param destinationRequest
 * @returns {*}
 */
DestinationRequestSchema.statics.add = function (userId, destinationRequest) {
    var deffered = Q.defer();

    destinationRequest.userId = userId;
    destinationRequest = new model(destinationRequest);

    destinationRequest.save(function (err, data) {
        if (err) {
            logger.error('Database error - ' + JSON.stringify(err) + ' while trying to add destination request');
            return deffered.reject(error("MONGO_ERROR"));
        };
        return deffered.resolve(data);
    });

    return deffered.promise;
}

/**
 * DestinationRequest update
 * @param id
 * @param data
 * @returns {*}
 */
DestinationRequestSchema.statics.update = function (id, data) {
    var deffered = Q.defer();

    _findById(id).then(function (found) {
        if (!found) return deffered.reject(error("NOT_FOUND"));

        if (data.startLocation) found.startLocation = data.startLocation;
        if (data.endLocation) found.endLocation = data.endLocation;
        if (data.startDate) found.startDate = data.startDate;
        if (data.endDate) found.endDate = data.endDate;
        if (data.price) found.price = data.price;
        if (data.discount) found.discount = data.discount;
        if (data.status) found.status = data.status;
        if (data.destinationId) found.destinationId = data.destinationId;
        if (data.submissionDate) found.submissionDate = data.submissionDate;
        if (data.confirmationRequestDate) found.confirmationRequestDate = data.confirmationRequestDate;
        if (data.userId) found.userId = data.userId;
        if (data.destinationOrder) found.destinationOrder = data.destinationOrder;

        found.save(function (err, destinationRequest) {
            if (err) {
                logger.error('Database error - ' + JSON.stringify(err) + ' while trying to update destination request with id ' + id);
                return deffered.reject(error("MONGO_ERROR"));
            };
            return deffered.resolve(destinationRequest);
        });

    }).fail(function (err) {
        deffered.reject(err);
    });

    return deffered.promise;
}

/**
 * Delete DestinationRequest
 * @param id
 * @returns {*}
 */
DestinationRequestSchema.statics.delete = function (id) {
    var deffered = Q.defer();

    _findById(id).then(function (found) {
        if (!found) return deffered.reject(error("NOT_FOUND"));

        model.remove({
            _id: mongoose.Types.ObjectId(id)
        }, function (err, request) {
            if (err) {
                logger.error('Database error - ' + JSON.stringify(err) + ' while trying to delete destination request with id ' + id);
                return deffered.reject(error("MONGO_ERROR"));
            }
            return deffered.resolve(request);
        });

    }).fail(function (err) {
        deffered.reject(err);
    });

    return deffered.promise;
}

/**
 * DestinationRequest set to submitted
 * @param id
 * @returns {*}
 */
DestinationRequestSchema.statics.changeToSubmitted = function (id) {
    var deffered = Q.defer();

    _findById(id).then(function (found) {
        if (!found) return deffered.reject(error("NOT_FOUND"));

        if (found.status !== constants.status.REJECTED) {
            found.status = constants.status.SUBMITTED;
        }

        found.startDate = null;
        found.endDate = null;
        found.price = 0;
        found.destinationOrder = null;
        found.destinationId = null;

        found.save(function (err, destinationRequest) {
            if (err) {
                logger.error('Database error - ' + JSON.stringify(err) + ' while trying to update destination request with id ' + id);
                return deffered.reject(error("MONGO_ERROR"));
            };
            return deffered.resolve(destinationRequest);
        });

    }).fail(function (err) {
        deffered.reject(err);
    });

    return deffered.promise;
}

/**
 * DestinationRequest set to awaiting confirmation
 * @param id
 * @param data
 * @returns {*}
 */
DestinationRequestSchema.statics.changeToAwaiting = function (id, data) {
    var deffered = Q.defer();

    _findById(id).then(function (found) {
        if (!found) return deffered.reject(error("NOT_FOUND"));

        if (found.status == constants.status.REJECTED) return deffered.reject(error('NOT_ALLOWED'));

        found.status = constants.status.WAITING_FOR_CONFIRMATION;
        found.startDate = data.startDate;
        found.endDate = data.endDate;
        found.price = data.price;
        found.destinationOrder = data.destinationOrder;
        found.destinationId = data.destinationId;
        if (data.discount) found.discount = data.discount;

        found.save(function (err, destinationRequest) {
            if (err) {
                logger.error('Database error - ' + JSON.stringify(err) + ' while trying to update destination request with id ' + id);
                return deffered.reject(error("MONGO_ERROR"));
            };
            return deffered.resolve(destinationRequest);
        });

    }).fail(function (err) {
        deffered.reject(err);
    });

    return deffered.promise;
}

/**
 * DestinationRequest set to accepted
 * @param id
 * @returns {*}
 */
DestinationRequestSchema.statics.changeToAccepted = function (id) {
    var deffered = Q.defer();

    _findById(id).then(function (found) {
        if (!found) return deffered.reject(error("NOT_FOUND"));

        if (found.status != constants.status.WAITING_FOR_CONFIRMATION) return deffered.reject(error('NOT_ALLOWED'));

        found.status = constants.status.ACCEPTED;
        found.confirmationRequestDate = new Date();

        found.save(function (err, destinationRequest) {
            if (err) {
                logger.error('Database error - ' + JSON.stringify(err) + ' while trying to update destination request with id ' + id);
                return deffered.reject(error("MONGO_ERROR"));
            };
            return deffered.resolve(destinationRequest);
        });

    }).fail(function (err) {
        deffered.reject(err);
    });

    return deffered.promise;
}

/**
 * DestinationRequest set to rejected
 * @param id
 * @returns {*}
 */
DestinationRequestSchema.statics.changeToRejected = function (id) {
    var deffered = Q.defer();

    _findById(id).then(function (found) {
        if (!found) return deffered.reject(error("NOT_FOUND"));

        found.status = constants.status.REJECTED;
        found.destinationId = null;

        found.save(function (err, destinationRequest) {
            if (err) {
                logger.error('Database error - ' + JSON.stringify(err) + ' while trying to update destination request with id ' + id);
                return deffered.reject(error("MONGO_ERROR"));
            };
            return deffered.resolve(destinationRequest);
        });

    }).fail(function (err) {
        deffered.reject(err);
    });

    return deffered.promise;
}

/**
 * Update requests for destination
 * @param destinationRequests
 * @param destinationId
 * @returns {*}
 */
DestinationRequestSchema.statics.updateRequestsToAwaiting = function (destinationRequests, destinationId) {
    var deffered = Q.defer();

    let processedItems = 0;

    for (let index = 0; index < destinationRequests.length; index++) {
        const destinationRequest = destinationRequests[index];
        
        _findById(destinationRequest._id).then(function (found) {
            if (!found) return deffered.reject(error("NOT_FOUND"));

            found.status = constants.status.WAITING_FOR_CONFIRMATION;
            found.startDate = destinationRequest.startDate;
            found.endDate = destinationRequest.endDate;
            found.price = destinationRequest.price;
            found.destinationOrder = destinationRequest.destinationOrder;
            found.destinationId = destinationId;

            if (found.status === constants.status.ACCEPTED) {
                found.discount += 5;
            }
    
            found.save(function (err, destRequest) {
                if (err) {
                    logger.error('Database error - ' + JSON.stringify(err) + ' while trying to update destination request');
                    return deffered.reject(error("MONGO_ERROR"));
                };

                processedItems++;
                
                if (processedItems === destinationRequests.length) {
                    return deffered.resolve(destinationRequests);
                }
            });
    
        }).fail(function (err) {
            deffered.reject(err);
        });

    }

    return deffered.promise;
}

/**
 * Check requests before change
 * @param destinationRequests
 * @param destinationId
 * @returns {*}
 */
DestinationRequestSchema.statics.checkRequests = function (destinationRequests, destinationId) {
    var deffered = Q.defer();

    let processedItems = 0;

    for (let index = 0; index < destinationRequests.length; index++) {
        const destinationRequest = destinationRequests[index];

        _findById(destinationRequest._id).then(function (found) {

            if (!found) return deffered.reject(error("NOT_FOUND"));
    
            if (found.status === constants.status.WAITING_FOR_CONFIRMATION) {
                if (found.destinationId === null || found.destinationId === destinationId) {
                    // request belongs to destination, ok
                    processedItems++;
                } else {
                    // request belongs to different destination - already taken
                    return deffered.reject(error("NOT_ALLOWED"));
                }
            } else {
                processedItems++;
            }

            if(processedItems === destinationRequests.length) {
                return deffered.resolve(destinationId);
            }
    
        }).fail(function (err) {
            deffered.reject(err);
        });

    }

    return deffered.promise;
}

var model = mongoose.model('destinationRequests', DestinationRequestSchema);

module.exports = model;