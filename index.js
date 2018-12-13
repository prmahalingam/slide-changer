var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var fs=require('fs');
var path=require('path');

var lock=0;
var showmouse=0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/portal.html',function(req,res){
 res.sendFile(__dirname+'/portal.html');
});
app.get('/resource/pointer.png',function(req,res){
 res.sendFile(__dirname+'/resource/pointer.png');
});
app.get('/index.html',function(req,res){
 res.sendFile(__dirname+'/index.html');
});
app.get('/jquery-1.11.1.js',function(req,res){
 res.sendFile(__dirname+'/jquery-1.11.1.js');
});
app.get('/diff_match_patch.js',function(req,res){
 res.sendFile(__dirname+'/diff_match_patch.js');
});

app.get('Slideblack.JPG',function(req,res){
	if(lock==0)
 res.sendFile(__dirname+'/slide/Slideblack.JPG');
});

app.get('/slide/*.JPG',function(req,res){
	if(lock==0)
 res.sendFile(__dirname+'/slide/'+req.params[0]+'.JPG');
});

app.get('/resource/*.*',function(req,res){
	if(lock==0)
 res.sendFile(__dirname+'/resource/'+req.params[0]+'.'+req.params[1]);
});

io.on('connection',function(socket){
console.log("Connection established with "+socket.handshake.address);
socket.on('init change', function(msg){
  var slideref='slide/Slide'+msg+'.JPG';
	if(lock==0)
		io.emit('change',slideref);
		});

socket.on('init local change', function(msg){
  var slideref='slide/Slide'+msg+'.JPG';
		io.emit('local change',slideref);
		});

    socket.on('disable save', function(msg){
	if(lock==0)
    		io.emit('disable',"");
        });
socket.on('lock system', function(msg){
	lock=1;
        });
socket.on('unlock system', function(msg){
	lock=0;
        });
socket.on('show mouse', function(msg){
	showmouse=1;
	io.emit('show','');
	console.log('Mouse activated');
        });
        socket.on('start draw', function(msg){
        	//showmouse=1;
        	io.emit('start','');
        	console.log('Draw activated');
                });
                socket.on('stop draw', function(msg){
                	//showmouse=1;
                	io.emit('stop','');
                	console.log('Draw deactivated');
                        });
socket.on('show code', function(msg){
	io.emit('encode','');
	console.log('Code activated');
        });
socket.on('hide code', function(msg){
	io.emit('decode','');
	console.log('Code deactivated');
        });
socket.on('hide mouse', function(msg){
	showmouse=0;
	io.emit('hide','');
	console.log('Mouse deactivated');
        });
socket.on('mouse moved', function(msg){
	//console.log('Mouse moved to '+msg);
	if(showmouse==1)
		io.emit('move mouse',msg);
        });
socket.on('send message', function(msg){
	if(lock==0)
    		io.emit('new message',msg);
        });
socket.on('code update', function(msg){
	console.log(msg);
    		io.emit('code update',msg);
        });
socket.on('scroll', function(msg){
    		io.emit('scroll',msg);
        });
socket.on('send link', function(msg){
		var message="<a href='http://10.90.8.106:3000/resource/"+msg+"' target='_blank'>"+msg+"</a>";
	if(lock==0)
    		io.emit('new message',message);
        });
        socket.on('enable save', function(msg){
	if(lock==0)
            io.emit('enable',"");
            });
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
