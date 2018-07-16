//--------------------------------------
// モジュール読み込み
//--------------------------------------
const port = 3013;							//自分のポート番号に変更
const app  = require('express')();
const http = require('http').Server(app);
const io   = require('socket.io')(http);

//--------------------------------------
// Webサーバ
//--------------------------------------
//必要なページ分だけgetする
app.get('/', (req, res)=>{
	res.sendFile(__dirname + '/test.html');
});
app.get('/jyanken.html', (req, res)=>{
	res.sendFile(__dirname + '/jyanken.html');
});
app.get('/kati.html', (req, res)=>{
	res.sendFile(__dirname + '/kati.html');
});
app.get('/make.html', (req, res)=>{
	res.sendFile(__dirname + '/make.html');
});
http.listen(port, ()=>{
	console.log(`listening on *:${port}`);
});

//--------------------------------------
// Socket.io
//--------------------------------------
var clientNum = 0;
let array = new Array();
var te1 = 0;
var te2 = 0;

io.on('connection', (socket)=>{
	//接続時のメッセージ
	console.log('a user connected');

  //マッチング　マッチング中に消えられたら困ります
	socket.on('matching',(data)=>{
		clientNum++;
		//array.push(data.id);
		console.log('match: ' +  data.sid);
		if(clientNum === 2){
			io.emit('matching');
			clientNum = 0;
	  }
	});

	socket.on('touroku',(data)=>{
		//clientNum++;
		array.push(data.id);
		console.log('id: ' +  data.sid);
		console.log('id: ' +  array[0]);
		//if(clientNum === 2){
		//	io.emit('matching');
		//	clientNum = 0;
		//}
	});

 //じゃんけん
	socket.on('jyanken',(data)=>{
		array.push(data.id);
		console.log('id: ' +  data.sid + ' te: ' +  data.te);
		console.log('id: ' +  array[0]);
		if(array[0] === data.id){
			te1 = data.te;
			console.log('te1: ' +  data.te);
		}
		else{
			te2 = data.te;
			console.log('te2: ' +  data.te);
		}
		if(te1 !== 0 && te2 !== 0){
			if(te1 === 1 && te2 === 2 ||
				te1 === 2 && te2 === 3 ||
				te1 === 3 && te2 === 1 ){
					io.to(array[0]).emit('win');
					io.to(array[1]).emit('lose');
			}
			else if(te2 === 1 && te1 === 2 ||
				te2 === 2 && te1 === 3 ||
				te2 === 3 && te1 === 1 ){
					io.to(array[1]).emit('win');
					io.to(array[0]).emit('lose');
			}
			else{
					io.emit('reset');
					array = new Array();
			}
			te1 = 0;
			te2 = 0;
		}

	});

	//チャットメッセージ
	socket.on('chat message', (msg)=>{
		io.emit('chat message', msg);
		console.log('message: ' + msg);
	});

	//切断
	socket.on('disconnect', ()=>{
		console.log('user disconnected');
	});
});
