// El Rainbow es un comando para cambiarte el color de tu nick.
//Creado por: TheWleDey

exports.commands = {
        
        namecolors: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><font size = 3>Name Colors:</font><br />' +
		                  '<p> Los "Name Colors" son una Serie de comandos que te cambian el color de tu Nick.<br /> Solo Utiliza el Comando /name[color] mensaje para cambiarte el color' +
		                  '<p>Colores disponibles: Rainbow, Blue, White, Black, Orange, Green, Red, Pink y Yellow</p>' +
		                  '<font align="left" ><b>BY: Si encuentras algun problema,bug o tienes una Sugerencia, no dudes en avisar Con Bai Long2 y Hero damp'
						);
	},
    
        rainbow: function (target, room, user){
                var colors = ['#ED1C24', '#F26522', '#F7941D', '#F0D200', '#8DC73F', '#39B54A', '#00A651', '#00A99D', '#00AEEF', '#0072BC', '#0054A6', '#2E3192', '#662D91', '#92278F', '#EC008C', '#ED145B'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: ' + target);
                        }
        },
        
        nameblue: function (target, room, user){
                var colors = ['#0489B1'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: ' + target);
                        }
        },
        
        namewhite: function (target, room, user){
                var colors = ['#FFFFFF'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: ' + target);
                        }
        },
        
        nameblack: function (target, room, user){
                var colors = ['#000000'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: ' + target);
                        }
        },
        
        nameorange: function (target, room, user){
                var colors = ['#FF8000'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: ' + target);
                        }
        },
        
        namegreen: function (target, room, user){
                var colors = ['#3ADF00'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: ' + target);
                        }
        },
        
        namered: function (target, room, user){
                var colors = ['#FF0000'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: ' + target);
                        }
        },
        
        namepink: function (target, room, user){
                var colors = ['#FF00FF'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: ' + target);
                        }
        },
        
        nameyellow: function (target, room, user){
                var colors = ['#FFFF00'];
                if(!target) return this.sendReply('/rainbow message');
                        userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: <i>' + Tools.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: ' + target);
                        }
        },
        
}