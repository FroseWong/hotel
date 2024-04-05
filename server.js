const http = require("http");
const Room = require("./models/room");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const headers = {
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Length, X-Requested-With",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
  "Content-Type": "application/json",
};

dotenv.config({ path: "./config.env" });
console.log(process.env.PORT);

// mongodb+srv://frose:Passw0rd@cluster0.vogvgea.mongodb.net/?retryWrites=true&w=majority

// 連接資料庫
// mongoose
//   .connect("mongodb://127.0.0.1:27017/hotel") // hotel是資料庫名稱
//   .then(() => {
//     console.log("資料庫連線成功");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// mongodb+srv://frose:<password>@cluster0.vogvgea.mongodb.net/?retryWrites=true&w=majority

const db = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db) // hotel是資料庫名稱
  .then(() => {
    console.log("資料庫連線成功");
  })
  .catch((err) => {
    console.log(err);
  });

const requestListener = async (req, res) => {
  // console.log(req.url);
  let body = "";

  req.on("data", (chunk) => (body += chunk));

  console.log();

  if (req.url === "/rooms" && req.method == "GET") {
    console.log("GET!");
    const rooms = await Room.find();

    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        rooms,
      })
    );
    res.end();
  } else if (req.url === "/rooms" && req.method == "POST") {
    console.log("POST!");
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        console.log(data);

        const newRoom = await Room.create({
          name: data.name,
          price: data.price,
          rating: data.rating,
        });

        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            rooms: newRoom,
          })
        );

        res.end();
      } catch (err) {
        console.log("err", err);

        res.writeHead(400, headers);
        res.write(
          JSON.stringify({ status: false, message: "欄位不正確，或無此ID" })
        );

        res.end();
      }
    });
  } else if (req.url === "/rooms" && req.method === "DELETE") {
    await Room.deleteMany({});
    res.writeHead(200, headers);
    res.write(JSON.stringify({ status: "success", rooms: [] }));
    res.end();
  } else if (req.url.startsWith("/rooms/") && req.method === "DELETE") {
    console.log("url", req.url);

    const id = req.url.split("/").pop();

    const rooms = await Room.findByIdAndDelete(id);
    console.log(rooms);
    res.writeHead(200, headers);
    res.write(JSON.stringify({ status: "success", rooms }));
    res.end();
  } else if (req.url.startsWith("/rooms/") && req.method === "PATCH") {
    req.on("end", async () => {
      const parseBody = JSON.parse(body);

      const id = req.url.split("/").pop();

      const rooms = await Room.findByIdAndUpdate(id, {
        name: parseBody.name,
        price: parseBody.price,
        rating: parseBody.rating,
      });
      res.writeHead(200, headers);
      res.write(JSON.stringify({ status: "success", rooms }));
      res.end();
    });
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT);

// const roomSchema = {
//   name: String,
//   price: { type: Number, required: [true, "價格必填"] },
//   rating: Number,
// };

// const roomSchemaNew = new mongoose.Schema(
//   {
//     name: String,
//     price: { type: Number, required: [true, "價格必填"] },
//     rating: Number,
//     createdAt: { type: Date, default: Date.now, select: false }, // select false的功用是 find()時不會顯示該筆資料，可以保存在後台
//   },
//   { versionKey: false } // 這邊設定了room之後，就不會採用mongoose.model("Room", roomSchemaNew)的Rooms了
// );

// const Room = mongoose.model("Room", roomSchemaNew);
// MongoDB內有的資料庫叫做rooms
// 而這邊名稱卻不是rooms，原因是
//1.強制小寫 2.後方強制+s

// create = new + save()

// Room.create({
//   name: "總統套房27",
//   price: 2000,
//   rating: 4.5,
// })
//   .then(() => {
//     console.log("新增成功");
//   })
//   .catch((error) => {
//     console.log(error.errors);
//   });

// const testRooms = new Room({
//   name: "總統套房",
//   price: 2000,
//   rating: 4.5,
// });

// testRooms
//   .save()
//   .then(() => {
//     console.log("新增資料成功");
//   })
//   .catch((error) => {
//     console.log("新增失敗");
//     console.log(error.errors.price.properties.message); // 價格必填
//   });
