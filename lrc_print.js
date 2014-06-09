// 同步显示歌词
var lyc_print_timer;
function printLyc(lycObj, printCallback) {
	var current = 0,
		sentences = lycObj['sentences'],
		len = sentences.length;
	printNextSentence();
	function printNextSentence() {
		if (current >= len) {
			return;
		}
		var prevTime = 0,
			nextTime = sentences[current][0]
			sentence = sentences[current][1];
		if (current > 0) {
			prevTime = sentences[current - 1][0];
		}
		var index = current + 1;
		lyc_print_timer = setTimeout(function () {
			printCallback(sentence, nextTime, index);
			printNextSentence();
		}, (nextTime - prevTime) * 1000);
		current++;
	}
}
function stopPrint() {
	clearInterval(lyc_print_timer);
}
