/*
* Poll chat plugin
* By bumbadadabum and Zarel.
*/

'use strict';

const permission = 'announce';

class Poll {
	constructor(room, question, options) {
		if (room.pollNumber) {
			room.pollNumber++;
		} else {
			room.pollNumber = 1;
		}
		this.room = room;
		this.question = question;
		this.voters = {};
		this.voterIps = {};
		this.totalVotes = 0;
		this.timeout = null;
		this.timeoutMins = 0;

		this.options = new Map();
		for (let i = 0; i < options.length; i++) {
			this.options.set(i + 1, {name: options[i], votes: 0});
		}
	}

	vote(user, option) {
		let ip = user.latestIp;
		let userid = user.userid;

		if (userid in this.voters || ip in this.voterIps) {
			return user.sendTo(this.room, "Ya has votado para esta encuesta.");
		}

		this.voters[userid] = option;
		this.voterIps[ip] = option;
		this.options.get(option).votes++;
		this.totalVotes++;

		this.update();
	}

	blankvote(user, option) {
		let ip = user.latestIp;
		let userid = user.userid;

		if (userid in this.voters || ip in this.voterIps) {
			return user.sendTo(this.room, "Estas mirando los resultados.");
		} else {
			this.voters[userid] = 0;
			this.voterIps[ip] = 0;
		}

		this.update();
	}

	generateVotes() {
		let output = '<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> Poll</span> <strong style="font-size:11pt">' + Tools.escapeHTML(this.question) + '</strong></p>';
		this.options.forEach(function (option, number) {
			output += '<div style="margin-top: 5px"><button value="/poll vote ' + number + '" name="send" title="Vota por ' + number + '. ' + Tools.escapeHTML(option.name) + '">' + number + '. <strong>' + Tools.escapeHTML(option.name) + '</strong></button></div>';
		});
		output += '<div style="margin-top: 7px; padding-left: 12px"><button value="/poll results" name="send" title="Ver resultados - no podrás votar después de haber visto los resultados"><small>(Ver resultados)</small></button></div>';
		output += '</div>';

		return output;
	}

	generateResults(ended, option) {
		let icon = '<span style="border:1px solid #' + (ended ? '777;color:#555' : '6A6;color:#484') + ';border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> ' + (ended ? "Poll ended" : "Poll") + '</span>';
		let output = '<div class="infobox"><p style="margin: 2px 0 5px 0">' + icon + ' <strong style="font-size:11pt">' + Tools.escapeHTML(this.question) + '</strong></p>';
		let iter = this.options.entries();

		let i = iter.next();
		let c = 0;
		let colors = ['#79A', '#8A8', '#88B'];
		while (!i.done) {
			let percentage = Math.round((i.value[1].votes * 100) / (this.totalVotes || 1));
			output += '<div style="margin-top: 3px">' + i.value[0] + '. <strong>' + (i.value[0] === option ? '<em>' : '') + Tools.escapeHTML(i.value[1].name) + (i.value[0] === option ? '</em>' : '') + '</strong> <small>(' + i.value[1].votes + ' vote' + (i.value[1].votes === 1 ? '' : 's') + ')</small><br /><span style="font-size:7pt;background:' + colors[c % 3] + ';padding-right:' + (percentage * 3) + 'px"></span><small>&nbsp;' + percentage + '%</small></div>';
			i = iter.next();
			c++;
		}
		output += '</div>';

		return output;
	}

	update() {
		let results = [];

		for (let i = 0; i <= this.options.size; i++) {
			results.push(this.generateResults(false, i));
		}

		// Update the poll results for everyone that has voted
		for (let i in this.room.users) {
			let user = this.room.users[i];
			if (user.userid in this.voters) {
				user.sendTo(this.room, '|uhtmlchange|poll' + this.room.pollNumber + '|' + results[this.voters[user.userid]]);
			} else if (user.latestIp in this.voterIps) {
				user.sendTo(this.room, '|uhtmlchange|poll' + this.room.pollNumber + '|' + results[this.voterIps[user.latestIp]]);
			}
		}
	}

	display(user, broadcast) {
		let votes = this.generateVotes();

		let results = [];

		for (let i = 0; i <= this.options.size; i++) {
			results.push(this.generateResults(false, i));
		}

		let target = {};

		if (broadcast) {
			target = this.room.users;
		} else {
			target[0] = user;
		}

		for (let i in target) {
			let thisUser = target[i];
			if (thisUser.userid in this.voters) {
				thisUser.sendTo(this.room, '|uhtml|poll' + this.room.pollNumber + '|' + results[this.voters[thisUser.userid]]);
			} else if (thisUser.latestIp in this.voterIps) {
				thisUser.sendTo(this.room, '|uhtml|poll' + this.room.pollNumber + '|' + results[this.voterIps[thisUser.latestIp]]);
			} else {
				thisUser.sendTo(this.room, '|uhtml|poll' + this.room.pollNumber + '|' + votes);
			}
		}
	}

	end() {
		let results = this.generateResults(true);

		this.room.send('|uhtmlchange|poll' + this.room.pollNumber + '|<div class="infobox">(La encuesta ha terminado &ndash; mira los resultados)</div>');
		this.room.add('|html|' + results);
	}
}

exports.commands = {
	poll: {
		create: 'new',
		new: function (target, room, user, connection, cmd, message) {
			if (!target) return this.parse('/help poll new');
			if (target.length > 1024) return this.errorReply("La encuesta es muy larga.");
			let params = target.split(target.includes('|') ? '|' : ',').map(function (param) { return param.trim(); });

			if (!this.can(permission, null, room)) return false;
			if (!this.canTalk()) return this.errorReply("No puedes hacer esto al no tener permitido hablar.");
			if (room.poll) return this.errorReply("Hay actualmente una encuesta en progreso en esta sala.");

			if (params.length < 3) return this.errorReply("No hay suficientes argumentos para usar /poll new.");
			let options = [];

			for (let i = 1; i < params.length; i++) {
				options.push(params[i]);
			}

			if (options.length > 8) {
				return this.errorReply("Muchas opciones (lo máximo son 8).");
			}

			room.poll = new Poll(room, params[0], options);
			room.poll.display(user, true);

			this.logEntry("" + user.name + " uso " + message);
			return this.privateModCommand("(Una encuesta ha sido creada por " + user.name + ".)");
		},
		newhelp: ["/poll create [question], [option1], [option2], [...] - Creates a poll. Requires: % @ # & ~"],

		vote: function (target, room, user) {
			if (!room.poll) return this.errorReply("No hay encuestas en progreso en esta sala.");
			if (!target) return this.parse('/help poll vote');

			if (target === 'blank') {
				room.poll.blankvote(user);
				return;
			}

			let parsed = parseInt(target, 10);
			if (isNaN(parsed)) return this.errorReply("Para votar, especifica el número de la opción.");

			if (!room.poll.options.has(parsed)) return this.sendReply("La opción no se ha encontrado en la encuesta.");

			room.poll.vote(user, parsed);
		},
		votehelp: ["/poll vote [number] - Votes for option [number]."],

		timer: function (target, room, user) {
			if (!room.poll) return this.errorReply("No hay una encuesta en progreso en esta sala.");

			if (target) {
				if (!this.can(permission, null, room)) return false;
				if (target === 'clear') {
					if (!room.poll.timeout) return this.errorReply("No hay tiempo para borrar.");
					clearTimeout(room.poll.timeout);
					room.poll.timeout = null;
					room.poll.timeoutMins = 0;
					return this.add("El tiempo de la encuesta ha sido cambiado.");
				}
				let timeout = parseFloat(target);
				if (isNaN(timeout) || timeout <= 0 || timeout > 0x7FFFFFFF) return this.errorReply("Se ha dado un tiempo invalido.");
				if (room.poll.timeout) clearTimeout(room.poll.timeout);
				room.poll.timeoutMins = timeout;
				room.poll.timeout = setTimeout((function () {
					room.poll.end();
					delete room.poll;
				}), (timeout * 60000));
				room.add("El tiempo de la encuesta ha sido cambiado a " + timeout + " minutos.");
				return this.privateModCommand("(El tiempo de la encuesta ha sido puesto durante " + timeout + " minutos por " + user.name + ".)");
			} else {
				if (!this.canBroadcast()) return;
				if (room.poll.timeout) {
					return this.sendReply("El tiempo para la encuesta es de " + room.poll.timeoutMins + " minutos.");
				} else {
					return this.sendReply("No hay tiempo para esta encuesta.");
				}
			}
		},
		timerhelp: ["/poll timer [minutes] - Sets the poll to automatically end after [minutes] minutes. Requires: % @ # & ~", "/poll timer clear - Clears the poll's timer. Requires: % @ # & ~"],

		results: function (target, room, user) {
			if (!room.poll) return this.errorReply("No hay una encuesta en progreso en esta room.");

			return room.poll.blankvote(user);
		},
		resultshelp: ["/poll results - Shows the results of the poll without voting. NOTE: you can't go back and vote after using this."],

		close: 'end',
		stop: 'end',
		end: function (target, room, user) {
			if (!this.can(permission, null, room)) return false;
			if (!this.canTalk()) return this.errorReply("No puedes usar este comando mientras no tengas permitido hablar.");
			if (!room.poll) return this.errorReply("No hay una encuesta en progreso en esta room.");
			if (room.poll.timeout) clearTimeout(room.poll.timeout);

			room.poll.end();
			delete room.poll;
			return this.privateModCommand("(La encuesta ha sido finalizada por " + user.name + ".)");
		},
		endhelp: ["/poll end - Ends a poll and displays the results. Requires: % @ # & ~"],

		show: 'display',
		display: function (target, room, user) {
			if (!room.poll) return this.errorReply("No hay una encuesta en progreso en esta room.");
			if (!this.canBroadcast()) return;
			room.update();

			room.poll.display(user, this.broadcasting);
		},
		displayhelp: ["/poll display - Displays the poll"],

		'': function (target, room, user) {
			this.parse('/help poll');
		}
	},
	pollhelp: ["/poll permite a los usuarios realizar sus propias encuestas. Solo se permite una encuesta a la vez.",
				"Las encuestas se realizan con los siguientes comandos:",
				"/poll create [pregunta], [opcion1], [opcion2], [...] - Creas una encuesta. NOTA: Solo se pueden agregar 8 opciones. Requiere: % @ # & ~",
				"/poll vote [number] - Votas por la opción según su número.",
				"/poll timer [minutes] - Se agrega el tiempo limitado para que la encuesta termine en x minutos. Requiere: % @ # & ~",
				"/poll results - Muestra los resultados de la encuesta sin haber votado. NOTA: no podrás volver a votar.",
				"/poll display - Muestra una encuesta",
				"/poll end - Finaliza una encuesta y muestra los resultados. Requiere: % @ # & ~"]
};
