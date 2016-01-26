'use strict';

let color = require('../config/color');

exports.parseEmoticons = parseEmoticons;

let emotes = {
	'#freewolf': 'http://i.imgur.com/ybxWXiG.png',
	'feelsbd': 'http://i.imgur.com/YyEdmwX.png',
	'feelsbm': 'http://i.imgur.com/xwfJb2z.png',
	'feelsbn': 'http://i.imgur.com/wp51rIg.png',
	'feelsdd': 'http://i.imgur.com/fXtdLtV.png',
	'feelsdoge': 'http://i.imgur.com/GklYWvi.png',
	'feelsgd': 'http://i.imgur.com/Jf0n4BL.png',
	'feelsgn': 'http://i.imgur.com/juJQh0J.png',
	'feelshp': 'http://i.imgur.com/1W19BDG.png',
	'feelsmd': 'http://i.imgur.com/DJHMdSw.png',
	'feelsnv': 'http://i.imgur.com/XF6kIdJ.png',
	'feelsok': 'http://i.imgur.com/gu3Osve.png',
	'feelspika': 'http://i.imgur.com/mBq3BAW.png',
	'feelspink': 'http://i.imgur.com/jqfB8Di.png',
	'feelspn': 'http://i.imgur.com/wSSM6Zk.png',
	'feelspr': 'http://i.imgur.com/3VtkKfJ.png',
	'feelsrg': 'http://i.imgur.com/DsRQCsI.png',
	'feelsrs': 'http://i.imgur.com/qGEot0R.png',
	'feelssc': 'http://i.imgur.com/cm6oTZ1.png',
	':bye:': 'http://emoticoner.com/files/emoticons/rice_ball/rice-ball-smiley-05.gif',
	':lengua:': 'http://emoticoner.com/files/emoticons/rice_ball/rice-ball-smiley-10.gif',
	':spam:': 'http://emoticoner.com/files/emoticons/smiley_faces/poster-spam-smiley-face.gif',
	':absuli:': 'http://a.deviantart.net/avatars/o/m/omega-lord.gif',
	':(': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0101-sadsmile.gif',
	':D': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0102-bigsmile.gif',
	':)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0100-smile.gif',
	';(': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0106-crying.gif',
	';)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0105-wink.gif',
	':$': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0111-blush.gif',
	'xD': 'http://www.animaatjes.nl/smileys/smileys-en-emoticons/xd/animaatjes-xd-09561.gif',
	':buizel:': 'http://orig11.deviantart.net/079c/f/2008/244/6/a/caramel__buizel_by_raidragonair.gif',
	':pikachu:': 'http://cbc.pokecommunity.com/config/emoticons/pikachu.png',
	':eevee:': 'http://cbc.pokecommunity.com/config/emoticons/eevee.png',
	':sayan:': 'http://emoticoner.com/files/emoticons/blacko/blacko-emoticon-17.gif?1292951356',
	':leaf:': 'http://emoticoner.com/files/emoticons/leaf/happy-leaf-emoticon.gif?1292794623',
	':senpai:': 'http://cbc.pokecommunity.com/config/emoticons/senpai.png',
	':taco:': 'http://cbc.pokecommunity.com/config/emoticons/taco.png',
	':superman:': 'http://cbc.pokecommunity.com/config/emoticons/superman.png',
	':ditto:': 'http://i.imgur.com/ampqCZi.gif',
	':raichu:': 'http://cbc.pokecommunity.com/config/emoticons/raichu.png',
	':wynaut:': 'http://cbc.pokecommunity.com/config/emoticons/wynaut.png',
	'moo': 'http://cbc.pokecommunity.com/config/emoticons/moo.gif',
	':naruto:': 'http://lh4.ggpht.com/_QwvI2Zom950/TAdYX8-5gQI/AAAAAAAAAu0/2ng4u2V9-1Y/s128/naruto.gif'
};

let emotesKeys = Object.keys(emotes);
let patterns = [];
let metachars = /[[\]{}()*+?.\\|^$\-,&#\s]/g;

for (let i in emotes) {
	if (emotes.hasOwnProperty(i)) {
		patterns.push('(' + i.replace(metachars, '\\$&') + ')');
	}
}
let patternRegex = new RegExp(patterns.join('|'), 'g');

/**
 * Parse emoticons in message.
 *
 * @param {String} message
 * @param {Object} room
 * @param {Object} user
 * @param {Boolean} pm - returns a string if it is in private messages
 * @returns {Boolean|String}
 */
function parseEmoticons(message, room, user, pm) {
	if (typeof message !== 'string' || (!pm && room.disableEmoticons)) return false;

	let match = false;
	let len = emotesKeys.length;


	while (len--) {
		if (message && message.indexOf(emotesKeys[len]) >= 0) {
			match = true;
			break;
		}
	}

	if (!match) return false;

	// escape HTML
	message = Tools.escapeHTML(message);

	// add emotes
	message = message.replace(patternRegex, function (match) {
		let emote = emotes[match];
		return typeof emote === 'string' ? '<img src="' + emote + '" title="' + match + '" height="50" width="50" />' : match;
	});

	// __italics__
	message = message.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>');

	// **bold**
	message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>');

	let group = user.getIdentity().charAt(0);
	if (room.auth) group = room.auth[user.userid] || group;

	let style = "background:none;border:0;padding:0 5px 0 0;font-family:Verdana,Helvetica,Arial,sans-serif;font-size:9pt;cursor:pointer";

	message = "<div class='chat'>" + "<small>" + group + "</small>" + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>" + "<b><font color='" + color(user.userid) + "'>" + user.name + ":</font></b>" + "</button><em class='mine'>" + message + "</em></div>";
	if (pm) return message;

	room.addRaw(message);

	return true;
}

/**
 * Create a two column table listing emoticons.
 *
 * @return {String} emotes table
 */
function create_table() {
	let emotes_name = Object.keys(emotes);
	let emotes_list = [];
	let emotes_group_list = [];
	let len = emotes_name.length;
	let i;

	for (i = 0; i < len; i++) {
		emotes_list.push("<td>" +
			"<img src='" + emotes[emotes_name[i]] + "'' title='" + emotes_name[i] + "' height='50' width='50' />" +
			emotes_name[i] + "</td>");
	}

	let emotes_list_right = emotes_list.splice(len / 2, len / 2);

	for (i = 0; i < len / 2; i++) {
		let emote1 = emotes_list[i],
			emote2 = emotes_list_right[i];
		if (emote2) {
			emotes_group_list.push("<tr>" + emote1 + emote2 + "</tr>");
		} else {
			emotes_group_list.push("<tr>" + emote1 + "</tr>");
		}
	}

	return "<div class='infobox'><center><b><u>Lista de emoticones</u></b></center>" + "<div class='infobox-limited'><table border='1' cellspacing='0' cellpadding='5' width='100%'>" + "<tbody>" + emotes_group_list.join("") + "</tbody>" + "</table></div></div>";
}

let emotes_table = create_table();

exports.commands = {
	blockemote: 'blockemoticons',
	blockemotes: 'blockemoticons',
	blockemoticon: 'blockemoticons',
	blockemoticons: function (target, room, user) {
		if (user.blockEmoticons === (target || true)) return this.sendReply("Tu actualmente estas bloqueando los emoticones en tus mensajes privados! Para quitarlos, utiliza /unblockemoticons");
		user.blockEmoticons = true;
		return this.sendReply("Tu ahora estas bloqueando los emoticones en los mensajes privados.");
	},
	blockemoticonshelp: ["/blockemoticons - Quitas los emoticones en los mensajes privados. Para quitarlos, usa /unblockemoticons."],

	unblockemote: 'unblockemoticons',
	unblockemotes: 'unblockemoticons',
	unblockemoticon: 'unblockemoticons',
	unblockemoticons: function (target, room, user) {
		if (!user.blockEmoticons) return this.sendReply("Tu ya no estas bloqueando los emoticones en tus mensajes privados! Para hacerlo, utiliza /blockemoticons");
		user.blockEmoticons = false;
		return this.sendReply("Tu ya no estas bloqueando emoticones en los mensajes privados.");
	},
	unblockemoticonshelp: ["/unblockemoticons - Quitas el bloqueo de emoticones en los mensajes privados. Para bloquearlos, usa /blockemoticons."],

	emotes: 'emoticons',
	emoticons: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply("|raw|" + emotes_table);
	},
	emoticonshelp: ["/emoticons - Get a list of emoticons."],

	toggleemote: 'toggleemoticons',
	toggleemotes: 'toggleemoticons',
	toggleemoticons: function (target, room, user) {
		if (!this.can('declare', null, room)) return false;
		room.disableEmoticons = !room.disableEmoticons;
		this.sendReply("Disallowing emoticons is set to " + room.disableEmoticons + " in this room.");
		if (room.disableEmoticons) {
			this.add("|raw|<div class=\"broadcast-red\"><b>Los emoticones han sido removidos!</b><br />Los emoticones ahora estan desactivados.</div>");
		} else {
			this.add("|raw|<div class=\"broadcast-blue\"><b>Los emoticones han sido habilitados!</b><br />Los emoticones ahora estan disponibles.</div>");
		}
	},
	toggleemoticonshelp: ["/toggleemoticons - Toggle emoticons on or off."],

	rande: 'randemote',
	randemote: function (target, room, user) {
		if (!this.canBroadcast()) return;
		let rng = Math.floor(Math.random() * emotesKeys.length);
		let randomEmote = emotesKeys[rng];
		this.sendReplyBox("<img src='" + emotes[randomEmote] + "' title='" + randomEmote + "' height='50' width='50' />");
	},
	randemotehelp: ["/randemote - Get a random emote."]
};
