// 处理 lyc 文件，用于前端显示歌词

var fs = require('fs');

if (process.argv.length > 2) {
    var lycFile = process.argv[2],
        outputFile = process.argv[3] || 'output.json';
    readLycFile(lycFile, function (data) {
        saveLycJson(lyc2json(data), outputFile, "var lyc = ");
    });
}

function readLycFile(lycFile, onSuccess) {
    fs.readFile(lycFile, { encoding: 'utf-8' }, function (err, data) {
        if (err) throw err;
        console.log("Read file: ", lycFile);
        onSuccess && onSuccess(data);
    });
}

// lyc text to json
function lyc2json(text) {
    var lrc = {}, // 保存歌词其他信息
        sentences = [];
    text.split(/\r\n|\n/).forEach(searchLine);
    return {
        sentences: sentences.sort(sortSentences)
    };

    function searchLine(line) {
        var times = [];
        // [mm:ss.s]
        var sentence = line.replace(/\[(\d+):(\d+(\.\d+)?)\]/,
        function (time, m, s) {
            times.push(parseInt(m, 10) * 60 + parseFloat(s, 10));
            return "";
        }).trim();
        if (times.length > 0 && sentence != "") {
            times.forEach(function (time) {
                sentences.push([time, sentence]);
            });
        }
    }

    function sortSentences(a, b) {
        return a[0] - b[0];
    }
}

function saveLycJson(json, outFile, prefix) {
    var text = (prefix || "") + JSON.stringify(json);
    fs.writeFile(outFile, text, function (err) {
        if (err) throw err;
        console.log("Saved: ", outFile);
    });
}

exports.readLycFile = readLycFile;
exports.lyc2json = lyc2json;
exports.saveLycJson = saveLycJson;
