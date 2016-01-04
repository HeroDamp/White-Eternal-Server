'use strict';

let color = require('../config/color');
let moment = require('moment');

let BR = '<br>';
let SPACE = '&nbsp;';
let profileColor = '#24678d';
let trainersprites = [1, 2, 101, 102, 169, 170, 265, 266, 168];

/**
 * Profile constructor.
 *
 * @param {Boolean} isOnline
 * @param {Object|String} user - if isOnline then Object else String
 * @param {String} image
 */
function Profile(isOnline, user, image) {
	this.isOnline = isOnline || false;
	this.user = user || null;
	this.image = image;

	this.username = Tools.escapeHTML(this.isOnline ? this.user.name : this.user);
	this.url = Config.avatarurl || '';
}

/**
 * Create an bold html tag element.
 *
 * Example:
 * createFont('Hello World!');
 * => '<b>Hello World!</b>'
 *
 * @param {String} color
 * @param {String} text
 * @return {String}
 */
function bold(text) {
	return '<b>' + text + '</b>';
}

/**
 * Create an font html tag element.
 *
 * Example:
 * createFont('Hello World!', 'blue');
 * => '<font color="blue">Hello World!</font>'
 *
 * @param {String} color
 * @param {String} text
 * @return {String}
 */
function font(color, text) {
	return '<font color="' + color + '">' + text + '</font>';
}

/**
 * Create an img tag element.
 *
 * Example:
 * createImg('phil.png');
 * => '<img src="phil.png" height="80" width="80" align="left">'
 *
 * @param {String} link
 * @return {String}
 */
function img(link) {
	return '<img src="' + link + '" height="80" width="80">';
}

/**
 * Create a font html element wrap around by a bold html element.
 * Uses to `profileColor` as a color.
 * Adds a colon at the end of the text and a SPACE at the end of the element.
 *
 * Example:
 * label('Name');
 * => '<b><font color="#24678d">Name:</font></b> '
 *
 * @param {String} text
 * @return {String}
 */
function label(text) {
	return bold(font(profileColor, text + ':')) + SPACE;
}

function currencyName(amount) {
	let name = " PD";
	return amount === 1 ? name : name + "";
}

Profile.prototype.avatar = function () {
	if (this.isOnline) {
		if (typeof this.image === 'string') return img(this.url + ':' + Config.port + '/avatars/' + this.image);
		return img('http://play.pokemonshowdown.com/sprites/trainers/' + this.image + '.png');
	}
	for (let name in Config.customAvatars) {
		if (this.username === name) {
			return img(this.url + ':' + Config.port + '/avatars/' + Config.customAvatars[name]);
		}
	}
	let selectedSprite = trainersprites[Math.floor(Math.random() * trainersprites.length)];
	return img('http://play.pokemonshowdown.com/sprites/trainers/' + selectedSprite + '.png');
};

Profile.prototype.buttonAvatar = function () {
	let css = 'border:none;background:none;padding:0;float:left;';
	return '<button style="' + css + '" name="parseCommand" value="/user ' + this.username + '">' + this.avatar() + "</button>";
};

Profile.prototype.group = function () {
	if (this.isOnline && this.user.group === ' ') return label('Grupo') + 'Usuario regular';
	if (this.isOnline) return label('Grupo') + Config.groups[this.user.group].name;
	for (let name in Users.usergroups) {
		if (toId(this.username) === name) {
			return label('Grupo') + Config.groups[Users.usergroups[name].charAt(0)].name;
		}
	}
	return label('Grupo') + 'Usuario regular';
};

Profile.prototype.money = function (amount) {
	return label('Dinero') + amount + currencyName(amount);
};

Profile.prototype.name = function () {
	return label('Nombre') + bold(font(color(toId(this.username)), this.username));
};

Profile.prototype.seen = function (timeAgo) {
	if (this.isOnline) return label('Online') + font('#2ECC40', 'Conectado');
	if (!timeAgo) return label('Online') + 'Desconectado';
	return label('Online') + moment(timeAgo).fromNow();
};

Profile.prototype.show = function (callback) {
	let userid = toId(this.username);

	Database.read('money', userid, function (err, money) {
		if (err) throw err;
		if (!money) money = 0;
		return callback(this.buttonAvatar() +
										SPACE + this.name() + BR +
										SPACE + this.group() + BR +
										SPACE + this.money(money) + BR +
										SPACE + this.seen(Seen[userid]) +
										'<br clear="all">');
	}.bind(this));
};

exports.commands = {
	profile: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if (target.length >= 19) return this.sendReply("Los nombres de usuarios deben tener menos de 19 carácteres.");
		let targetUser = this.targetUserOrSelf(target);
		let profile;
		if (!targetUser) {
			profile = new Profile(false, target);
		} else {
			profile = new Profile(true, targetUser, targetUser.avatar);
		}
		profile.show(function (display) {
			this.sendReplyBox(display);
			room.update();
		}.bind(this));
	},
	profilehelp: ["/profile -	Shows information regarding user's name, group, money, and when they were last seen."]
};
