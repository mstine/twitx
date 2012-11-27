goog.provide('twitx.model.TwitxMessageList');

goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
twitx.model.TwitxMessageList = function() {

  /**
   * @type {!Array.<string>}
   * @private
   */
  this.items_ = [];
};
goog.inherits(twitx.model.TwitxMessageList, goog.events.EventTarget);

/**
 * @param {!string} message A message to add to the list.
 */
twitx.model.TwitxMessageList.prototype.add = function(message) {
  this.items_.unshift(message);
  this.dispatchEvent(new twitx.model.TwitxMessageList.ChangeEvent(this));
};

/**
 * @return {Array.<string>} All of the stored messages.
 */
twitx.model.TwitxMessageList.prototype.getAll = function() {
  return this.items_;
};

/**
 * @const
 */
twitx.model.TwitxMessageList.ChangeEventType = 'change';

/**
 * @constructor
 * @extends {goog.events.Event}
 * @param {twitx.model.TwitxMessageList} target The message list.
 */
twitx.model.TwitxMessageList.ChangeEvent = function(target) {
  goog.events.Event.call(this,
                         twitx.model.TwitxMessageList.ChangeEventType, target);
};
goog.inherits(twitx.model.TwitxMessageList.ChangeEvent, goog.events.Event);

