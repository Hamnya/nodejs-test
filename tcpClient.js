var net_client = require('net');

function getConnection(){
  //서버에 해당 포트로 접속
  var clinet = "";
  var recvData = [];
  var local_port = "";

  client = net_client.connect({port:*, host:'*.*.*.*'}, function(){
    console.log("connect log==========================================================");
    console.log('connect success');
    console.log('local = ' +  this.localAddress + ':' + this.localPort);
    console.log('remote = ' + this.remoteAddress + ':' + this.remotePort);

    local_port = this.localPort;

    this.setEncoding('utf8');
    this.setTimeout(600000); // timeout  10분
    console.log('client setting Encoding:binary, timeout:600000');
    console.log('client connect localport : ' + local_port);

  });


  client.on('close', function(){
    console.log('client Scket Closed : ' + " local port : " + local_port);
  })

  // 데이터 수신 후 처리
  client.on('data', function(data) {
      console.log("data recv log======================================================================");
      recvData.push(data);
      console.log("data.length : " + data.length);
      console.log("data recv : " + data);
      client.end();
  });

  client.on('end', function() {
      console.log('client Socket End');
  });

  client.on('error', function(err) {
      console.log('client Socket Error: '+ JSON.stringify(err));
  });

  client.on('timeout', function() {
      console.log('client Socket timeout: ');
  }); 

  client.on('drain', function() {
      console.log('client Socket drain: ');
  });

  client.on('lookup', function() {
      console.log('client Socket lookup: ');
  });
  return client;
} //getConnection





 function writeData(socket, data){
   var success = !socket.write(data);
   if (!success){
       console.log("Server Send Fail");
   }
 }

 var client = getConnection();
 writeData(client, "에코 서버 테스트입니다.");
