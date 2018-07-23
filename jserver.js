//--------------------------------------
// モジュール読み込み
//--------------------------------------
const port = 3005;							//自分のポート番号に変更
const app  = require('express')();
const http = require('http').Server(app);
const io   = require('socket.io')(http);

//--------------------------------------
// Webサーバ
//--------------------------------------
//必要なページ分だけgetする
app.get('/', (req, res)=>{
	res.sendFile(__dirname + '/index.html');
});
app.get('/test.html', (req, res)=>{
	res.sendFile(__dirname + '/test.html');
});
app.get('/nichidai/resources/img/:file', (req, res)=>{
	res.sendFile(__dirname + '/nichidai/resources/img/' +
	req.params.file);
});
// 日本語が入っていると読み込んでくれない
/*app.get('/nichidai/resources/img/画像/:file', (req, res)=>{
	res.sendFile(__dirname + '/nichidai/resources/img/画像/' +
	req.params.file);
});*/
app.get('/nichidai/resources/sound/:file', (req, res)=>{
	res.sendFile(__dirname + '/nichidai/resources/sound/' +
	req.params.file);
});
app.get('/nichidai/css/:file', (req, res)=>{
	res.sendFile(__dirname + '/nichidai/css/' +
	req.params.file);
});
app.get('/nichidai/html/:file', (req, res)=>{
	res.sendFile(__dirname + '/nichidai/html/' +
	req.params.file);
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
var id1 = "aiueo";
var id2 = "aiueo";
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


 //じゃんけん
	socket.on('jyanken',(data)=>{
		//array.push(data.id);
		//console.log('id: ' +  data.sid + ' te: ' +  data.te);
		//console.log('id: ' +  array[0]);
		if(id1 === "aiueo"){
			id1 = data.sid;
			te1 = data.te;
			console.log('te1: ' +  data.te);
		}
		else if(id2 === "aiueo"){
			id2 = data.sid;
			te2 = data.te;
			console.log('te2: ' +  data.te);
		}
		if(te1 !== 0 && te2 !== 0){
			if(te1 === 1 && te2 === 2 ||
				te1 === 2 && te2 === 3 ||
				te1 === 3 && te2 === 1 ){
					io.to(id1).emit('win');
					io.to(id2).emit('lose');
			}
			else if(te2 === 1 && te1 === 2 ||
				te2 === 2 && te1 === 3 ||
				te2 === 3 && te1 === 1 ){
					io.to(id2).emit('win');
					io.to(id1).emit('lose');
			}
			else{
					io.emit('reset');
			}
			te1 = 0;
			te2 = 0;
			id1 = "aiueo";
			id2 = "aiueo";
		}

	});


  //以下テスト用
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
