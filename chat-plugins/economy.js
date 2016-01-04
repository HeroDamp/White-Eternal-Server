'use strict';

let fs = require('fs');
let path = require('path');

let shop = [
	['Ticket', 'Compras un ticket para jugar la lotería. (Tienes chance de ganar mucho dinero)', 5],
	['Simbolo', 'Compras un simbolo personalizado junto a tu nombre. (Lo obtendrás de manera temporal)', 100],
	['Avatar', 'Compras un avatar personalizado. (La imagen deberá ser de 80x80)', 200],
	['Trainer Card', 'Compras una targeta de entrenador. (Contactar a un administrador para obtener este articulo)', 200],
	['Cambio', 'Cambias tu Avatar o TC. (No comprar en caso de no disponer de ninguno de los dos)', 150],
	['Sala', 'Compras una sala privada. (En caso de romper las reglas sera eliminada.)', 1000]
];

let shopDisplay = getShopDisplay(shop);

/**
 * Gets an amount and returns the amount with the name of the currency.
 *
 * @examples
 * currencyName(0); // 0 bucks
 * currencyName(1); // 1 buck
 * currencyName(5); // 5 bucks
 *
 * @param {Number} amount
 * @returns {String}
 */
function currencyName(amount) {
	let name = " PD";
	return amount === 1 ? name : name + "";
}

/**
 * Checks if the money input is actually money.
 *
 * @param {String} money
 * @return {String|Number}
 */
function isMoney(money) {
	let numMoney = Number(money);
	if (isNaN(money)) return "Debe ser un número.";
	if (String(money).includes('.')) return "No puede contener un decimal.";
	if (numMoney < 1) return "No puede ser menos de 1 PokeDolar.";
	return numMoney;
}

/**
 * Log money to logs/money.txt file.
 *
 * @param {String} message
 */
function logMoney(message) {
	if (!message) return;
	let file = path.join(__dirname, '../logs/money.txt');
	let date = "[" + new Date().toUTCString() + "] ";
	let msg = message + "\n";
	fs.appendFile(file, date + msg);
}

/**
 * Displays the shop
 *
 * @param {Array} shop
 * @return {String} display
 */
function getShopDisplay(shop) {
	let display = "<hr><center><font size=4><b><u>Tienda de Pokémon Hispano</u></b></size></center><hr><br><table border='1' cellspacing='0' cellpadding='5' width='100%'>" +
					"<tbody><tr><th>Artículo</th><th>Descripción</th><th>Precio</th></tr>";
	let start = 0;
	while (start < shop.length) {
		display += "<tr>" +
						"<td align='center'><button name='send' value='/buy " + shop[start][0] + "'><b>" + shop[start][0] + "</b></button>" + "</td>" +
						"<td align='center'>" + shop[start][1] + "</td>" +
						"<td align='center'><font color=green><b>" + shop[start][2] + "</b></font></td>" +
					"</tr>";
		start++;
	}
	display += "</tbody></table><br><center>Para comprar un articulo de la tienda, usa el comando <b>/buy [Nombre]</b>.</center><center>También puedes comprar los articulos directamente haciendo click en los botones.</center><center>Para mayor información, utiliza <b>/ayudatienda</b>.</center>";
	return display;
}


/**
 * Find the item in the shop.
 *
 * @param {String} item
 * @param {Number} money
 * @return {Object}
 */
function findItem(item, money) {
	let len = shop.length;
	let price = 0;
	let amount = 0;
	while (len--) {
		if (item.toLowerCase() !== shop[len][0].toLowerCase()) continue;
		price = shop[len][2];
		if (price > money) {
			amount = price - money;
			this.errorReply("No dispones de suficiente dinero como para comprar este articulo. Necesitas " + amount + currencyName(amount) + " más para comprar " + item + ".");
			return false;
		}
		return price;
	}
	this.errorReply(item + " no se encuentra en la tienda.");
}

/**
 * Handling the bought item from the shop.
 *
 * @param {String} item
 * @param {Object} user
 * @param {Number} cost - for lottery
 */
function handleBoughtItem(item, user, cost) {
	if (item === 'simbolo') {
		user.canCustomSymbol = true;
		this.sendReply("Has comprado un Simbolo personalizado. Puedes usar /customsymbol para obtenerlo.");
		this.sendReply("Se tiene hasta que cierres la sesión por más de una hora.");
		this.sendReply("Si ya no quieres tu simbolo personalizado, usa el comando /resetsymbol para volver a tu simbolo anterior.");
	} else if (item === 'ticket') {
		let _this = this;
		Database.get('pot', function (err, pot) {
			if (err) throw err;
			if (!pot) pot = 0;
			Database.set('pot', pot + cost,  function (err, pot) {
				if (err) throw err;
				Database.read('tickets', user.userid, function (err, tickets) {
					if (err) throw err;
					if (!tickets) tickets = [];
					let ticket = '' + rng() + rng() + rng();
					tickets.push(ticket);
					Database.write('tickets', tickets, user.userid, function (err) {
						if (err) throw err;
						_this.sendReply("Tu ticket tiene este ID: " + ticket + ". El premio gordo vale actualmente " + pot + currencyName(pot) + ". Utiliza /tickets para ver tus tickets.");
					});
				});
			});
		});
	} else {
		let msg = '**' + user.name + " ha comprado el articulo " + item + ".**";
		Rooms.rooms.staff.add('|c|~Tienda PH|' + msg);
		Rooms.rooms.staff.update();
		for (let user of Users.users) {
			user = user[1];
			if (user.group === '~' || user.group === '&') {
				user.send('|pm|~Tienda PH|' + user.getIdentity() + '|' + msg);
			}
		}
	}
}

/**
 * Generates a random number between 0 and 1000.
 *
 * @return {Number}
 */
function rng() {
	return Math.floor(Math.random() * 1000);
}

exports.commands = {
	pd: 'pd',
	pd: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if (!target) target = user.name;

		Database.read('money', toId(target), function (err, amount) {
			if (err) throw err;
			if (!amount) amount = 0;
			this.sendReplyBox(" Ahorros de <b>" + user.name + "</b>: " + amount + currencyName(amount) + ".");
			room.update();
		}.bind(this));
	},
	wallethelp: ["/pd [user] - Shows the amount of money a user has."],

	dardinero: 'givemoney',
	givebucks: 'givemoney',
	givemoney: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!target || target.indexOf(',') < 0) return this.parse('/help givemoney');

		let parts = target.split(',');
		let username = parts[0];
		let amount = isMoney(parts[1]);

		if (typeof amount === 'string') return this.errorReply(amount);

		let _this = this;
		Database.read('money', toId(username), function (err, initial) {
			if (err) throw err;
			if (!initial) initial = 0;
			Database.write('money', initial + amount, toId(username), function (err, total) {
				if (err) throw err;
				amount = amount + currencyName(amount);
				total = total + currencyName(total);
				_this.sendReply(" A " + username + " se le dio " + amount + ". ahora tiene " + total + ".");
				if (Users.get(username)) Users.get(username).popup(user.name + " te ha dado " + amount + ". Ahora tienes " + total + ".");
				logMoney(username + " se le dio un monto de " + amount + " por " + user.name + ".");
			});
		});
	},
	givemoneyhelp: ["/givemoney [user], [amount] - Give a user a certain amount of money."],

	quitardinero: 'takemoney',
	takebucks: 'takemoney',
	takemoney: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!target || target.indexOf(',') < 0) return this.parse('/help takemoney');

		let parts = target.split(',');
		let username = parts[0];
		let amount = isMoney(parts[1]);

		if (typeof amount === 'string') return this.errorReply(amount);

		let _this = this;
		Database.read('money', toId(username), function (err, initial) {
			if (err) throw err;
			if (!initial) initial = 0;
			Database.write('money', initial - amount, toId(username), function (err, total) {
				if (err) throw err;
				amount = amount + currencyName(amount);
				total = total + currencyName(total);
				_this.sendReply(username + " perdió " + amount + ". Ahora tiene un total de " + total + ".");
				if (Users.get(username)) Users.get(username).popup(user.name + " te ha quitado " + amount + " PokeDolares de tu cuenta. Ahora tienes " + total + ".");
				logMoney(username + " tenía " + amount + " quitados por " + user.name + ".");
			});
		});
	},
	takemoneyhelp: ["/takemoney [user], [amount] - Take a certain amount of money from a user."],

	resetpd: 'resetmoney',
	resetdinero: 'resetmoney',
	resetmoney: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		Database.write('money', 0, toId(target), function (err, total) {
			if (err) throw err;
			this.sendReply(target + " ahora tiene un total de " + total + currencyName(total) + ".");
			logMoney(user.name + " ha reseteado el dinero de " + target + ".");
		}.bind(this));
	},
	resetmoneyhelp: ["/resetmoney [user] - Reset user's money to zero."],

	donardinero: 'transfermoney',
	transferbuck: 'transfermoney',
	transferbucks: 'transfermoney',
	transfermoney: function (target, room, user) {
		if (!target || target.indexOf(',') < 0) return this.parse('/help transfermoney');

		let parts = target.split(',');
		let username = parts[0];
		let amount = isMoney(parts[1]);

		if (toId(username) === user.userid) return this.errorReply("No te puedes donar dinero a ti mismo.");
		if (username.length > 19) return this.errorReply("El nombre de usuario no puede tener mas de 19 carácteres.");
		if (typeof amount === 'string') return this.errorReply(amount);

		let _this = this;
		Database.read('money', user.userid, function (err, userTotal) {
			if (err) throw err;
			if (!userTotal) userTotal = 0;
			if (amount > userTotal) return _this.errorReply("No puedes donar más dinero del que ya tienes..");
			Database.read('money', toId(username), function (err, targetTotal) {
				if (err) throw err;
				if (!targetTotal) targetTotal = 0;
				Database.write('money', userTotal - amount, user.userid, function (err, userTotal) {
					Database.write('money', targetTotal + amount, toId(username), function (err, targetTotal) {
						amount = amount + currencyName(amount);
						userTotal = userTotal + currencyName(userTotal);
						targetTotal = targetTotal + currencyName(targetTotal);
						_this.sendReply("Has donado exitosamente " + amount + ". Ahora tienes " + userTotal + ".");
						if (Users.get(username)) Users.get(username).popup(user.name + " has donado " + amount + ". Ahora tienes " + targetTotal + ".");
						logMoney(user.name + " donó un monto de " + amount + " a " + username + ". " + user.name + " ahora tiene " + userTotal + " y " + username + " tiene " + targetTotal + ".");
					});
				});
			});
		});
	},
	transfermoneyhelp: ["/transfer [user], [amount] - Transfer a certain amount of money to a user."],

	tienda: 'shop',
	shop: function (target, room, user) {
		if (!this.canBroadcast()) return;
		return this.sendReply("|raw|" + shopDisplay);
	},
	shophelp: ["/shop - Display items you can buy with money."],

	comprar: 'buy',
	buy: function (target, room, user) {
		if (!target) return this.parse('/help buy');
		let _this = this;
		Database.read('money', user.userid, function (err, amount) {
			if (err) throw err;
			if (!amount) amount = 0;
			let cost = findItem.call(_this, target, amount);
			if (!cost) return room.update();
			Database.write('money', amount - cost, user.userid, function (err, total) {
				if (err) throw err;
				_this.sendReply("Has comprado el articulo " + target + " por " + cost +  currencyName(cost) + ". Ahora tienes " + total + currencyName(total) + ".");
				logMoney(user.name + " ha comprado " + target + " de la tienda. Este usuario ahora tiene " + total + currencyName(total) + ".");
				handleBoughtItem.call(_this, target.toLowerCase(), user, cost);
				room.update();
			});
		});
	},
	buyhelp: ["/buy [command] - Buys an item from the shop."],

	customsymbol: function (target, room, user) {
		if (!user.canCustomSymbol && user.id !== user.userid) return this.errorReply("Necesitas comprar este articulo en la tienda.");
		if (!target || target.length > 1) return this.parse('/help customsymbol');
		if (target.match(/[A-Za-z\d]+/g) || '|?!+$%@\u2605=&~#\u03c4\u00a3\u03dd\u03b2\u039e\u03a9\u0398\u03a3\u00a9'.indexOf(target) >= 0) {
			return this.errorReply("Lo sentimos, pero no puedes cambiar tu simbolo a esto por razones de seguridad.");
		}
		user.customSymbol = target;
		user.updateIdentity();
		user.canCustomSymbol = false;
		user.hasCustomSymbol = true;
	},
	customsymbolhelp: ["/customsymbol [symbol] - Get a custom symbol."],

	resetcustomsymbol: 'resetsymbol',
	resetsymbol: function (target, room, user) {
		if (!user.hasCustomSymbol) return this.errorReply("Tu no tienes un simbolo personalizado.");
		user.customSymbol = null;
		user.updateIdentity();
		user.hasCustomSymbol = false;
		this.sendReply("Tu simbolo ha sido reseteado.");
	},
	resetsymbolhelp: ["/resetsymbol - Resets your custom symbol."],

	moneylog: function (target, room, user, connection) {
		if (!this.can('modlog')) return;
		let numLines = 15;
		let matching = true;
		if (target.match(/\d/g) && !isNaN(target)) {
			numLines = Number(target);
			matching = false;
		}
		let topMsg = "Mostrando los últimos " + numLines + " registros de transacciones:\n";
		let file = path.join(__dirname, '../logs/money.txt');
		fs.exists(file, function (exists) {
			if (!exists) return connection.popup("No hay transacciones.");
			fs.readFile(file, 'utf8', function (err, data) {
				data = data.split('\n');
				if (target && matching) {
					data = data.filter(function (line) {
						return line.toLowerCase().indexOf(target.toLowerCase()) >= 0;
					});
				}
				connection.popup('|wide|' + topMsg + data.slice(-(numLines + 1)).join('\n'));
			});
		});
	},

	rankingpd: 'richestuser',
	richladder: 'richestuser',
	richestusers: 'richestuser',
	richestuser: function (target, room, user) {
		if (!this.canBroadcast()) return;
		let _this = this;
		let display = '<hr><center><u><b><big>Ranking PD</big></b></u></center><center><font color=green>Usuarios con las mayores cantidades de dinero</font></br></center><hr><br><table border="1" cellspacing="0" cellpadding="5" width="100%"><tbody><tr><th>Puesto</th><th>Nombre</th><th>Dinero</th></tr>';
		Database.sortDesc('money', 10, function (err, users) {
			if (err) throw err;
			if (!users.length) {
				_this.sendReplyBox("El ladder está vacío.");
			} else {
				users.forEach(function (user, index) {
					display += "<tr><td>" + (index + 1) + "</td><td>" + user.username + "</td><td>" + user.money + "</td></tr>";
				});
				display += "</tbody></table>";
				_this.sendReply("|raw|" + display);
			}
			room.update();
		});
	},

	juegosdados: 'startdice',
	dicestart: 'startdice',
	startdice: function (target, room, user) {
		if (!this.can('broadcast', null, room)) return false;
		if (!target) return this.parse('/help startdice');
		if (!this.canTalk()) return this.errorReply("No puedes empezar un juego de Dados si no tienes permitido hablar.");

		let amount = isMoney(target);

		if (typeof amount === 'string') return this.errorReply(amount);
		if (!room.dice) room.dice = {};
		if (room.dice.started) return this.errorReply("Un juego de dados ya ha sido inicidado en esta sala.");

		room.dice.started = true;
		room.dice.bet = amount;
		// Prevent ending a dice game too early.
		room.dice.startTime = Date.now();

		room.addRaw("<div class='infobox'><h2><center><font color=#24678d>" + user.name + " ha iniciado un juego de dados por </font><font color=red>" + amount + "</font><font color=#24678d>" + currencyName(amount) + ".</font><br><button name='send' value='/joindice'>Click para unirte.</button></center></h2></div>");
	},
	startdicehelp: ["/startdice [bet] - Empieza un juego de dados para ganar dinero."],

	joindice: function (target, room, user) {
		if (!room.dice || (room.dice.p1 && room.dice.p2)) return this.errorReply("No hay un juego en su face de inicio en estos momentos en esta room.");
		if (!this.canTalk()) return this.errorReply("No puedes unirte a juegos de dados si no tienes permitido hablar.");
		if (room.dice.p1 === user.userid) return this.errorReply("Tu ya te has unido a este juego.");
		let _this = this;
		Database.read('money', user.userid, function (err, userMoney) {
			if (err) throw err;
			if (!userMoney) userMoney = 0;
			if (userMoney < room.dice.bet) return _this.errorReply("No tienes suficiente dinero como para unirte al juego.");
			Database.write('money', userMoney - room.dice.bet, user.userid, function (err) {
				if (err) throw err;
				if (!room.dice.p1) {
					room.dice.p1 = user.userid;
					room.addRaw("<b>" + user.name + " se ha unido al juego.</b>");
					return room.update();
				}
				room.dice.p2 = user.userid;
				room.addRaw("<b>" + user.name + " se ha unido al juego.</b>");
				let p1Number = Math.floor(6 * Math.random()) + 1;
				let p2Number = Math.floor(6 * Math.random()) + 1;
				let output = "<div class='infobox'>El juego tiene dos jugadores, iniciando.<br>Lanzando el dado.<br>" + room.dice.p1 + " ha lanzado un " + p1Number + ".<br>" + room.dice.p2 + " ha lanzado un " + p2Number + ".<br>";
				while (p1Number === p2Number) {
					output += "Empate... rodando de nuevo.<br>";
					p1Number = Math.floor(6 * Math.random()) + 1;
					p2Number = Math.floor(6 * Math.random()) + 1;
					output += room.dice.p1 + " has rolled a " + p1Number + ".<br>" + room.dice.p2 + " has rolled a " + p2Number + ".<br>";
				}
				let winner = room.dice[p1Number > p2Number ? 'p1' : 'p2'];
				let loser = room.dice[p1Number < p2Number ? 'p1' : 'p2'];
				let bet = room.dice.bet;
				output += "<font color=#24678d><b>" + winner + "</b></font> ha ganado <font color=#24678d><b>" + bet + "</b></font>" + currencyName(bet) + ".<br>Suerte para la próxima " + loser + "!</div>";
				room.addRaw(output);
				room.update();
				delete room.dice;
				Database.read('money', winner, function (err, total) {
					if (err) throw err;
					if (!total) total = 0;
					Database.write('money', total + bet * 2, winner, function (err) {
						if (err) throw err;
					});
				});
			});
		});
	},

	enddice: function (target, room, user) {
		if (!user.can('broadcast', null, room)) return false;
		if (!room.dice) return this.errorReply("No ha iniciado un juego en esta sala.");
		if ((Date.now() - room.dice.startTime) < 15000 && !user.can('broadcast', null, room)) return this.errorReply("Los usuarios regulados no pueden terminar un juego sin haber empezado 1 minuto.");
		if (room.dice.p2) return this.errorReply("Ya ha empezado un juego.");
		let dice = room.dice;
		if (dice.p1) {
			Database.read('money', dice.p1, function (err, total) {
				if (err) throw err;
				if (!total) total = 0;
				Database.write('money', total + dice.bet, dice.p1, function (err) {
					if (err) throw err;
				});
			});
		}
		delete room.dice;
		room.addRaw("<b>" + user.name + " ha terminado el juego.</b>");
	},

	ticket: 'tickets',
	tickets: function (target, room, user) {
		if (!this.canBroadcast()) return;
		Database.read('tickets', user.userid, function (err, tickets) {
			if (err) throw err;
			if (!tickets || !tickets.length) {
				this.sendReplyBox("No tienes tickets.");
			} else {
				this.sendReplyBox("Tienes un total de " + tickets.length + " ticket(s). Registro de tus tickets (IDs): " + tickets.join(", ") + ".");
			}
			room.update();
		}.bind(this));
	},

	loteria: function (target, room, user) {
		if (!this.can('picklottery')) return false;
		let chance = Math.round(Math.random());
		let _this = this;
		Database.users(function (err, users) {
			if (err) throw err;
			users = users.filter(function (user) {
				return user.tickets && user.tickets.length > 0;
			});
			if (!chance) {
				let msg = "<center><h2>Lotería!</h2>Nadie ha ganado la lotería. Buena suerte a todos para la próxima!</center>";
				_this.parse('/gdeclare ' + msg);
				_this.parse('/pmall /html ' + msg);
				room.update();
				return users.forEach(function (user) {
					Database.write('tickets', null, user.username, function (err) {
						if (err) throw err;
					});
				});
			}
			let tickets = [];
			users.forEach(function (user) {
				if (!Array.isArray(user.tickets)) user.tickets = user.tickets.split(', ');
				user.tickets.forEach(function (ticket) {
					tickets.push({username: user.username, ticket: ticket});
				});
			});
			let winningIndex = Math.floor(Math.random() * tickets.length);
			let winner = tickets[winningIndex];
			Database.get('pot', function (err, pot) {
				if (err) throw err;
				let winnings = Math.floor(pot * 3 / 4);
				if (!winner) return _this.errorReply("Nadie ha comprado tickets.");
				Database.read('money', winner.username, function (err, amount) {
					if (err) throw err;
					if (!amount) amount = 0;
					Database.write('money', amount + winnings, winner.username, function (err, total) {
						if (err) throw err;
						let msg = "<center><h2>Lotería!</h2><h4><font color='red'><b>" + winner.username + "</b></font> Ha ganado la lotería con el ticket " + winner.ticket + "! Este usuario ha ganado " + winnings + currencyName(winnings) + " y ahora tiene un total de " + total + currencyName(total) + ".</h4></center>";
						_this.parse('/gdeclare ' + msg);
						_this.parse('/pmall /html ' + msg);
						room.update();
						Database.set('pot', 0, function (err) {
							if (err) throw err;
							users.forEach(function (user) {
								Database.write('tickets', null, user.username, function (err) {
									if (err) throw err;
								});
							});
						});
					});
				});
			});
		});
	},

	premio: 'pot',
	pot: function (target, room, user) {
		if (!this.canBroadcast()) return;
		Database.get('pot', function (err, pot) {
			if (err) throw err;
			if (!pot) pot = 0;
			this.sendReplyBox("El premio gordo actual es de " + pot + currencyName(pot) + ".");
		}.bind(this));
	},
	
	ayudatienda: function () {
        if (!this.canBroadcast()) return;
        this.sendReplyBox(
			"<hr>" +
            "<center><big><b>Comandos Generales</b></big></center>" +
			"<center><font color=green>Información de los comandos de tienda</font></center>" +
			"<br><li><strong>/pd</strong> <i>[usuario]</i> - Consulta tus ahorros o los de alguien más.<br />" +
			"<li><strong>/tienda</strong> - Revisa los artículos de la tienda.<br />" +
			"<li><strong>/buy</strong> <i>[articulo]</i> - Compra un articulo de la tienda.<br />" +
			"<li><strong>/donardinero</strong> <i>[usuario, dinero]</i> - Regalas PD a alguien.<br />" +
			"<li><strong>/rankingpd</strong> - Muestra el top de los usuarios con más dinero en el servidor.<br />" +
			"<br><hr>"
        );
    },
	
	tiendaadmin: function () {
        if (!this.canBroadcast()) return;
        this.sendReplyBox(
		    "<hr>" +
            "<center><big><b>Comandos de Administración</b></big></center>" +
			"<center><font color=green>Información de los comandos para el manejo del dinero</font></center>" +
			"<hr>" +
			"<br><li><strong>/dardinero</strong> <i>[usuario, monto]</i> - Das dinero a un usuario.<br />" +
			"<li><strong>/quitardinero</strong> <i>[usuario, monto]</i> - Quitas dinero a un usuario.<br />" +
			"<li><strong>/resetpd</strong> <i>[usuario]</i> - Reseteas los ahorros de un usuario a 0.<br />" +
			"<li><strong>/moneylog</strong> - Muestra los registros de las transacciones.<br />" +
            "<br><hr>"
		);
    },

	estadoeco: 'economystats',
	economystats: function (target, room, user) {
		if (!this.canBroadcast()) return;
		let _this = this;
		Database.total('money', function (err, total) {
			Database.countUsers(function (err, numUsers) {
				let average = Math.floor(total / numUsers);
				let output = "<center><font color=green><u><h2><font size=4>Estado economico del servidor</size></h2></u></font></center><li>Hay un total de <b>" + total + currencyName(total) + "</b> circulando en la economía del servidor.</li> ";
				output += "<li>El usuario que posee el monto de dinero más alto es de un total de <b>" + average + currencyName(average) + "</li></b><br><center>Utiliza <em><font color=red>/ladderdinero</em></font> para ver el ranking.</center></br>";
				_this.sendReplyBox(output);
			});
			room.update();
		});
	}

};
