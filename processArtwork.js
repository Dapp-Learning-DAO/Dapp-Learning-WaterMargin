const fs = require("fs");

async function main() {
  const data = fs.readFileSync("./108.csv", { encoding: "utf-8" });
  let rows = data.split("\n");
  let inputRows = [];
  for (let i = 0; i < rows.length; i++) {
    if (i === 0) continue;
    const row = rows[i].split(",");
    const obj = {
      name: row[2],
      description: `${row[1]}-${row[2]}-${row[4]}`,
      external_url: `https://watermargin.dapp-learning/?id=${row[0]}`,
      image: `https://watermargin.dapp-learning/WaterMargin/${row[0]}.jpg`,
      attributes: [
        {
          trait_type: "Rank",
          value: row[0],
        },
        {
          trait_type: "Nickname",
          value: row[1],
        },
        {
          trait_type: "Name",
          value: row[2],
        },
        {
          trait_type: "Constellation",
          value: row[4],
        },
      ],
    };
    inputRows.push(obj);
  }
  fs.writeFileSync("./artwork.json", JSON.stringify(inputRows), {
    encoding: "utf8",
  });
}
main();
