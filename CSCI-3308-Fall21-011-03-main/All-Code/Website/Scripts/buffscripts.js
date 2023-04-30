/**
 * @overview Front-end scripts for Bufflist.com
 * 
 * Contributors: Nick Cervasio
 * 
 * 
*/

/**
 * @func viewStudentMenu
 * This function will alter the visability of certain divs in the student information section
 * of the signup page
 * 
 * @page signup.html
 * 
 * @param id | id of module to update
 * @param toggle | value to change div settings
 */
function viewStudentMenu(id, toggle){
    if(toggle == 0){
      document.getElementById(id).style.visibility = "hidden";
      document.getElementById(id).style.height = "0px";
    }
    else{
      document.getElementById(id).style.visibility = "visible";
      document.getElementById(id).style.height = "auto";
    }
}

/**
 * @func validateEmail
 * This function will confirm that a user is signing up with a @colorado.edu address
 * 
 * @page signup.html
 */
function validateEmail(){
    var email = document.getElementById('UserEmail').value;
    var student = email.includes("@colorado.edu");

    if(!student) {
      alert("You must be a University of Colorado student/alumni to register!");
      var button = document.getElementById('SubmitButton');
      button.disabled = true;  
    }
}

/**
 * @func changeReqColors
 * This function will change the color of the password field requirements while user is inputing their password
 * 
 * @page signup.html
 * 
 */
function changeReqColors(){

/***Variables to change elements on signup page */
var input = document.getElementById("password");
var letter = document.getElementById("Lowercase");
var capital = document.getElementById("Uppercase");
var number = document.getElementById("Number");
var length = document.getElementById("Length");



var lowerCaseLetters = /[a-z]/g; // regular experssion for lowerCaseLetters
var upperCaseLetters = /[A-Z]/g; // regular experssion for upperCaseLetters
var numbers = /\d/g; //  regular experssion for digits
var minLength = 8; // minimum length

    if (input.value.match(lowerCaseLetters)) {
        letter.style.color = "green";
    } else {
        letter.style.color = "red";
    }

    // Validate capital letters
    if (input.value.match(upperCaseLetters)) {
        capital.style.color = "green";
    } else {
        capital.style.color = "red";
    }

    // Validate numbers
    if (input.value.match(numbers)) {
        number.style.color = "green";
    } else {
        number.style.color = "red";
    }

    // Validate length
    if (input.value.length >= minLength) {
        length.style.color = "green";
    } else {
        length.style.color = "red"
    }
}

/**
 * @func changeMatchColors
 * This function will change the color of the match password field requirements while user is inputing their password
 * 
 * @page signup.html
 * 
 */
 function changeMatchColors(){
    /***Variables to change elements on signup page */
    var input = document.getElementById("password");
    var confirmInput = document.getElementById("confirmPassword");
    var pwMatched = confirmInput.value.match(input);
    var match = document.getElementById("Match");

    if(pwMatched) {
        match.style.color = "green";
    } else {
      match.style.color = "red";
    }
 }
