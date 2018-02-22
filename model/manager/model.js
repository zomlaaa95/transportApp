var
  Q             = require("q"),
  bcrypt        = require('bcryptjs'),
  ManagerSchema = require('./schema.js'),
  config        = require('../../config/'),
  jwt           = require('jsonwebtoken'),
  mongoose      = require('mongoose');

ManagerSchema.methods.cryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

ManagerSchema.statics.validatePassword = function (password, hash) {
  return bcrypt.compareSync(password, hash);
};

/**
 * find manager by email
 * @param email
 * @returns {*}
 */
function _findByEmail(email) {
  var deferred = Q.defer();
  model.findOne({email: email}, function (err, data) {
    if (err){
      logger.error('Database error - ' + JSON.stringify(err) + 'while trying to find manager with email ' + email);
      return deferred.reject(error("MONGO_ERROR"));
    } 
    deferred.resolve(data);
  });

  return deferred.promise;
};

/**
 * find manager by id
 * @param id
 * @returns {*}
 */
function _findById(id) {
  var deferred = Q.defer();
  if (!id) deferred.resolve(null);
  else {
    model.findOne({"_id": mongoose.Types.ObjectId(id)}, function (err, data) {
      if (err){
        logger.error('Database error - ' + JSON.stringify(err) + ' while trying to find manager with id ' + id);
        return deferred.reject(error("MONGO_ERROR"));
      }
      deferred.resolve(data);
    });
  }
  return deferred.promise;
};

/**
 * Find manager by email
 * @param email
 * @returns {*}
 */
ManagerSchema.statics.getByEmail = function (email) {
  return _findByEmail(email);
};

/**
* Find manager by id
* @param id
* @returns {*}
*/
ManagerSchema.statics.findById = function (id) {
  return _findById(id);
};

/**
 * Add manager
 * @param manager
 */
ManagerSchema.statics.add = function (manager) {
  var deferred = Q.defer();
  manager = new model(manager);
  _findByEmail(manager.email).then(function (found) {
      if (found) return deferred.reject(error("ALREADY_REGISTERED"));
      manager.password = manager.cryptPassword(manager.password);

      manager.save(function (err, manager) {
        if (err){
          logger.error('Database error - ' + JSON.stringify(err) + ' while trying to add manager');
          return deferred.reject(error("MONGO_ERROR"));
        }
        return deferred.resolve(manager);
      });
    })
    .fail(function (err) {
      deferred.reject(err);
    });

  return deferred.promise;
};

/**
 * Login manager
 * @param manager
 */
ManagerSchema.statics.login = function (manager) {
  var deferred = Q.defer();
  _findByEmail(manager.email).then(function (found) {
      if (!model.validatePassword(manager.password, found.password))
        return deferred.reject(error("INVALID_USERNAME_PASSWORD"));

      var token = jwt.sign({email: found.email, managerId: found._id}, config.token.secret, {
        expiresInMinutes: 1440 // expires in 24 hours
      });

      found.password = undefined;
      delete found.password;
      return deferred.resolve({token: token, manager: found});
    })
    .fail(function (err) {
      deferred.reject(err);
    });
  return deferred.promise;
};

/**
 * Update manager
 * @param Id
 * @param data
 * @returns {*}
 */
ManagerSchema.statics.update = function (Id, data) {
  var deferred = Q.defer();
  _findById(id).then(function (found) {
      if(!found) return deferred.reject(error("NOT_FOUND"));

      if (data.firstName) found.firstName = data.firstName;
      if (data.lastName) found.lastName = data.lastName;
      if (data.phone) found.phone = data.phone;

      found.save(function (err, manager) {
        if (err) {
          logger.error('Database error - ' + JSON.stringify(err) + 'while trying to update manager with id ' + id);
          return deferred.reject(error("MONGO_ERROR"));
        }
        return deferred.resolve(manager);
      });
    })
    .fail(function (err) {
      deferred.reject(err);
    });
  return deferred.promise;
};

/**
 * Find all managers
 * @returns {*}
 */
ManagerSchema.statics.getAll = function () {
  var deferred = Q.defer();
  model.find({}, function (err, managers) {
    if (err) return deferred.reject(err);
    return deferred.resolve(managers);
  });
  return deferred.promise;
};

/**
 * Remove manager by id
 * @param id
 * @returns {*}
 */
ManagerSchema.statics.remove = function (id) {
  var deferred = Q.defer();

  _findById(id).then(function (found) {
    if(!found) return deferred.reject(error("NOT_FOUND"));

    model.remove({_id: mongoose.Types.ObjectId(id)}, function (err) {
      if (err) {
        logger.error('Error deleting ' + name + ' manager for id ' + id, err);
        return deferred.reject(error('MONGO_ERROR'));
      }
      deferred.resolve();
    });
  })
  .fail(function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

var model = mongoose.model('manager', ManagerSchema);

module.exports = model;