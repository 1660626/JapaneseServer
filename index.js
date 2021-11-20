const express = require('express')
const app = express();
const bodyParser = require("body-parser");
var fs = require('fs');
var path = require('path');
const morgan = require("morgan");
const cors = require("cors");

const buildPath = path.join(__dirname, '..', 'build');
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}
if (process.env.NODE_ENV === "production") {
    app.use(express.static("../build"));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "build", "index.html"));
    });
}
app.use(express.static(buildPath));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static('public'));
const PORT = process.env.PORT || 4000 

var data_phrase = [[], []],
  data_grammar = [],
  dir_phrase = __dirname + '/data/phrase/',
  dir_grammar = __dirname + '/data/grammar/';


fs.readdirSync(dir_phrase).forEach(function (file) {
  // console.log(path.basename(dir + file, path.extname(dir + file))) 
  // (path.basename(dir + file, path.extname(dir + file)) !== "phrase") && 
  if ((path.basename(dir_phrase + file, path.extname(dir_phrase + file)) !== "pharseTitle") && path.extname(dir_phrase + file) === ".json") {
    data_phrase[0] = data_phrase[0].concat(require(dir_phrase + file));
  }
});

data_phrase[1] = data_phrase[1].concat(require(`${__dirname}/data/phrase/pharseTitle.json`));

fs.readdirSync(dir_grammar).forEach(function (file) {
  if (path.extname(dir_grammar + file) === ".json") {
    data_grammar = data_grammar.concat(require(dir_grammar + file));
  }
});
// for (const [key, value] of Object.entries(data)) {
//   console.log(`${key}: ${value}`);
// }
app.get('/api/grammar', (req, res) => {
  res.json(data_grammar)
})
app.get('/api/phrase', (req, res) => {
  res.json(data_phrase)
  //request.get(`https://mina.mazii.net/db/phrase/${}.mp3`)
  // .on('error', function(err) {
  //   // handle error
  // })
  // .pipe(fs.createWriteStream('./voice/phrase/2.mp3'));
  //  for (const key in data) {
  //   data[key].forEach((e)=>{
  //     if(e.voice){
  //     console.log(e.voice)
  // request.get(`https://mina.mazii.net/db/phrase/${e.voice}.mp3`)
  //   .on('error', function(err) {
  //     // handle error
  //   })
  //   .pipe(fs.createWriteStream(`./voice/phrase/${e.voice}.mp3`));
  //     }
  //   })
  // }



})
app.post('/voice', (req, res) => {

  console.log(req.body.name)

})
app.get('/api/phrase/voice/:id', (req, res) => {
  // const sname = req.params.sname || "";
  // res.writeHead(200, {'Content-Type': 'video/mp4'});
  // let opStream = require(`${__dirname}/voice/phrase/accommodation_1.mp3`);
  // opStream.pipe(res);

  // const file = `${__dirname}/public/voice/phrase/accommodation_1.mp3`;
  // res.send(file); // Set disposition and send it.


  // const stream =  require(`${__dirname}/public/voice/phrase/accommodation_1.mp3`);

  // res.set("content-type", "audio/mp3");
  // res.set("accept-ranges", "bytes");
  // res.set("content-length", Response.headers["content-length"]);

  // stream.on("data", (chunk) => {
  //   res.write(chunk);
  // });
  // console.log(req.params.id)
  console.log(req.params.id)
  fs.readFile(`${__dirname}/data/voice/phrase/${req.params.id}`,

    function (err, content) {

      res.end(content);

    });
  // res.send(opStream)

})

app.post('/api/phrase/', (req, res) => {
  const user = req.body;
  console.log(user)
  //  data.push(JSON.parse(JSON.stringify(req.body)));

  //  res.json(data);
  // fs.stat((`${__dirname}/data/phrase/pharse19.json`), function (err, stat) {
  //   if (err == null) {
  //     console.log('File exists');
  //   } else if (err.code === 'ENOENT') {
  //     // file does not exist
  //     fs.writeFile('log.txt', 'Some log\n');
  //   } else {
  //     console.log('Some other error: ', err.code);
  //   }
  // })


  const pathWrite = `${__dirname}/data/phrase/pharse19.json`;
  try {
    if (fs.existsSync(pathWrite)) {
      var json = [];

      fs.readFile(pathWrite, function (err, data) {
        json = JSON.parse(data)
        const datatemp = {
          "id": (+ new Date()).toString(),
          "category_id": "19",

          "vietnamese_un": "",
          "pinyin": "",

          "favorite": "",
          "voice": "",
          "status": "1"
        };
        json.push({ ...datatemp, ...user })
        fs.writeFileSync(pathWrite, JSON.stringify(json));

      })
      res.json({ "mess": json })

    } else {
      fs.writeFileSync(pathWrite, JSON.stringify([]));
      console.log('The file does not exist.');
      res.json({ "mess": 'The file does not exist.' })

    }
  } catch (err) {
    console.error(err);
    res.json({ "mess": err })

  }


})

// app.get("/noti/:id", async function (req, res) {
//   const idd = req.params.id || 0;
//   console.log(idd)
//   let obj = data.find(o => o.id == idd);
//   if(obj){
//   res.json(obj);

//   }
//   else{
//   res.json(null);

//   }
// });

app.listen(PORT, () => { console.log("Server started on http://localhost:" + PORT) })

module.exports = app