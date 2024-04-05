const mongoose = require("mongoose");
const roomSchemaNew = new mongoose.Schema(
  {
    name: String,
    price: { type: Number, required: [true, "價格必填"] },
    rating: Number,
    createdAt: { type: Date, default: Date.now, select: false }, // select false的功用是 find()時不會顯示該筆資料，可以保存在後台
  },
  { versionKey: false } // 這邊設定了room之後，就不會採用mongoose.model("Room", roomSchemaNew)的Rooms了
);

const Room = mongoose.model("Room", roomSchemaNew);

module.exports = Room;
