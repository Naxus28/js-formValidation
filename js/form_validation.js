// p.validation_feedback needs to be a sibling of the form element being validated for this functionality to work
(function() {
	var formElements = Array.from(document.getElementsByClassName('form_element')); // Array.from creates an array from the HTML nodes -- allows to use array methods on node collections
	var regExForEmail = /^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$/;
	var regExForNames = /^[a-zA-Z ,.-]*$/;
	var submitButton = document.getElementById('submit_button');
	
	// validation convenience methods
	var addEventListenerToFormElement,
			getEventListenerDependencies,
			inputListenerCallBack,
			isFormValidForSubmission,
			selectListenerCallBack,
			toggleEnableDisableSubmitButton,
			toggleValidationClassesForUIFeedback;

	addEventListenerToFormElement = function(formElement, elementTagName, regExForType) {
		var eventListenerDependencies = getEventListenerDependencies(elementTagName, formElement, regExForType);
		// add event listener and callBack function dinamically
		formElement.addEventListener(eventListenerDependencies.event, function(e) {
			eventListenerDependencies.callbackFunction(eventListenerDependencies.functionArguments);
		});
	}

	getEventListenerDependencies = function(elementTagName, formElement, regExForType) {
		var eventListenerDependencies;
		
		switch(elementTagName) {
			case 'SELECT':
				eventListenerDependencies = {
					event: 'change',
					callbackFunction: selectListenerCallBack,
					functionArguments: {}
				}
				break;
			default:
				eventListenerDependencies = {
					event: 'keyup',
					callbackFunction: inputListenerCallBack,
					functionArguments: {inputNode: formElement, regExForType: regExForType}
				}
				break;
		}
		return eventListenerDependencies;
	}

	inputListenerCallBack = function(arguments) {
		var parentNode = arguments.inputNode.parentNode; 
		var validationFeedbackParagraph = parentNode.querySelector('.validation_feedback'); 
		toggleValidationClassesForUIFeedback(arguments.inputNode, arguments.inputNode.value, arguments.regExForType, validationFeedbackParagraph);
	}

	selectListenerCallBack = function() {
		toggleEnableDisableSubmitButton();
	}

	isFormValidForSubmission = function() {
		var validFormElementsCount = formElements.filter(function(formElement) {
			return !formElement.classList.contains('input_error') && formElement.value;
		})
		.length;

		return validFormElementsCount === formElements.length;
	}

	toggleEnableDisableSubmitButton = function() {
		if(isFormValidForSubmission()) {
			submitButton.removeAttribute('disabled');
		} else {
			submitButton.setAttribute('disabled', 'disabled');
		};
	}

	toggleValidationClassesForUIFeedback = function(inputNode, nodeValue, regExForType, validationFeedbackParagraph) {
		var inputClasses = inputNode.classList;
		var toggleErrorClass = !regExForType.test(nodeValue);
		
		inputClasses.toggle('input_error', toggleErrorClass);

		// not displaying UI feedback on email field because we would need to have the whole pattern before validating
    // could add an onblur event if needed 
		if (inputNode.getAttribute('type') !== 'email') {
			inputClasses.toggle('warning_border', toggleErrorClass);
			validationFeedbackParagraph.classList.toggle('display_validation_feedback', toggleErrorClass);
		}
		// after toggling '.input_error' validation class, check if button should be enabled or disabled
		toggleEnableDisableSubmitButton();
	}

	/* ===========ENTRY POINT LOOP===========
	loop over form fields and add event listener to them */
	formElements.forEach(function(formElement) {
		var regExForType = formElement.getAttribute('type') === 'email'
												? regExForEmail
												: regExForNames;
		var elementTagName = formElement.tagName;

		addEventListenerToFormElement(formElement, elementTagName, regExForType);
	});
})();





