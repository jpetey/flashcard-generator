// Incorporate the fs package to read and write files
var fs = require ('fs');

// Incorporate the fs package to prompt user with questions
var inquirer = require ("inquirer");

// Ask user what kind of Flashcard (Basic or Cloze) that they'd like to make
inquirer.prompt([
	{
		type: "list",
	    name: "flashcardType",
	    message: "What kind of Flashcard would you like to make?",
	    choices: [ "Basic", "Cloze" ]
	},
	{
		type: "input",
	    name: "cardCountInput",
	    message: "How many Flashcards would you like to make?"
	}

]).then(function(selection) {

	cardsNeeded = parseInt(selection.cardCountInput);

	if (selection.flashcardType === "Basic") {

		basicPrompts();

	} else if (selection.flashcardType === "Cloze") {

		clozePrompts();

	}
});


// BasicCard Constructor
function BasicCard (front, back) {
	this.front = front;
	this.back = back;
};

// Add functions to BasicCard
BasicCard.prototype.verifyInfo = function() {
	console.log("You wrote:");
	console.log("Flashcard front: " + this.front);
	console.log("Flashcard back: " + this.back);
};

BasicCard.prototype.showFront = function() {
	console.log("Q: " + this.front);
};

BasicCard.prototype.showBack = function() {
	console.log("A: " + this.back);
};


// How many cards the user wants to make
var cardsNeeded = "";
// Our card counter variable for recusion
var cardCount = 0;
// array in which we will store each of our new basicCard objects
var basicCardArray = [];

var basicPrompts = function () {

	if (cardCount < cardsNeeded) {

		inquirer.prompt([
			{
				type: "input",
			    name: "frontBasic",
			    message: "What would you like the front of your Basic Flashcard #" + (cardCount + 1) + " to read?"
			},
			{
				type: "input",
			    name: "backBasic",
			    message: "What would you like the back of your Basic Flashcard #" + (cardCount + 1) + " to read?"
			}

		]).then(function(content) {
			// initialize variable userBasicCard to be a BasicCard object to take in user's content inputs
			var userBasicCard = new BasicCard (
	        	content.frontBasic,
	        	content.backBasic);

			// Show that the userBasicCard object was successfully created and filled
     		userBasicCard.verifyInfo();
     		// Push userBasicCard object into basicCardArray
		    basicCardArray.push(userBasicCard);
		    // add one to count to increment our recursive loop by one
		    cardCount++;
		    // run the askquestion function again so as to either end the loop or ask the questions again
		    basicPrompts();

		});
	// else statement which runs a for loop that will execute .printInfo() for each object inside of our array
	} else {
		console.log("All cards have been stored.");
		// console.log("Please press 'Enter' & then type 'run-cards' to run application. NOTE: This function is not yet working so please don't type it!");
		console.log(basicCardArray);
	    // Store the data
		fs.writeFile("basic-flashcards.txt", JSON.stringify(basicCardArray));
	}
}


//================================

// ClozeCard Constructor
function ClozeCard (textBeforeCloze, cloze, textAfterCloze) {
	this.textBeforeCloze = textBeforeCloze;
	this.cloze = cloze; 
	this.textAfterCloze = textAfterCloze; 
};

ClozeCard.prototype.verifyInfo = function() {
	console.log("You wrote:");
	console.log(this.textBeforeCloze + this.cloze +	this.textAfterCloze); 
	console.log("Where '" + this.cloze + "' will be hidden." );
};

ClozeCard.prototype.returnPartialText = function() {
	console.log("Fill in: the blank:": this.textBeforeCloze + "___________" + this.textAfterCloze);
};

ClozeCard.prototype.returnCloze = function() {
	console.log("Your cloze is: ": this.cloze);
};

ClozeCard.prototype.returnFullText = function() {
	console.log("Full answer: " + this.textBeforeCloze + "*" + this.cloze + "*" + this.textAfterCloze); 
};

ClozeCard.prototype.guessCloze = function() {
	
	var userClozeGuess = process.argv[2];

	switch (userClozeGuess) {
		case this.cloze: 
			console.log("Correct!");
			this.returnFullText;
			break;
		default:
			console.log("Incorrect!");
	}
};


// How many cards the user wants to make
var cardsNeeded = "";
// Our card counter variable for recusion
var cardCount = 0;
// array in which we will store each of our new basicCard objects
var clozeCardArray = [];

var clozePrompts = function () {

	if (cardCount < cardsNeeded) {

		inquirer.prompt([
			{
				type: "input",
			    name: "clozeText",
			    message: "Please enter what you would like your card to read. Surround Cloze text in asterisks (*). \nFor example: '*Sacramento* is the capital of California' will initally store 'Sacramento' as teh cloze.\n",
			    validate: function (value) {
      				var pass = value.match(/\*/g);
      					if (length.pass === 2) {
        					return true;
      					}

     			 		return 'Please check your input format and try again.';
    					}	
			},

		]).then(function(content) {
			// initialize variable userBasicCard to be a BasicCard object to take in user's content inputs
			
			var userInputForCloze = content.clozeText;

			var userResponseArray = userInputForCloze.split("*");

			var userClozeCard = new ClozeCard (
	        	userResponseArray[0],
	        	userResponseArray[1],
	        	userResponseArray[2]);

			// Show that the userBasicCard object was successfully created and filled
     		userClozeCard.verifyInfo();
     		// Push userBasicCard object into basicCardArray
		    clozeCardArray.push(userClozeCard);
		    // add one to count to increment our recursive loop by one
		    cardCount++;
		    // run the askquestion function again so as to either end the loop or ask the questions again
		    clozePrompts();

		});
	// else statement which runs a for loop that will execute .printInfo() for each object inside of our array
	} else {
		console.log("All cards have been stored.");
		// console.log("Please press 'Enter' & then type 'run-cards' to run application. NOTE: This function is not yet working so please don't type it!");
		console.log(clozeCardArray);
	    // Store the data
		fs.writeFile("cloze-flashcards.txt", JSON.stringify(clozeCardArray));
	}
}


