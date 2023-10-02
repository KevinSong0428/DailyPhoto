const { spawn } = require("child_process");
const { resolve } = require("path");

function colorPalette(url) {
    return new Promise((resolve, reject) => {
        // takes in path to the python script and input to py script is url
        // PASS IN PATH INSTEAD OF RELATIVE PATH
        const py = spawn("python", ["color.py", url]);
        let result = "";

        py.stdout.on("data", (data) => {
            result += data.toString();
            console.log(data.toString())
        })

        py.stderr.on("data", (data) => {
            console.log(`Error: ${data}`);
            // res.status(500).render("error", { data });
            reject(data.toString());
        })

        // after Python script finishes executing, the "close" event triggers and will attempt to parse the JSON output in an array
        py.on("close", (code) => {
            if (code == 0) {
                try {
                    const imageArr = JSON.parse(result);
                    console.log(result)
                    console.log(typeof imageArr)
                    console.log(imageArr[0])
                    resolve(imageArr)
                } catch (err) {
                    reject(err);
                }
            }
        })
    })

}

module.exports = colorPalette;