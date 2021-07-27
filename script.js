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
        parseInt(document.getElementById("initialTimeHours").value) * 3600 + 
        parseInt(document.getElementById("initialTimeMins").value) * 60 + 
        parseInt(document.getElementById("initialTimeSecs").value);
    //console.log(initialTime);

    if (isNaN(initialTime)) {
        feedback = "Please input a valid starting time.";
    }

    // Get period bits
    periodTime = parseInt(document.getElementById("periodTime").value);

    if (isNaN(periodTime) && (timeControl == "byo-yomi" || timeControl == "fischer")) {
        feedback = "Please input a valid period length."
    }

    periodNumber = parseInt(document.getElementById("periodNumber").value);

    if (isNaN(periodNumber) && (timeControl == "byo-yomi")) {
        feedback = "Please input a valid period length"
    }    

    // Give feedback to the user
    document.getElementById("button-feedback").innerHTML = feedback;
    //alert(feedback);

    // Update the settings
    if (feedback == "Updated Clock.") {
        
        // Set the clocks to the starting time
        document.getElementById("leftClock").innerHTML = timeFormatConvert(initialTime).toString();
        document.getElementById("rightClock").innerHTML = timeFormatConvert(initialTime).toString();

        // Set the vars that will be counting down to their initial values
        timeRemainingRight = initialTime;
        timeRemainingLeft = initialTime;

        periodNumberRemainingLeft = periodNumber;
        periodNumberRemainingRight = periodNumber;

        // Time control specific cool bits
        if (timeControl == "fischer") {
            document.getElementById("periodMarkerLeft").innerHTML = 
                "+" + periodTime.toString();
            document.getElementById("periodMarkerRight").innerHTML = 
                "+" + periodTime.toString();
        } else if (timeControl == "byo-yomi") {
            document.getElementById("periodMarkerLeft").innerHTML = 
                periodNumber.toString() + "x " + periodTime.toString();
            document.getElementById("periodMarkerRight").innerHTML =
                periodNumber.toString() + "x " + periodTime.toString();
        } else {
            document.getElementById("periodMarkerLeft").innerHTML = "";
            document.getElementById("periodMarkerRight").innerHTML = "";
        }

    }

}

// Start the timer!
function startTimer() {
    
    if (feedback !== "") {
        // Hide the settings
        let element = document.getElementById("timeSettings");
        element.style.display = "none";
        // Show stop button
        element = document.getElementById("stopButton");
        element.style.display = "";

        gameActive = true;

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

        inByoYomiLeft = false;
        inByoYomiRight = false;

    }
    );

}

// Initially hide the "end game" button.
stopTimer();

// Convert between the time to display and the internal counter
function timeFormatConvert(time) {

    if (typeof time === typeof "string") {
        return parseInt(time.slice(0,2)) * 3600 + parseInt(time.slice(3,6)) * 60 + parseInt(time.slice(6))
    }

    if (typeof time === typeof 20) {
        // thoroughly jank system that converts the time in seconds to hours:minutes:seconds
        return (
            ((time / 3600) | 0).toString().padStart(2, "0") +":"+ 
            (((time - ((time / 3600) | 0) * 3600) / 60) | 0).toString().padStart(2, "0") +":"+ 
            (time - ((time/60) | 0) * 60).toString().padStart(2, 0)
            )
    }

}

// Click detection to swap the clock.
var activeTimer = "leftClock";
var gameActive = false;
var timeRemainingLeft = 0;
var timeRemainingRight = 0;
var inByoYomiLeft = false;
var inByoYomiRight = false;
var periodNumberRemainingLeft = 0;
var periodNumberRemainingRight = 0;

document.onclick = function() {

    window.clearInterval(timer);
    //console.log(timeControl);

    if (activeTimer == "leftClock" && gameActive) {

        activeTimer = "rightClock";

        // Apply time control specific rules
        if (timeControl == "fischer") {
            timeRemainingLeft += periodTime;
        } 
        if (timeControl == "simple") {
            timeRemainingLeft = initialTime;
            timeRemainingRight = initialTime;
        }
        if (inByoYomiRight && periodNumberRemainingRight >= 0) {
            timeRemainingRight = periodTime;
        }
        if (inByoYomiLeft && periodNumberRemainingLeft >= 0) {
            timeRemainingLeft = periodTime;
        }

        // Countdown
        timer = window.setInterval(
        function () {
              
            timeRemainingRight -= 1;

            // Byo-yomi rules
            if (timeControl == "byo-yomi") {

                if (timeRemainingRight <= 0) {

                    // Remove periods once used
                    if (inByoYomiRight) {
                        periodNumberRemainingRight -= 1;
                    }

                    inByoYomiRight = true;

                    // Reset time each move '>= 0' for SD. 
                    if (inByoYomiRight && periodNumberRemainingRight >= 0) {
                        timeRemainingRight = periodTime;
                    }
                    if (inByoYomiLeft && periodNumberRemainingLeft >= 0) {
                        timeRemainingLeft = periodTime;
                    }

                }

            }

            timeDisplay();

        }, 1000);

    } else if (activeTimer == "rightClock" && gameActive) {

        activeTimer = "leftClock";

        // Apply time control specific rules
        if (timeControl == "fischer") {
            timeRemainingRight += periodTime;
        } 
        if (timeControl == "simple") {
            timeRemainingLeft = initialTime;
            timeRemainingRight = initialTime;
        }
        if (inByoYomiRight && periodNumberRemainingRight > 0) {
            timeRemainingRight = periodTime;
        }
        if (inByoYomiLeft && periodNumberRemainingLeft > 0) {
            timeRemainingLeft = periodTime;
        }

        // Countdown
        timer = window.setInterval(
        function () {
              
            timeRemainingLeft -= 1;

            // Byo-yomi rules
            if (timeControl == "byo-yomi") {

                if (timeRemainingLeft <= 0) {

                    // Remove periods once used
                    if (inByoYomiLeft) {
                        periodNumberRemainingLeft -= 1;
                    }

                    inByoYomiLeft = true;

                    // Reset time each move '>= 0' for SD. 
                    if (inByoYomiRight && periodNumberRemainingRight >= 0) {
                        timeRemainingRight = periodTime;
                    }
                    if (inByoYomiLeft && periodNumberRemainingLeft >= 0) {
                        timeRemainingLeft = periodTime;
                    }
                }

            }

            timeDisplay();
            formatTimer();

        }, 1000);

    } 

}

// Put the times on the screen
function timeDisplay() {

    if (timeRemainingRight >= 0) {
        document.getElementById("rightClock").innerHTML = timeFormatConvert(timeRemainingRight);
    }
    if (timeRemainingLeft >= 0) {
        document.getElementById("leftClock").innerHTML = timeFormatConvert(timeRemainingLeft);
    }

    if (timeControl == "byo-yomi") {
        if (periodNumberRemainingRight > 0) {
            document.getElementById("periodMarkerRight").innerHTML = 
                periodNumberRemainingRight.toString() + "x " + periodTime.toString();
        }
        if (periodNumberRemainingRight == 0) {
            document.getElementById("periodMarkerRight").innerHTML = "SD"
        }
        if (periodNumberRemainingLeft > 0) {
            document.getElementById("periodMarkerLeft").innerHTML = 
                periodNumberRemainingLeft.toString() + "x " + periodTime.toString();
        }
        if (periodNumberRemainingLeft == 0) {
            document.getElementById("periodMarkerLeft").innerHTML = "SD"
        }
    }

}

// Format the specified timer, e.g. when low on time make it go red.
function formatTimer() {

}

