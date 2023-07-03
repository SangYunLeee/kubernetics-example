const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const os = require('os');

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <section>
          <h2>인프라 테스트용입니다.</h2>
          <div>서버명(쿠버의 경우 파드명): ${os.hostname()}</div>
          <div>${req.socket.remoteAddress}에서 오셨군요!</div>
          <h3> 'error' 를 입력 혹은 GET '/error' 시 500 에러 반환 </h3>
          <h3> 'exit' 를 입력 혹은 GET '/exit' 시 서버 강제 종료 ('process.exit(1)') </h3>
          <h3> 'test' 를 입력 혹은 POST '/test' 시 단순 메세지 반환 </h3>
          <h3> GET '/test' 시 단순 메세지 반환 </h3>
        </section>
        <form action="/send-message" method="POST">
          <div class="form-control">
            <label>메세지 입력</label>
            <input type="text" name="inputValue">
          </div>
          <button>메세지 전달</button>
        </form>
      </body>
    </html>
  `);
});

app.post('/send-message', (req, res) => {
  const enteredValue = req.body.inputValue;
  console.log("input: ", enteredValue);
  if (enteredValue == "error") {
    res.redirect('/error');
  } else if (enteredValue == "exit") {
    res.redirect('/exit');
  } if (enteredValue == "test") {
    res.redirect('/test');
  }else {
    res.redirect('/');
  }
});

app.get('/error', (req, res) => {
  res.status(500).send(`
    <h1>Internal Server Error</h1>
    <div>서버쪽 에러 발생, 500 에러 반환, 문제가 생긴 파드 이름: ${os.hostname()}</div>
  `)
});

app.get('/exit', (req, res) => {
  process.exit(1);
});

app.get('/test', (req, res) => {
  res.send("reponsed for 'GET /test'")
  console.log("print console.log for 'GET /test'");
});

app.post('/test', (req, res) => {
  res.send("reponsed for 'POST /test'")
  console.log("print console.log for 'POST /test'");
});

app.listen(80);
