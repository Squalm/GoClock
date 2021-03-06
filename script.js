// Update the timer with the new desired settings
var initialTime = 0;
var timeControl = "";
var periodTime = 0;
var periodNumber = 0;
var feedback = "";
let timer = null;

function updateTimer() {

    feedback = "Updated Clock.";

    // Get the time control
    timeControl = document.getElementById("timeControl").value;
    //console.log(timeControl);

    // Get the initial time
    initialTime = 
        (document.getElementById("initialTimeHours").value == "" ? 0 : parseInt(document.getElementById("initialTimeHours").value)) * 3600 + 
        (document.getElementById("initialTimeMins").value == "" ? 0 : parseInt(document.getElementById("initialTimeMins").value)) * 60 + 
        (document.getElementById("initialTimeSecs").value == "" ? 0 : parseInt(document.getElementById("initialTimeSecs").value));
    initialTime *= 10; // This puts the number in 10ths of a second

    if (isNaN(initialTime)) {
        feedback = "Please input a valid starting time.";
    }

    // Get period bits
    periodTime = (document.getElementById("periodTime").value == "" ? 0 : parseInt(document.getElementById("periodTime").value));
    periodTime *= 10; // This puts the numebr in 10th of a second

    if (isNaN(periodTime) && (timeControl == "byo-yomi" || timeControl == "fischer")) {
        feedback = "Please input a valid period length."
    }

    periodNumber = (document.getElementById("periodNumber").value == "" ? 0 : parseInt(document.getElementById("periodNumber").value));

    if (isNaN(periodNumber) && (timeControl == "byo-yomi")) {
        feedback = "Please input a valid period length"
    }    

    // Give feedback to the user
    document.getElementById("button-feedback").innerHTML = feedback;

    // Update the settings
    if (feedback == "Updated Clock.") {
        
        // Set the clocks to the starting time
        document.getElementById("leftClock").innerHTML = timeFormatConvert(initialTime, removeUnnecessaryPaddingUser).toString();
        document.getElementById("rightClock").innerHTML = timeFormatConvert(initialTime, removeUnnecessaryPaddingUser).toString();

        // Set the vars that will be counting down to their initial values
        timeRemainingRight = initialTime;
        timeRemainingLeft = initialTime;

        periodNumberRemainingLeft = periodNumber;
        periodNumberRemainingRight = periodNumber;

        // Time control specific cool bits
        if (timeControl == "fischer") {
            document.getElementById("periodMarkerLeft").innerHTML = 
                "+" + timeFormatConvert(periodTime, removeUnnecessaryPaddingUser);
            document.getElementById("periodMarkerRight").innerHTML = 
                "+" + timeFormatConvert(periodTime, removeUnnecessaryPaddingUser);
        } else if (timeControl == "byo-yomi") {
            document.getElementById("periodMarkerLeft").innerHTML = 
                periodNumber.toString() + "x " + timeFormatConvert(periodTime, removeUnnecessaryPaddingUser);
            document.getElementById("periodMarkerRight").innerHTML =
                periodNumber.toString() + "x " + timeFormatConvert(periodTime, removeUnnecessaryPaddingUser);
        } else if (timeControl == "canadian") {
            document.getElementById("periodMarkerLeft").innerHTML =
                timeFormatConvert(periodTime, removeUnnecessaryPaddingUser) + " / " + periodNumber.toString();
            document.getElementById("periodMarkerRight").innerHTML =
                timeFormatConvert(periodTime, removeUnnecessaryPaddingUser) + " / " + periodNumber.toString();
        } else {
            document.getElementById("periodMarkerLeft").innerHTML = "";
            document.getElementById("periodMarkerRight").innerHTML = "";
        }

    }

}

document.querySelector("#updateTimerButton").addEventListener("click", updateTimer);

// Show or hide the inputs based on the select list
function showHideInputs(evt) {
    
    let _timeControl = evt.target.value

    if (_timeControl == "byo-yomi") {

        // If byo-yomi, show both fields
        let _element = document.getElementById("periodTimeContainer");
        _element.style.display = "";
        _element = document.getElementById("periodNumberContainer");
        _element.style.display = "";

        document.getElementById("periodTimeLabel").innerHTML = "Set a period length<br>" + document.getElementById("periodTime").outerHTML;
        document.getElementById("periodNumberLabel").innerHTML = "Set a period number<br>" + document.getElementById("periodNumber").outerHTML;

    } else if (_timeControl == "fischer") {
        
        // If fischer show only the period time field
        let _element = document.getElementById("periodTimeContainer");
        _element.style.display = "";
        _element = document.getElementById("periodNumberContainer");
        _element.style.display = "none";

        document.getElementById("periodTimeLabel").innerHTML = "Set a bonus time<br>" + document.getElementById("periodTime").outerHTML;

    } else if (_timeControl == "canadian") {
        
        // If canadian show both fields
        let _element = document.getElementById("periodTimeContainer");
        _element.style.display = "";
        _element = document.getElementById("periodNumberContainer");
        _element.style.display = "";

        document.getElementById("periodTimeLabel").innerHTML = "Set a period length<br>" + document.getElementById("periodTime").outerHTML;
        document.getElementById("periodNumberLabel").innerHTML = "Set a number of moves per period<br>" + document.getElementById("periodNumber").outerHTML;

    } else {
        // If anything else hide both fields
        let _element = document.getElementById("periodTimeContainer");
        _element.style.display = "none";
        _element = document.getElementById("periodNumberContainer");
        _element.style.display = "none";
    }

}

document.querySelector("#timeControl").addEventListener("change", showHideInputs);

// Start the timer!
function startTimer() {
    
    if (feedback == "Updated Clock.") {
        // Hide the settings
        let element = document.getElementById("timeSettings");
        element.style.display = "none";
        // Show stop button
        element = document.getElementById("stopButton");
        element.style.display = "";

        gameActive = true;

        if (timeControl == "fischer") { // This fixes the bug where in fischer time gets extra bonus time as the game starts
            timeRemainingLeft -= periodTime;
        }

        const _timesetup = new Date();
        timeOnLastClick = _timesetup.getTime();

        // Rest of timer stuff currently handled in document.onclick
    }

}

document.querySelector("#startButton").addEventListener("click", startTimer);

// Stop the timer!
function stopTimer() {

    window.setTimeout (
    function () {

        // Show the settings
        let element = document.getElementById("timeSettings");
        element.style.display = "";
        // Hide the end button
        element = document.getElementById("stopButton");
        element.style.display = "none";

        // Stop the clocks
        window.clearInterval(timer);

        gameActive = false;

        inPeriodLeft = false;
        inPeriodRight = false;

    }
    );

}

document.querySelector("#stopButton").addEventListener("click", stopTimer);
// Initially hide the "end game" button.
stopTimer();

// Convert between the time to display and the internal counter
function timeFormatConvert(time, removeUnnecessaryPadding) {

    // Only works for the padded string
    if (typeof time === typeof "string") {
        return parseInt(time.slice(0,2)) * 3600 + parseInt(time.slice(3,6)) * 60 + parseInt(time.slice(6))
    }

    if (typeof time === typeof 20) {

        let _time = (time / 10) | 0;

        if (!removeUnnecessaryPadding) { 

            // Thoroughly jank system that converts the time in seconds to hours:minutes:seconds
            return (
                ((_time / 3600) | 0).toString().padStart(2, "0") +":"+ 
                (((_time - ((_time / 3600) | 0) * 3600) / 60) | 0).toString().padStart(2, "0") +":"+ 
                (_time - ((_time/60) | 0) * 60).toString().padStart(2, 0) + "." +
                (time - (_time * 10))
                );
        
        } else { // If removeUnnecessaryPadding is true

            if ((time / 36000) | 0 >  0) { // If there be hours

                const _timeHours = (((_time / 3600) | 0) | 0).toString();
                const _timeMins = ((((_time - ((_time / 3600) | 0) * 3600) / 60) | 0) | 0).toString().padStart(2, "0");
                const _timeSecs = ((_time - ((_time / 60) | 0) * 60) | 0).toString().padStart(2, "0");
                const _timeTenths = (time - ((time/10) | 0) * 10).toString();

                return (_timeHours + ":" + _timeMins + ":" + _timeSecs + "." + _timeTenths);

            } else { // If there only be minutes

                const _timeMins = ((_time / 60) | 0).toString();
                const _timeSecs = ((_time - ((_time / 60) | 0) * 60) | 0).toString().padStart(2, "0");
                const _timeTenths = (time - (_time * 10)).toString();

                return (_timeMins + ":" + _timeSecs + "." + _timeTenths);

            }

        }

    }

}

// Click detection to swap the clock
var activeTimer = "leftClock";
var gameActive = false;
var timeRemainingLeft = 0;
var timeRemainingRight = 0;
var inPeriodLeft = false;
var inPeriodRight = false;
var periodNumberRemainingLeft = 0;
var periodNumberRemainingRight = 0;
var removeUnnecessaryPaddingUser = true;
var moveCounterLeft = -1;
var moveCounterRight = 0;
var justSwapped = false;
var timeOnLastClick = 0;
var timeRemainingOnLastClick = 0;

// On click swap the timer
document.onclick = function() {allTimeControl();};

// All time control buisness
function allTimeControl() {
    window.clearInterval(timer);

    justSwapped = true;

    let _timesetup = new Date();
    timeOnLastClick = _timesetup.getTime();

    if (activeTimer == "leftClock" && gameActive) {

        moveCounterLeft += 1;

        activeTimer = "rightClock";

        timeRemainingOnLastClick = timeRemainingRight;

        // Apply time control specific rules
        if (timeControl == "fischer") {
            timeRemainingLeft += periodTime;
        } 
        if (timeControl == "simple") {
            timeRemainingLeft = initialTime;
            timeRemainingRight = initialTime;
        }
        if (timeControl == "canadian") {
            if (moveCounterLeft >= periodNumber && inPeriodLeft) { // When using canadian time, periodNumber is the number of moves to get more time
                moveCounterLeft = 0;
                timeRemainingLeft = periodTime;
            }
        }

        if (timeControl == "byo-yomi") {
            if (inPeriodRight && periodNumberRemainingRight >= 0) {
                timeRemainingRight = periodTime;
            }
            if (inPeriodLeft && periodNumberRemainingLeft >= 0) {
                timeRemainingLeft = periodTime;
            }
        }

        // Format on swap
        document.getElementById("leftClock").style.color = "#c97d60";

        // Countdown
        timer = window.setInterval(
        function () {
              
            _timesetup = new Date();
            timeRemainingRight = Math.round(timeRemainingOnLastClick - ((_timesetup.getTime() - timeOnLastClick) /100));

            // Byo-yomi rules
            if (timeControl == "byo-yomi") {

                if ((periodNumberRemainingRight <= 0 || periodNumberRemainingRight <= 0) && timeRemainingRight <= 0) {
                    stopTimer();
                }

                if (timeRemainingRight <= 0 && periodNumberRemainingRight > 0) {

                    // Remove periods once used
                    if (inPeriodRight) {
                        periodNumberRemainingRight -= 1;
                    }

                    inPeriodRight = true;

                    // Reset time each move '>= 0' for SD. 
                    if (inPeriodRight && periodNumberRemainingRight >= 0) {
                        timeRemainingRight = periodTime;
                        _timesetup = new Date();
                        timeOnLastClick = _timesetup.getTime();
                        timeRemainingOnLastClick = timeRemainingRight;
                    }
                    if (inPeriodLeft && periodNumberRemainingLeft >= 0) {
                        timeRemainingLeft = periodTime;
                        _timesetup = new Date();
                        timeOnLastClick = _timesetup.getTime();
                        timeRemainingOnLastClick = timeRemainingLeft;
                    }

                }
            
            } else if (timeControl == "canadian") { // Canadian rules

                if (timeRemainingRight <= 0 && inPeriodRight == false) {
                    inPeriodRight = true;
                    timeRemainingRight = periodTime;
                    moveCounterRight = 0;

                    _timesetup = new Date();
                    timeOnLastClick = _timesetup.getTime();
                    timeRemainingOnLastClick = timeRemainingRight;
                }
            } else {
                
                if (timeRemainingLeft <= 0) {  stopTimer();  }

            }

            timeDisplay();

            // Format the timer
            if (justSwapped == true) {
                document.getElementById("leftClock").style.color = "#F0F0F0"
                document.getElementById("rightClock").style.color = "#F0F0F0"
            }

            justSwapped = false;

        }, 100);

    } else if (activeTimer == "rightClock" && gameActive) {

        moveCounterRight += 1;

        activeTimer = "leftClock";

        timeRemainingOnLastClick = timeRemainingLeft;

        // Apply time control specific rules
        if (timeControl == "fischer") {
            timeRemainingRight += periodTime;
        } 
        if (timeControl == "simple") {
            timeRemainingLeft = initialTime;
            timeRemainingRight = initialTime;
        }
        if (timeControl == "canadian") {
            if (moveCounterRight >= periodNumber && inPeriodRight) { // When using canadian time, periodNumber is the number of moves to get more time
                moveCounterRight = 0;
                timeRemainingRight = periodTime;
            }
        }


        if (timeControl == "byo-yomi") {
            if (inPeriodRight && periodNumberRemainingRight >= 0) {
                timeRemainingRight = periodTime;
            }
            if (inPeriodLeft && periodNumberRemainingLeft >= 0) {
                timeRemainingLeft = periodTime;
            }
        }

        // Format on swap
        document.getElementById("rightClock").style.color = "#c97d60";

        // Countdown
        timer = window.setInterval(
        function () {
              
            _timesetup = new Date();
            timeRemainingLeft = Math.round(timeRemainingOnLastClick - ((_timesetup.getTime() - timeOnLastClick) /100));

            // Byo-yomi rules
            if (timeControl == "byo-yomi") {

                if ((periodNumberRemainingLeft <= 0 || periodNumberRemainingLeft <= 0) && timeRemainingLeft <= 0) {
                    stopTimer();
                }

                if (timeRemainingLeft <= 0 && periodNumberRemainingLeft > 0) {

                    // Remove periods once used
                    if (inPeriodLeft) {
                        periodNumberRemainingLeft -= 1; 
                    }

                    inPeriodLeft = true;

                    // Reset time each move '>= 0' for SD. 
                    if (inPeriodRight && periodNumberRemainingRight >= 0) {
                        timeRemainingRight = periodTime;
                        _timesetup = new Date();
                        timeOnLastClick = _timesetup.getTime();
                        timeRemainingOnLastClick = timeRemainingRight;
                    }
                    if (inPeriodLeft && periodNumberRemainingLeft >= 0) {
                        timeRemainingLeft = periodTime;
                        _timesetup = new Date();
                        timeOnLastClick = _timesetup.getTime();
                        timeRemainingOnLastClick = timeRemainingLeft;
                    }
                }

            } else if (timeControl == "canadian") { // Canadian rules

                if (timeRemainingLeft <= 0 && inPeriodLeft == false) {
                    inPeriodLeft = true;
                    timeRemainingLeft = periodTime;
                    moveCounterLeft = 0;

                    _timesetup = new Date();
                    timeOnLastClick = _timesetup.getTime();
                    timeRemainingOnLastClick = timeRemainingLeft;
                }
            } else {

                if (timeRemainingLeft <= 0) {  stopTimer();  }

            }

            timeDisplay();

            // Format the timer
            if (justSwapped == true) {
                document.getElementById("leftClock").style.color = "#F0F0F0"
                document.getElementById("rightClock").style.color = "#F0F0F0"
            }

            justSwapped = false;

        }, 100);

    } 
}

// Put the times on the screen
function timeDisplay() {

    if (timeRemainingRight >= 0) {
        document.getElementById("rightClock").innerHTML = timeFormatConvert(timeRemainingRight, removeUnnecessaryPaddingUser);
    }
    if (timeRemainingLeft >= 0) {
        document.getElementById("leftClock").innerHTML = timeFormatConvert(timeRemainingLeft, removeUnnecessaryPaddingUser);
    }

    if (timeControl == "byo-yomi") {
        if (periodNumberRemainingRight > 0) {
            document.getElementById("periodMarkerRight").innerHTML = 
                periodNumberRemainingRight.toString() + "x " + timeFormatConvert(periodTime, removeUnnecessaryPaddingUser);
        }
        if (periodNumberRemainingRight == 0) {
            document.getElementById("periodMarkerRight").innerHTML = "SD"
        }
        if (periodNumberRemainingLeft > 0) {
            document.getElementById("periodMarkerLeft").innerHTML = 
                periodNumberRemainingLeft.toString() + "x " + timeFormatConvert(periodTime, removeUnnecessaryPaddingUser);
        }
        if (periodNumberRemainingLeft == 0) {
            document.getElementById("periodMarkerLeft").innerHTML = "SD"
        }
    } else if (timeControl == "canadian") {
        document.getElementById("periodMarkerRight").innerHTML =
            timeFormatConvert(periodTime, removeUnnecessaryPaddingUser) + " / " + periodNumber.toString() + (inPeriodRight ? " (" + (periodNumber - moveCounterRight).toString() + ")" : "");
        document.getElementById("periodMarkerLeft").innerHTML =
            timeFormatConvert(periodTime, removeUnnecessaryPaddingUser) + " / " + periodNumber.toString() + (inPeriodLeft ? " (" + (periodNumber - moveCounterLeft).toString() + ")" : "");
    }

}

/*
// Show and hide the settings menu on button pressed.
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("onClick", function() {

        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }

    });
}
*/
