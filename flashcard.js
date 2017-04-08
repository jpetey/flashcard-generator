// Incorporate the fs package to read and write files
var fs = require ('fs');

// Incorporate the fs package to prompt user with questions
var inquirer = require ("inquirer");

// BasicCard Constructor
function BasicCard (front, back) {
	this.front = front;
	this.back = back;

	this.verifyInfo = function() {
		console.log("You wrote:");
		console.log("Flashcard front: " + front);
		console.log("Flashcard back: " + back);
	};

	this.showFront = function() {
		console.log("Q: " + front);
	};

	this.showBack = function() {
		console.log("A: " + back);
	};
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
		console.log("All cards have been stored. Please press 'Enter' & then type 'run-cards' to run application. NOTE: This function is not yet working so please don't type it!");
		console.log(basicCardArray);
	}
}


//================================

// ClozeCard Constructor
function ClozeCard (text, cloze) {
	this.text = text;
	this.cloze = cloze; 
};

//================================

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

	} else if (selection.flashcardType === "Cloze") {}
});

