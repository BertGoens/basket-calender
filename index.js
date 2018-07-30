const dateFns = require("date-fns");

// remove ‘node’ and the path to your script
var strippedArguments = process.argv.slice(2);

var program = require("minimist")(strippedArguments);

const fileIn = program.in;
const fileOut = program.out;
const homeTeam = program.home;
const homeAlias = program.alias;
console.log("File to read: " + fileIn);
console.log("File to save: " + fileOut);
console.log("Hometeam: " + homeTeam + " to be changed into " + homeAlias);

// google csv separator
const separator = ",";

// google header row
const headerRow = [
  "Subject",
  "Start date",
  "Start time",
  "End Date",
  "End Time",
  "All Day Event",
  "Private",
  "Location",
  "Description"
];

// Read file
const lineReader = require("line-reader");

let headersRead = false;
let csvContent = "";
let firstLine = true;

lineReader.eachLine(fileIn, function(line, last) {
  if (firstLine) {
    console.log("Processing started");
    firstLine = false;
  }

  let row = "";
  if (headersRead) {
    const table = line.split(";");
    const sorted = transformLine(table);
    row = sorted.join(separator);
  } else {
    headersRead = true;
    row = headerRow.join(separator);
  }

  if (last) {
    console.log("Processing finished");
    const fs = require("fs");
    console.log("Saving started");
    fs.writeFile(fileOut, csvContent, function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("Saving finished");
    });
  }

  csvContent += row + "\r\n";
});

function transformLine(arr) {
  const makeSubject = () => {
    if (program.alias) {
      // "0 Thuisploeg","1 Uit",
      if (arr[0] === program.home) arr[0] = program.alias;
      if (arr[1] === program.home) arr[1] = program.alias;
    }

    const subject = arr[0] + " vs " + arr[1];
    return subject;
  };

  const makeStartDate = () => {
    const jsDate = dateFns.parse(arr[2], "dd/MM/yyyy", new Date());
    const formatted = dateFns.format(jsDate, "MM/dd/yyyy");
    return formatted;
  };

  const makeStartTime = () => {
    const time = arr[4];
    const hours = time.substring(0, 2);
    const minutes = time.substr(2);
    // 12h time
    const googleDate = new Date(0, 0, 0, hours, minutes);
    const format12H = dateFns.format(googleDate, "hh:mm a");
    return format12H;
  };

  const makeEndTime = () => {
    const calculateEndTime = parseInt(arr[4]) + 200;
    const time = calculateEndTime.toString();
    const hours = time.substring(0, 2);
    const minutes = time.substr(2);
    // 12h time
    const googleDate = new Date(0, 0, 0, hours, minutes);
    const format12H = dateFns.format(googleDate, "hh:mm a");
    return format12H;
  };

  const makeDescription = () => {
    let description = `"`;

    if (arr[3]) description += "Vertrek " + arr[3] + "\n";
    description += "Start match " + arr[4] + "\n";
    description += "Zaal " + arr[5];

    description += `"`;
    return description;
  };

  const sorted = {
    Subject: makeSubject(),
    StartDate: makeStartDate(), // Date, must be in the format MM/DD/YYYY
    StartTime: makeStartTime(), // in 12-hour format, not military time) Aanvangsuur, vertrekuur is niet ingevuld bij thuismatch
    EndDate: makeStartDate(), // Date, must be in the format MM/DD/YYYY
    EndTime: makeEndTime(),
    IsAllDayEvent: "FALSE",
    IsPrivate: "FALSE",
    Location: "",
    Description: makeDescription()
  };

  // Google csv row according to headers */
  const ordered = [
    sorted.Subject,
    sorted.StartDate,
    sorted.StartTime,
    sorted.EndDate,
    sorted.EndTime,
    sorted.IsAllDayEvent,
    sorted.IsPrivate,
    sorted.Location,
    sorted.Description
  ];

  return ordered;
}
