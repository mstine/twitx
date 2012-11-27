goog.provide('twitx');

goog.require('twitx.model.TwitxMessageList');
goog.require('twitx.model.Profile');
goog.require('twitx.view');
goog.require('goog.ui.Button');
goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('goog.string');
goog.require('goog.dom.classes');

/**
 * @fileoverview The controller/business logic for the application client-side.
 */

/**
 * @type {twitx.model.TwitxMessageList}
 */
var messages = new twitx.model.TwitxMessageList();
messages.addEventListener(twitx.model.TwitxMessageList.ChangeEventType,
                          redraw);

/**
 * @type {?}
 */
var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');

/**
 * @type {Element}
 */
var username = document.getElementById('username');
goog.events.listen(username, goog.events.EventType.KEYUP, function(e) {
  if (e.keyCode !== goog.events.KeyCodes.ENTER) {
    return;
  }
  login();
});

/**
 * @type {Element}
 */
var password = document.getElementById('password');
goog.events.listen(password, goog.events.EventType.KEYUP, function(e) {
  if (e.keyCode !== goog.events.KeyCodes.ENTER) {
    return;
  }
  login();
});

/**
 * @type {string}
 */
var sessionID = '';

/**
 * @type {boolean}
 */
var authenticated = sessionID !== '';

/**
 * @type {boolean}
 */
var showLoginForm = !authenticated;

/**
 * @type {twitx.model.Profile}
 */
var profile = new twitx.model.Profile();

/**
 * @type {goog.ui.Button}
 */
var btnLogin = new goog.ui.Button();
btnLogin.decorate(goog.dom.getElement('btn_login'));
goog.events.listen(btnLogin, goog.ui.Component.EventType.ACTION,
                   function(e) {
                     login();
                   });
                  
/**
 * @type {goog.ui.Button}
 */
var btnTwitxIt = new goog.ui.Button();
btnTwitxIt.decorate(goog.dom.getElement('btn_twitxit'));
goog.events.listen(btnTwitxIt, goog.ui.Component.EventType.ACTION,
                   function(e) {
                     twitxIt();
                   });

/**
 * @type {Element}
 */
var twitxBox = document.getElementById('twitx-box');
goog.events.listen(twitxBox, goog.events.EventType.KEYUP, function(e) {
  if (e.keyCode !== goog.events.KeyCodes.ENTER) {
    return;
  }
  twitxIt();
});

function twitxIt() {
  // get the text
  var value = goog.string.trim(twitxBox.value);
  if (value === '') {
    return;
  }
  // clear the input box
  twitxBox.value = '';
  // send the message
  eb.send('messages.incoming', { username: profile.getUsername(),
          message: value });
}

function login() {
  var my_username = goog.string.trim(username.value);
  var my_password = goog.string.trim(password.value);

  if (my_username !== '' && my_password !== '') {
    eb.send('vertx.basicauthmanager.login', {username: my_username, password: my_password}, function(reply) {
      if (reply.status === 'ok') {
        sessionID = reply.sessionID;
        primeMessageStream(my_username);

        eb.registerHandler('messages.outgoing.' + my_username, function(message) {
          // If this is a result of prime, will be a JSON object w/ results array
          if (goog.isArray(message.results)) {
            goog.array.forEach(message.results, function(item) {
              messages.add(item);
            });
            // Otherwise it is a plain message
          } else {
            messages.add(message);
          }
        });
      } else {
        alert('Invalid Username/Password. Please try again.');
      }
    });
  }
}

function primeMessageStream(username) {
  if (goog.string.trim(username) !== '') {
    eb.send('messages.primestream', { username: username },
            function(reply) {
              if (reply.status === 'ok') {
                profile = new twitx.model.Profile(reply.result);
                goog.dom.classes.toggle(goog.dom.getElement('login-form'), 'inactive');
                goog.dom.classes.toggle(goog.dom.getElement('twitx-form'), 'inactive');
                goog.dom.getElement('user-fullname').innerHTML = profile.getFullName();
                goog.dom.getElement('twitx-box').focus();
              }
            });
  }
}

function redraw() {
  var data = {
    messages: messages.getAll()
  };
  goog.dom.getElement('stream-container').innerHTML = twitx.view.streamContainer(data);
}

