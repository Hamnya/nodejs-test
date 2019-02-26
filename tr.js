var net_server = require('net');
var request = require('request');
var winston = require('winston'); //로그 처리 모듈
var winstonDaily = require('winston-daily-rotate-file'); // 로그 일별 처리 모듈
var moment = require('moment'); //시간 처리 모듈
/*
* 로그 파일 셋팅 winston
*/
function timeStampFormat(){
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

var logger = new (winston.Logger)({
//winston 모듈로 만드는 로거(Logger, 로그를 출력하는 객체를 말할 때 사용하는 용어)는 transports 라는 속성 값으로 여러 개의 설정 정보를 전달 할 수 있다.
    transports: [
        new (winstonDaily)({
//이름이 info-file인 설정 정보는 매일 새로운 파일에 로그를 기록하도록 설정
            name: 'info-file',
            filename: '/home/ubuntu/log/server/server',
            datePattern: '_yyyy-MM-dd.log',
            colorize: false,
// 50MB를 넘어 가면 자동으로 새로운 파일을 생성되며, 이때 자동으로 분리되어 생성 되는 파일의 개수는 최대 1000개 까지 가능하다.
            maxsize: 50000000,
            maxFiles: 1000,
//info 수준의 로그만 기록하도록 설정함.
            level: 'info',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)({
            name: 'debug-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ],
    exceptionHandlers: [
        new (winstonDaily)({
            name: 'exception-file',
            filename: '/home/ubuntu/log/exception/exception',
            datePattern: '_yyyy-MM-dd.log',
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'error',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)({
            name: 'exception-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ]
}); // ./로그파일 셋팅

/*
* TCP 서버 시작
*/



var server = net_server.createServer(function (client){

  logger.info('(클라이언트 접근)Client connection: ');
  logger.info('   (서버IP:PORT)local = %s:%s', client.localAddress, client.localPort);
  logger.info('   (클라이언트IP:PORT)remote = %s:%s', client.remoteAddress, client.remotePort);

  client.setTimeout(500);
  client.setEncoding('utf8');


  client.on('data', function(data){
    logger.info("(받은 데이터)Received data from client on port %d: %s", client.remotePort, data.toString());
    writeData(client, \u0002+'OK'+\u0003);
    logger.info('(보낸 데이터) '+\u0002+'OK'+\u0003);
    logger.info('(데이터 크기 Bytes sent: ' + client.bytesWritten);


    //HTTP 리퀘스트 시작
    var sendURL = "https://www.todayrecycle.com/trbox/test.jsp";
    logger.info('(HTTP 통신 시작)Start HTTP Request URL : ' + sendURL);
    sendData(sendURL, data.toString());

  });

  client.on('end', function(){
    logger.info('(클라이언트 연결 종료)Client disconnected');
  });

  client.on('error', function(err){
    logger.info('(소켓 에러)Socket Error: ', JSON.stringify(err));
  });

  client.on('timeout', function(){
    logger.info('(소켓 타임아웃)Socket Timed out');
  });


});

server.listen(5252, function(){

    logger.info('(서버 준비완료)Server listening: ' + JSON.stringify(server.address()));
    server.on('close', function(){
      logger.info('(서버 종료)Server Terminsated');
    });
    server.on('error', function(err){
      logger.info('(서버 오류)Server Error: ', JSON.stringify(err));
    });
});

function writeData(socket, data){
  var success = socket.write(data);
  if(!success){
    logger.info("(클라이언트의 보냄 실패) Clinet Send Fail");
  }

}

/*
*   HTTP REQUEST 전송 - 보안 보완 필요
*/
function sendData(url, param){
        var tr_url = url;
        var tr_param = {fun: 'test', data: param}
        request.post({
          url:tr_url,
          qs: tr_param
        },function(error, response, body){
            if(!error && response.statusCode == 200){
                logger.info("(전송 성공)REQUEST SUCCESS ");
                logger.info(body.trim());
            }
          }
      );
}
