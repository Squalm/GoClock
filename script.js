// Update the timer with the new desired settings
var initialTime = 0;
var timeControl = "";
var periodTime = 0;
var periodNumber = 0;
var feedback = "";

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

    if (isNaN(initialTime)) {
        feedback = "Please input a valid starting time.";
    }

    // Get period bits
    periodTime = (document.getElementById("periodTime").value == "" ? 0 : parseInt(document.getElementById("periodTime").value));

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

// Show or hide the inputs based on the select list
function showHideInputs() {
    
    let _timeControl = document.getElementById("timeControl").value;

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

        // Rest of timer stuff currently handled in document.onclick
    }

}

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

// Initially hide the "end game" button.
stopTimer();

// Convert between the time to display and the internal counter
function timeFormatConvert(time, removeUnnecessaryPadding) {

    // Only works for the padded string
    if (typeof time === typeof "string") {
        return parseInt(time.slice(0,2)) * 3600 + parseInt(time.slice(3,6)) * 60 + parseInt(time.slice(6))
    }

    if (typeof time === typeof 20) {

        if (!removeUnnecessaryPadding) { 

            // Thoroughly jank system that converts the time in seconds to hours:minutes:seconds
            return (
                ((time / 3600) | 0).toString().padStart(2, "0") +":"+ 
                (((time - ((time / 3600) | 0) * 3600) / 60) | 0).toString().padStart(2, "0") +":"+ 
                (time - ((time/60) | 0) * 60).toString().padStart(2, 0)
                );
        
        } else { // If removeUnnecessaryPadding is true

            if ((time / 3600) | 0 >  0) { // If there be hours
                return (
                    ((time / 3600) | 0).toString() + ":" +
                    (((time - ((time / 3600) | 0) * 3600) / 60) | 0).toString().padStart(2, "0") + ":" +
                    (time - ((time / 60) | 0) * 60).toString().padStart(2, "0")
                );
            } else { // If there only be minutes

                return (
                    ((time / 60) | 0).toString() + ":" +
                    (time - ((time / 60) | 0) * 60).toString().padStart(2, "0")
                );

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

// On click swap the timer
document.onclick = function() {allTimeControl();};

// All time control buisness
function allTimeControl() {
    window.clearInterval(timer);

    justSwapped = true;

    if (activeTimer == "leftClock" && gameActive) {

        moveCounterLeft += 1;

        activeTimer = "rightClock";

        // Apply time control specific rules
        if (timeControl == "fischer") {
            timeRemainingLeft += periodTime;
        } 
        if (timeControl == "simple") {
            timeRemainingLeft = initialTime;
            timeRemainingRight = initialTime;
        }
        if (timeControl == "canadian") {
            if (moveCounterLeft >= periodNumber) { // When using canadian time, periodNumber is the number of moves to get more time
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
              
            timeRemainingRight -= 1;

            // Byo-yomi rules
            if (timeControl == "byo-yomi") {

                if (timeRemainingRight <= 0) {

                    // Remove periods once used
                    if (inPeriodRight) {
                        periodNumberRemainingRight -= 1;
                    }

                    inPeriodRight = true;

                    // Reset time each move '>= 0' for SD. 
                    if (inPeriodRight && periodNumberRemainingRight >= 0) {
                        timeRemainingRight = periodTime;
                    }
                    if (inPeriodLeft && periodNumberRemainingLeft >= 0) {
                        timeRemainingLeft = periodTime;
                    }

                }
            
            }

            // Canadian rules
            if (timeControl == "canadian") {

                if (timeRemainingRight <= 0 && inPeriodRight == false) {
                    inPeriodRight = true;
                    timeRemainingRight = periodTime;
                    moveCounterRight = 0;
                }
            }

            timeDisplay();

            // Format the timer
            if (justSwapped == true) {
                document.getElementById("leftClock").style.color = "#F0F0F0"
                document.getElementById("rightClock").style.color = "#F0F0F0"
            }

            justSwapped = false;

        }, 1000);

    } else if (activeTimer == "rightClock" && gameActive) {

        moveCounterRight += 1;

        activeTimer = "leftClock";

        // Apply time control specific rules
        if (timeControl == "fischer") {
            timeRemainingRight += periodTime;
        } 
        if (timeControl == "simple") {
            timeRemainingLeft = initialTime;
            timeRemainingRight = initialTime;
        }
        if (timeControl == "canadian") {
            if (moveCounterRight >= periodNumber) { // When using canadian time, periodNumber is the number of moves to get more time
                moveCounterRight = 0;
                timeRemainingRight = periodTime;
            }
        }


        if (timeControl == "byo-yomi") {
            if (inPeriodRight && periodNumberRemainingRight > 0) {
                timeRemainingRight = periodTime;
            }
            if (inPeriodLeft && periodNumberRemainingLeft > 0) {
                timeRemainingLeft = periodTime;
            }
        }

        // Format on swap
        document.getElementById("rightClock").style.color = "#c97d60";

        // Countdown
        timer = window.setInterval(
        function () {
              
            timeRemainingLeft -= 1;

            // Byo-yomi rules
            if (timeControl == "byo-yomi") {

                if (timeRemainingLeft <= 0) {

                    // Remove periods once used
                    if (inPeriodLeft) {
                        periodNumberRemainingLeft -= 1;
                    }

                    inPeriodLeft = true;

                    // Reset time each move '>= 0' for SD. 
                    if (inPeriodRight && periodNumberRemainingRight >= 0) {
                        timeRemainingRight = periodTime;
                    }
                    if (inPeriodLeft && periodNumberRemainingLeft >= 0) {
                        timeRemainingLeft = periodTime;
                    }
                }

            }

            // Canadian rules
            if (timeControl == "canadian") {

                if (timeRemainingLeft <= 0 && inPeriodLeft == false) {
                    inPeriodLeft = true;
                    timeRemainingLeft = periodTime;
                    moveCounterLeft = 0;
                }
            }

            timeDisplay();

            // Format the timer
            if (justSwapped == true) {
                document.getElementById("leftClock").style.color = "#F0F0F0"
                document.getElementById("rightClock").style.color = "#F0F0F0"
            }

            justSwapped = false;

        }, 1000);

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
