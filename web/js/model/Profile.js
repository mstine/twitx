goog.provide('twitx.model.Profile');

/**
 * The model object representing a user profile.
 *
 * @param {object=} opt_json optional json initializer.
 * @constructor
 */
twitx.model.Profile = function(opt_json) {
  if (opt_json) {

  /**
   * id the Mongo document id for this profile
   * @private
   * @type {string}
   */
  this.id_ = opt_json._id;

  /**
   * username the username for this profile
   * @private
   * @type {string}
   */
  this.username_ = opt_json.username;

  /**
   * password the password for this profile
   * @private
   * @type {string}
   */
  this.password_ = opt_json.password;

  /**
   * email the email for this profile
   * @private
   * @type {string}
   */
  this.email_ = opt_json.email;

  /**
   * fullName the fullName for this profile
   * @private
   * @type {string}
   */
  this.fullName_ = opt_json.fullname;
  }
};

/**
 * @return {string} the id for the profile.
 */
twitx.model.Profile.prototype.getId = function() {
  return this.id_;
};

/**
 * @return {string} the username for the profile.
 */
twitx.model.Profile.prototype.getUsername = function() {
  return this.username_;
};

/**
 * @return {string} the password for the profile.
 */
twitx.model.Profile.prototype.getPassword = function() {
  return this.password_;
};

/**
 * @return {string} the email for the profile.
 */
twitx.model.Profile.prototype.getEmail = function() {
  return this.email_;
};

/**
 * @return {string} the fullName for the profile.
 */
twitx.model.Profile.prototype.getFullName = function() {
  return this.fullName_;
};

