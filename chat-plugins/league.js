
exports.commands = {
	/*********************************************************
	 * League commands
	 *********************************************************/
	 
	ayudaliga: 'leaguehelp',
	leaguehelp: function (target, room, user) {
		return this.sendReplyBox(
	        "<hr>" +	 
			"<center><big><b>Sistema de Liga de Pokémon Hispano</b></big></center>" +
			"<center><font color=green>Introducción al sistema de la liga del servidor</font></center>" +
			"<br><li><strong>Información básica</strong>: <a href=\"https://www.agregarlinkdelforo.com\">Liga Pokémon Hispano</a><br />" +
			"<li><strong>Inscripciones</strong>: No hay inscripciones abiertas en estos momentos." +
			"<center><br><i>En caso de tener alguna duda contactar al staff de la liga:</i></br></center>" +
			"<center><i>Para más información acerca de cómo funciona la liga, leer el listado de comandos</center></i>" +
			"<hr>" +
			"<center><big><b>Comandos Generales</b><big></center></br>" +
			"<br><li><strong>/medallas</strong> <i>[usuario]</i> - Muestra las medallas con las que cuenta un usuario.<br />" +
			"<li><strong>/liga</strong> - Comando para mostrar la informacion general de la liga.<br />" +
			"<br><hr>" +
			"<center><big><b>Comandos Administrativos</b></big></center></br>" +
			"<center><font color=green>Requieren ser líder/elite de la liga</font></center></br>" +
			"<br><li><strong>/darmedalla</strong> <i>[usuario]</i> - Entrega una medalla como miembro de una liga.<br />"  +
			"<li><strong>/quitarmedalla</strong> <i>[usuario]</i> - Retira una medalla como miembro de una liga.<br />" +
			"<br /><hr>"
		);
	},
	
		ligaadmin: function () {
        if (!this.canBroadcast()) return;
        this.sendReplyBox(
		    "<hr>" +
            "<center><big><b>Comandos de Administración</b></big></center>" +
			"<center><font color=green>Información de los comandos para el manejo de la liga</font></center>" +
			"<hr>" +
			"<br><li><strong>/medallist</strong> - <i>Muestra la lista de Ids de la base de datos de medallas.</i><br />" +
			"<li><strong>/medaldata</strong> <i>[usuario, monto]</i> - Muestra una de las medallas por su ID.<br />" +
			"<li><strong>/addmedal</strong> <i>[usuario]</i> - Agrega una medalla al server..<br />" +
			"<li><strong>/deletemedal</strong> - Elimina una medalla.<br />" +
			"<li><strong>/editmedal</strong> <i>[id], [name/image/width/height], [data]</i> - Modifica las propiedades de una medalla." +
		    "<li><strong>/leaguelist</strong> - Muestra la lista de Ids de la base de datos de ligas.<br />" +
		    "<li><strong>/addleague</strong> <i>[id], [name], [room]</i> - Comando para registrar una liga.<br />"  +
			"<li><strong>/deleteleague</strong> - Comando para eliminar una liga." +
			"<li><strong>/editleague</strong> <i>[id], [name/room], [data]</i> - Edita la información de la liga.<br />" +
			"<li><strong>/setgymleader</strong> <i>[id-league], [user], [id-medal]</i> - Establece un usuario como lider de la liga.<br />" +
			"<li><strong>/setgymleader</strong> <i>[id-league], [user], [id-medal]</i> - Establece un usuario como elite de la liga.<br />" +
			"<li><strong>/removegymleader</strong> <i>[id-league], [id-medal]</i> - Elimina un puesto de una liga.<br />" +
			"<li><strong>/darmedalla</strong> <i>[user, id]</i> - Entrega una medalla.<br />" +
            "<li><strong>/quitarmedalla</strong> <i>[user, id]</i> - Retira una medalla.<br />" +
            "<br><hr>"
		);
    },
	
	medallist: function (target, room, user) {
		if (!this.can("league")) return false;
		return this.sendReplyBox("Medallas (ID): " + League.getAllMedals());
	},
	
	medaldata: function (target, room, user) {
		if (!this.can("league")) return false;
		if (!target) return this.sendReply("No has especificado ninguna medalla.");
		var medalData = League.getMedalData(target);
		if (!medalData) return this.sendReply("La medalla especificada no existe.");
		return this.sendReplyBox('<b>' + Tools.escapeHTML(medalData.name) + ':</b><br /><img src="' + encodeURI(medalData.image) + '" title="' + Tools.escapeHTML(medalData.name) + '" width="' + Tools.escapeHTML(medalData.width) + '" height="' + Tools.escapeHTML(medalData.height) + '" />&nbsp;');
	},
	
	newmedal: 'addmedal',
	addmedal: function (target, room, user) {
		if (!this.can("league")) return false;
		if (!target) return this.sendReply("No has especificado ninguna medalla.");
		var params = target.split(',');
		if (!params || params.length < 5) return this.sendReply("Usage: /addmedal [id], [name], [width], [height], [image]");
		if (League.newMedal(params[0], params[1], params[4], params[2], params[3])) return this.sendReply("Medalla: " + toId(params[0]) + " creada con exito.");
		this.sendReply("La medalla especificada ya existía.");
	},
	
	deletemedal: function (target, room, user) {
		if (!this.can("league")) return false;
		if (!target) return this.sendReply("No has especificado ninguna medalla.");
		if (League.deleteMedal(target)) return this.sendReply("Medalla: " + toId(target) + " eliminada con exito.");
		this.sendReply("La medalla especificada no existe.");
	},
	
	medaledit: 'editmedal',
	editmedal: function (target, room, user) {
		if (!this.can("league")) return false;
		if (!target) return this.sendReply("No has especificado ninguna medalla.");
		var params = target.split(',');
		if (!params || params.length < 3) return this.sendReply("Usage: /editmedal [id], [name/image/width/height], [data]");
		var opc = toId(params[1]).substr(0,1);
		if (League.editMedal(params[0], opc, params[2])) return this.parse("/medaldata " + params[0]);
		this.sendReply("Alguno de los datos no es correcto.");
	},
	
	medals: 'medallas',
	vermedallas: 'medallas',
	medallas: function (target, room, user) {
		if (!this.canBroadcast()) return false;
		var autoData = false;
		var targetUser = toId(user.name);
		if (target) targetUser = toId(target);
		var userT = Users.get(targetUser);
		if (userT) {
			userT = userT.name;
		} else {
			userT = targetUser;
		}
		var html = '<hr><center><b><big>Medallas de ' + userT + '</big></b></center><hr>';
		html += League.getMedalRaw(userT);
		return this.sendReplyBox(html);
	},
	
	leaguemedal: 'medallaliga',
	medallaliga: function (target, room, user) {
		if (!this.canBroadcast()) return false;
		var autoData = false;
		var targetUser = toId(user.name);
		if (target) targetUser = toId(target);
		var userT = Users.get(targetUser);
		if (userT) {
			userT = userT.name;
		} else {
			userT = targetUser;
		}
		var medalId = League.findMedal(userT);
		if (medalId) return this.sendReply(userT + " no es miembro de ninguna liga del servidor.");
		var medalData = League.getMedalData(medalId);
		if (!medalData) return this.sendReply("La medalla especificada no existe.");
		return this.sendReplyBox(userT + ' puede hacer entrega de: <b>' + Tools.escapeHTML(medalData.name) + ':</b><br /><br /><img src="' + encodeURI(medalData.image) + '" title="' + Tools.escapeHTML(medalData.name) + '" width="' + Tools.escapeHTML(medalData.width) + '" height="' + Tools.escapeHTML(medalData.height) + '" />&nbsp;');
	},
	
	qmedals: function (target, room, user, connection) {
		//low level commmand
		if (Config.emergency && ResourceMonitor.countCmd(connection.ip, user.name)) return false;
		connection.send('|queryresponse|userdetails|' + JSON.stringify({
			medals: League.getMedalQuery(user.name),
		}));
		return false;
	},
	
	league: 'liga',
	lideres: 'liga',
	liga: function (target, room, user) {
		if (!this.canBroadcast()) return false;
		var leagueId = League.findLeague(target, room.id);
		if (!leagueId) return this.sendReply("La liga especificada no está registrada en el servidor.");
		return this.sendReplyBox(League.getLeagueTable(leagueId));
	},
	
	leaguelist: function (target, room, user) {
		if (!this.can("league")) return false;
		return this.sendReplyBox("Ligas (ID): " + League.getAllLeagues());
	},
	
	newleague: 'addleague',
	addleague: function (target, room, user) {
		if (!this.can("league")) return false;
		if (!target) return this.sendReply("No has especificado ninguna liga.");
		var params = target.split(',');
		if (!params || params.length < 3) return this.sendReply("Usage: /addleague [id], [name], [room]");
		if (League.newLeague(params[0], params[1], params[2])) return this.sendReply("La liga " + toId(params[0]) + " ha sido creada con exito.");
		this.sendReply("La liga especificada ya existía.");
	},
	
	deleteleague: function (target, room, user) {
		if (!this.can("league")) return false;
		if (!target) return this.sendReply("No has especificado ninguna liga.");
		if (League.deleteLeague(target)) return this.sendReply("La liga " + toId(target) + " ha sido eliminada con exito.");
		this.sendReply("La liga especificada no existe.");
	},
	
	eleague: 'editleague',
	editleague: function (target, room, user) {
		if (!this.can("league")) return false;
		if (!target) return this.sendReply("No has especificado ninguna liga.");
		var params = target.split(',');
		if (!params || params.length < 3) return this.sendReply("Usage: /editleague [id], [name/room], [data]");
		var opc = toId(params[1]).substr(0,1);
		if (League.editLeague(params[0], opc, params[2])) return this.parse("/liga " + params[0]);
		this.sendReply("Alguno de los datos no es correcto.");
	},
	
	setgymleader: function (target, room, user) {
		if (!this.can('league')) return false;
		if (!target) return this.sendReply('Usage: /setgymleader [id-league], [user], [id-medal]');
		var params = target.split(',');
		if (!params || params.length < 3) return this.sendReply("Usage: /setgymleader [id-league], [user], [id-medal]");
		if (!Users.get(params[1])) this.sendReply('Warning: ' + toId(params[1]) + ' is offline.');
		if (League.addLeader(params[0], params[1], 'g', params[2])) return this.sendReply('El usuario ' + toId(params[1]) + ' ha sido asignado en el puesto correspondiente.');
		this.sendReply("Alguno de los datos no es correcto.");
	},
	
	setelite: function (target, room, user) {
		if (!this.can('league')) return false;
		if (!target) return this.sendReply('Usage: /setelite [id-league], [user], [id-medal]');
		var params = target.split(',');
		if (!params || params.length < 3) return this.sendReply("Usage: /setelite [id-league], [user], [id-medal]");
		if (!Users.get(params[1])) this.sendReply('Warning: ' + toId(params[1]) + ' is offline.');
		if (League.addLeader(params[0], params[1], 'e', params[2])) return this.sendReply('El uuario ' + toId(params[1]) + ' ha sido asignado en el puesto correspondiente.');
		this.sendReply("Alguno de los datos no es correcto.");
	},
	
	removegymleader: function (target, room, user) {
		if (!this.can('league')) return false;
		if (!target) return this.sendReply('Usage: /removegymleader [id-league], [id-medal]');
		var params = target.split(',');
		if (!params || params.length < 2) return this.sendReply("Usage: /removegymleader [id-league], [id-medal]");
		if (League.removeLeader(params[0], params[1])) return this.sendReply('Puesto de la liga especificada borrado con exito.');
		this.sendReply("Alguno de los datos no es correcto.");
	},

	givemedal: 'darmedalla',
	concedemedal: 'darmedalla',
	darmedalla: function (target, room, user) {
		if (!target) return this.sendReply('Usage: /darmedalla [user], (id)');
		var params = target.split(',');
		if (params.length === 1) {
			var userT = Users.get(params[0]);
			if (!userT) return this.sendReply('El usuario ' + toId(target) + ' no existe o no está disponible.');
			var league = League.findLeagueFromRoom(room.id);
			if (!league) return this.sendReply('Este comando solo puede ser usado en la Sala correspondiente a la liga.');
			var medalId = League.findMedal(user.name, league);
			if (!medalId) return this.sendReply('No estas registrado como miembro de la liga ' + league);
			var medalData = League.getMedalData(medalId);
			if (!League.giveMedal(medalId, params[0])) return this.sendReply('El usuario ya poseía la medalla que intentas entregar.');
			userT.popup(user.name + " te ha entregado la siguiente medalla: " + medalData.name + "\nRecuerda que puedes comprobar tus medallas con el comando /medallas");
			this.addModCommand(user.name + " ha entregado su medalla (" + medalData.name + ") a " + toId(target) + '.');
			return;
		} else if(params.length > 1){
			if (!this.can('league')) return false;
			var userT = Users.get(params[0]);
			if (!userT) return this.sendReply('El usuario ' + toId(params[0]) + ' no existe o no está disponible.');
			if (!League.giveMedal(params[1], params[0])) return this.sendReply('El usuario ya poseía dicha medalla o el Id es incorrecto.');
			return this.sendReply('Medalla (' + League.getMedalData(params[1]).name + ') entregada a ' + toId(params[0]) + '.');
		}
		return this.sendReply('Usage: /darmedalla [user], (id)');
	},

	removemedal: 'quitarmedalla',
	quitarmedalla: function (target, room, user) {
	if (!target) return this.sendReply('Usage: /quitarmedalla [user], (id)');
		var params = target.split(',');
		if (params.length === 1) {
			var league = League.findLeagueFromRoom(room.id);
			if (!league) return this.sendReply('Este comando solo puede ser usado en la Sala correspondiente a la liga.');
			var medalId = League.findMedal(user.name, league);
			if (!medalId) return this.sendReply('No estas registrado como miembro de la liga ' + league);
			if (!League.removeMedal(medalId, params[0])) return this.sendReply('El usuario ya poseía la medalla que intentas entregar.');
			this.addModCommand(user.name + " ha retirado su medalla a " + toId(target) + '.');
			return;
		} else if(params.length > 1){
			if (!this.can('league')) return false;
			if (!League.removeMedal(params[1], params[0])) return this.sendReply('El usuario no poseía dicha medalla o el Id es incorrecto.');
			return this.sendReply('Medalla (' + League.getMedalData(params[1]).name + ') retirada a ' + toId(params[0]) + '.');
		}
		return this.sendReply('Usage: /quitarmedalla [user], (id)');
	}
};
