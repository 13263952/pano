// JavaScript code for handling popups and interactions
function openPopup(popupId) {
    var popup = document.getElementById(popupId);
    popup.style.display = "block";
}

function closePopup(popupId) {
    var popup = document.getElementById(popupId);
    popup.style.display = "none";
}

function resetInputFields() {
    var inputFields = document.querySelectorAll("input[type='text']");
    inputFields.forEach(function (input) {
        input.value = ""; // Clear the input field
    });
}

function resetImages() {
    // Ask for confirmation before resetting images
    var confirmReset = confirm("Are you sure you want to reset the images and go back?");
    
    if (confirmReset) {
        // Add logic to reset images here
        // For example, you can redirect to the main page
        window.location.href = "/";
        // Reset input fields
        resetInputFields();
    }
}

function reloadImages() {
    // Reload the page to fetch new images
    window.location.reload();
}

async function saveDescription(descriptionButton, imageContainer) {
    return new Promise((resolve, reject) => {
        const formData = new FormData(descriptionButton.form);
        fetch('/save_descriptions', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); // For debugging
            resolve();
        })
        .catch(error => {
            console.error(error);
            reject(error);
        })
        .then(() => {
            // Clear the input field
            // descriptionButton.form.querySelector("input[type='text']").value = "";
            // Reload the images container to fetch new images
            reloadImages(); // Trigger reloadImages function here
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    var logAllButton = document.getElementById("log-all-button");
    logAllButton.addEventListener("click", async function () {
        var descriptionButtons = document.querySelectorAll(".submit-button");

        // Ask for confirmation before logging all descriptions
        var confirmLogAll = confirm("Are you sure you want to log all descriptions?");
        
        if (confirmLogAll) {
            for (const button of descriptionButtons) {
                await saveDescription(button, button.closest(".image-card").parentElement);
            }

            openPopup("success-popup");

            // Reset input fields after successful logging
            resetInputFields();
        }
    });

    // Wrap the event listener code in a function
function attachEventListeners() {
    // Add click event for "Save Descriptions" buttons
    var saveButtons = document.querySelectorAll(".submit-button");
    saveButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            saveDescription(button, button.closest(".image-card").parentElement);
            return false; // Prevent form submission
        });
    });
}

// Attach event listeners when the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    attachEventListeners(); // Call the function to attach listeners
});

});
