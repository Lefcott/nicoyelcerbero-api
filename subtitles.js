const getFileName = (name) => `./${name}.sbv`;
const name = "subtitulos demencia";
const fs = require("fs");
const content = fs.readFileSync(getFileName(name)).toString();

const substractMinutes = +process.argv[2];
const substractSeconds = +process.argv[3];

const updateTime = (time) => {
  const splittedTime = time.split(":");
  const minutes = +splittedTime[1];
  const seconds = +splittedTime[2].split(".")[0];
  const milliseconds = +splittedTime[2].split(".")[1];
  const date = new Date();
  date.setMinutes(minutes - substractMinutes);
  date.setSeconds(seconds - substractSeconds);
  const updatedTime = `${splittedTime[0]}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}.${milliseconds}`;
  console.log("updatedTime", updatedTime);

  return updatedTime;
};

const updateLine = (match) => {
  console.log("match", match);
  return `${[0, 1].map((i) => updateTime(match.split(",")[i])).join(",")}\n`;
};

const updatedContent = content.replace(
  /\d+:\d\d:\d\d\.\d\d\d\,\d+:\d\d:\d\d\.\d\d\d\n/g,
  updateLine
);

console.log(/^\d+:\d\d:\d\d\.\d\d\d\,\d+:\d\d:\d\d\.\d\d\d$/g.test(content));
fs.writeFileSync(getFileName(`${name} - UPDATED`), updatedContent);
