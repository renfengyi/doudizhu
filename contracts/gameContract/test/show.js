contracts = require("./contracts");

for (i in contracts) {
    console.log(i + "\t: " + contracts[i].address);
}
