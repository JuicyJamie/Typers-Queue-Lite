let started = false;
let correct = 0;
let incorrect = 0;
let keystrokes = 0;
let seconds = 1;
let minutes = 0;
let timerFunc;
let testTitle;

function setup() {
    $(document).click(function() {
        $("#inputBar").focus();
    });
    resetTest();

    $("#restart").click(function() {
        resetTest();
    });

    $("#inputBar").keyup(function(e) {
        keystrokes ++;
        if (e.keyCode !== 13 && e.keyCode !== 9 && !started) {
            beginTest();
        }
        if (e.keyCode === 32) {
            let entered = $("#inputBar").val();
            let currentWord = $("#text-area").find("span.current").text();
            if (entered === currentWord && $("#text-area").find("span.current").next().length !== 0) {
                $("#text-area").find("span.current").addClass("correct");
                $("#text-area").find("span.current").removeClass("current");
                $("#text-area").find("span.nextWord").addClass("current");
                $("#text-area").find("span.current").next().addClass("nextWord");
                $("#text-area").find("span.current").removeClass("nextWord");
                $("#inputBar").val("");
                correct ++;
            }
            else if (entered !== currentWord && $("#text-area").find("span.current").next().length !== 0) {
                $("#text-area").find("span.current").removeClass("wrong-current");
                $("#text-area").find("span.current").addClass("wrong-previous");
                $("#text-area").find("span.current").removeClass("current");
                $("#text-area").find("span.nextWord").addClass("current");
                $("#text-area").find("span.current").next().addClass("nextWord");
                $("#text-area").find("span.current").removeClass("nextWord");
                $("#inputBar").val("");
                incorrect ++;
            }
        }
        else {
            let typed = $("#inputBar").val();
            let currentWord = $("#text-area").find("span.current").text();
            let currentWordTrimmed = currentWord.substring(0, typed.length);
            if (typed != currentWordTrimmed) {
                $("#text-area").find("span.current").addClass("wrong-current");
            }
            else {
                $("#text-area").find("span.current").removeClass("wrong-current");
            }

            if ($("#text-area").find("span.current").next().length === 0) {
                if (typed.length === currentWord.length && typed.length != 0) {
                    //add incorrect words + correct words and then divide by timer to get wpm
                    //divide correct words from total words to get accuracy
                    if (typed == currentWord) {
                        $("#text-area").find("span.current").addClass("correct");
                        $("#text-area").find("span.current").removeClass("current");
                        correct ++;
                    }
                    else {
                        $("#text-area").find("span.current").removeClass("wrong-current");
                        $("#text-area").find("span.current").addClass("wrong-previous");
                        $("#text-area").find("span.current").removeClass("current");
                        incorrect ++;
                    }
                    clearInterval(timerFunc);
                    showResults();
                }
            }
        }
    })
}

function getRandomTest() {
    let rand = Math.floor(Math.random() * 5 + 1);

    $.getJSON("tests.json", function(data) {
        let testArr = turnIntoArray(data['test' + rand].testText);
        testTitle = data['test' + rand].testTitle;
        testArr.map(function(word, i) {
            if (i === 0) {
                $("#text-area").append("<span class='first'>" + word + " </span>");
            }
            else if (i < testArr.length-1){
                $("#text-area").append("<span>" + word + " </span>");
            }
            else {
                $("#text-area").append("<span>" + word + "</span>"); //remove space at end
            }
        })
    });
}

function turnIntoArray(paragraph) {
    let arr = [];
    let trimmed;
    let lastIndex = 0;
    for (let i = 0; i < paragraph.length; i++) {
        if (paragraph[i] === " ") {
            trimmed = paragraph.slice(lastIndex, i);
            lastIndex = i+1;
            arr.push(trimmed);
        }
        else if (i === paragraph.length - 1) {
            trimmed = paragraph.slice(lastIndex, i+1);
            arr.push(trimmed);
        }
    }
    return arr;
}

function beginTest() {
    started = true;
    timer();
    $("#text-area").children("span.first").addClass("current");
    $("#text-area").children("span.first").next().addClass("nextWord");

}

function resetTest() {
    correct = 0;
    incorrect = 0;
    keystrokes = 0;
    started = false;
    seconds = 1;
    minutes = 0;
    document.getElementById("timer").innerHTML = "0:00";
    clearInterval(timerFunc);    
    $("#resultsSheet").hide();
    $("#text-area").html("");
    $("#inputBar").val("");
    getRandomTest();
    $("#inputBar").focus();
}

function showResults() {
    let wpm = Math.round((correct + incorrect) / (minutes * 60 + seconds) * 60);
    $("#wpm").html("<span>You typed</span><h1>" + wpm + "</h1><h2>WPM</h2>");
    $("#testStats").html("<span>Statistics: </span><span> Correct words: "+ correct 
        + "</span><span> Incorrect words: " + incorrect + "</span><span> Total keystrokes: " + keystrokes + "</span>");
    $("#resultsSheet").fadeIn();
}

function timer() {
    let timerDiv = document.getElementById("timer");

    timerFunc = setInterval(function() {
        if (seconds >= 60) {
            minutes ++;
            seconds = 0;
        }
        if (seconds < 10) {
            timerDiv.innerHTML = minutes + ":0" + seconds;
        }
        else {
            timerDiv.innerHTML = minutes + ":" + seconds;
        }
        seconds ++;
    }, 1000);
}


