var net_server = require('net');
var request = require('request');

var server = net_server.createServer(function (client){

  console.log('Client connection: ');
  console.log('   local = %s:%s', client.localAddress, client.localPort);
  console.log('   remote = %s:%s', client.remoteAddress, client.remotePort);

  client.setTimeout(500);
  client.setEncoding('utf8');


  client.on('data', function(data){
    console.log("Received data from client on port %d: %s", client.remotePort, data.toString());
    writeData(client, 'Sending: ' + data.toString());
    console.log(' Bytes sent: ' + client.bytesWritten);
      var tr_url = 'https://www.todayrecycle.com/trbox/test.jsp';
      var tr_param = {fun: 'test', data: data.toString()}
      request.post({
        url:tr_url,
        qs: tr_param
      },function(error, response, body){
          if(!error && response.statusCode == 200){
              console.log(body);
          }
        }
      );

  });

  client.on('end', function(){
    console.log('Client disconnected');
  });

  client.on('error', function(err){
    console.log('Socket Error: ', JSON.stringify(err));
  });

  client.on('timeout', function(){
    console.log('Socket Timed out');
  });
});

server.listen(5252, function(){
    console.log('Server listening: ' + JSON.stringify(server.address()));
    server.on('close', function(){
      console.log('Server Terminsated');
    });
    server.on('error', function(err){
      console.log('Server Error: ', JSON.stringify(err));
    });
});

function writeData(socket, data){
  var success = socket.write(data);
  if(!success){
    console.log("Clinet Send Fail");
  }

}
