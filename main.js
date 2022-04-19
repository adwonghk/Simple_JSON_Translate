const axios = require("axios");
const fs = require("fs");

rawData = fs.readFileSync("zh_cn.json");
parsedData = JSON.parse(rawData);
texts = Object.values(parsedData).join("@");

console.log(texts);

// texts = [
//   "内存不足！没法在视频聊天时播放视频",
//   "三谢谢没关系前面怎么样",
//   "看见睡觉开家同学",
//   "What if this line is English", // does not work
// ];

const fmtSeconds = (s) => (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;

const sendRequest = async (textToTranslate) => {
  try {
    console.log(`[${Date()}] - Start requesting...`);
    const res = await axios.get("https://api.zhconvert.org/convert", {
      method: "get",
      headers: {
        Content: "application/json;charset=UTF-8",
      },
      data: {
        text: textToTranslate,
        converter: "Taiwan",
      },
    });
    return res.data.data.text;
  } catch (err) {
    console.log(`[${Date()}] - Error requesting: ${err}`);
  }
};

async function start() {
  console.log(`[${Date()}] - Started, est: ${fmtSeconds(texts.length)}`);
  console.time();
  translated = "";
  translatedText = await sendRequest(texts);
  console.log(`[${Date()}] - Got response ${translatedText}`);
  translated = translatedText;

  translated = translated.split("@");

  translatedObj = {};
  keys = Object.keys(parsedData);
  keys.forEach((k, index) => {
    translatedObj[k] = translated[index];
  });

  try {
    fs.writeFileSync("zh_tw.json", JSON.stringify(translatedObj), "utf8");
  } catch (err) {
    console.log(`[${Date()}] - Error writing file: ${err}`);
  }

  console.timeEnd();
  console.log(`[${Date()}] - Done`);
}

start();
