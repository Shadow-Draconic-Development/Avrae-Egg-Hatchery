document.addEventListener("DOMContentLoaded", () => {
    let container = document.getElementById("container");
    let jsonOutput = document.getElementById("jsonOutput");
    let modeDropdown = document.getElementById("modeDropdown");
    let checksSection = document.getElementById("checksSection");
    let timeInput = document.getElementById("timeInput");
    let imageUrlsSection = document.getElementById("imageUrlsSection");
    let toggleThemeButton = document.getElementById("toggleTheme");
    let eggLimitSection = document.getElementById("eggLimitSection");
    let reliableTalent = document.getElementById("reliableTalent");

    // Function to apply dark mode
    const applyDarkMode = (isDark) => {
        document.body.classList.toggle("dark-mode", isDark);
        toggleThemeButton.textContent = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    };

    // Check system preferences for dark mode
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    applyDarkMode(prefersDarkMode.matches);

    // Listen for changes in system preferences
    prefersDarkMode.addEventListener("change", (event) => {
        applyDarkMode(event.matches);
    });

    // Toggle dark mode manually
    toggleThemeButton.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-mode");
        toggleThemeButton.textContent = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    });

    // Generate JSON function (unformatted and single-quoted)
    const generateJSON = () => {
        let jsonData = {};

        // Add selected mode to the JSON
        const selectedMode = modeDropdown.value;
        if (selectedMode) {
            jsonData.mode = selectedMode;
        }

        const imageUrls = {};

        // Gather image URLs from dynamically added inputs
        document.querySelectorAll(".image-url").forEach(input => {
            const nameInput = input.previousElementSibling;
            const name = nameInput ? nameInput.value : "";
            const url = input.value || ""; // If empty, use empty string for URL

            // Only add if both name and URL are provided or URL is empty
            if (name || url === "") {
                imageUrls[name] = url;
            }
        });

        if (Object.keys(imageUrls).length > 0) {
            jsonData.image_urls = imageUrls;
        }

        // Gather time value (ensure it's an integer)
        const timeValue = document.getElementById("timeValue");
        if (timeValue && timeValue.value) {
            jsonData.time = parseInt(timeValue.value, 10); // Ensure it's an integer
        }

        // Gather egg limit value (ensure it's an integer and greater than 0)
        const eggLimitValue = document.getElementById("eggLimit");
        if (eggLimitValue && eggLimitValue.value) {
            const eggLimit = parseInt(eggLimitValue.value, 10);
            if (eggLimit > 0) {
                jsonData.egg_limit = eggLimit;
            }
            else if (eggLimit === -1) {
                jsonData.egg_limit = eggLimit;
            }
        }

        // Gather checks data (ensure integers where needed)
        const checksData = {};
        const checkInputs = checksSection.querySelectorAll('input, select');
        checkInputs.forEach(input => {
            const key = input.dataset.key;
            const value = input.value;

            if (key && value) {
                // Convert to integers for numeric fields
                if (key === "cooldown" || key === "num_checks" || key === "dc") {
                    checksData[key] = parseInt(value, 10);
                } else {
                    checksData[key] = value;
                }
            }
        });

        // Get the selected skill value and only add it if it's not empty
        const skillSelect = document.getElementById("skill");
        if (skillSelect) {
            const skillValue = skillSelect.value;
            if (skillValue) {
                checksData.skill = skillValue;
            }
        }

        if (Object.keys(checksData).length > 0) {
            jsonData.checks = checksData;
        }

        // Handle reliable_talent
        const reliableTalentValue = reliableTalent.value;
        if (reliableTalentValue === "true") {
            jsonData.reliable_talent = true;
        } else if (reliableTalentValue === "false") {
            jsonData.reliable_talent = false;
        }

        // Unformatted JSON with single quotes
        let unformattedJSON = JSON.stringify(jsonData);
        unformattedJSON = `'${unformattedJSON}'`;  // Surround with single quotes

        // Update the JSON output
        jsonOutput.value = unformattedJSON;
    };

    // Mode dropdown change handler
    modeDropdown.addEventListener("change", () => {
        const mode = modeDropdown.value;

        checksSection.style.display = mode === "checks" ? "block" : "none";
        timeInput.style.display = mode === "time" ? "block" : "none";

        // Clear time input if "checks" mode is selected
        if (mode === "checks") {
            const timeValue = document.getElementById("timeValue");
            if (timeValue) {
                timeValue.value = ''; // Clear the time input
            }
        }

        // Clear checks inputs if "time" mode is selected
        if (mode === "time") {
            checksSection.innerHTML = ''; // Clear the checks inputs
        }

        // Dynamically create inputs for checks if mode is "checks"
        if (mode === "checks" && checksSection.children.length === 0) {
            const fields = [
                { label: "Cooldown (in seconds)", key: "cooldown" },
                { label: "Number of Checks", key: "num_checks" },
                { label: "Skill", key: "skill", isDropdown: true },
                { label: "DC", key: "dc" }
            ];

            fields.forEach(({ label, key, isDropdown }) => {
                const inputDiv = document.createElement("div");
                if (isDropdown) {
                    inputDiv.innerHTML = `
                        <label for="${key}">${label}:</label>
                        <select id="${key}" data-key="${key}">
                            <option value="">Select Skill</option>
                            <option value="acrobatics">Acrobatics</option>
                            <option value="animalHandling">Animal Handling</option>
                            <option value="arcana">Arcana</option>
                            <option value="deception">Deception</option>
                            <option value="history">History</option>
                            <option value="insight">Insight</option>
                            <option value="investigation">Investigation</option>
                            <option value="medicine">Medicine</option>
                            <option value="nature">Nature</option>
                            <option value="perception">Perception</option>
                            <option value="performance">Performance</option>
                            <option value="persuasion">Persuasion</option>
                            <option value="religion">Religion</option>
                            <option value="sleightOfHand">Sleight of Hand</option>
                            <option value="stealth">Stealth</option>
                            <option value="survival">Survival</option>
                            <option value="strength">Strength</option>
                            <option value="dexterity">Dexterity</option>
                            <option value="constitution">Constitution</option>
                            <option value="intelligence">Intelligence</option>
                            <option value="wisdom">Wisdom</option>
                            <option value="charisma">Charisma</option>
                        </select>
                    `;
                    // Add event listener to the skill dropdown to trigger JSON update
                    inputDiv.querySelector('select').addEventListener("change", generateJSON);
                } else {
                    inputDiv.innerHTML = `
                        <label for="${key}">${label}:</label>
                        <input type="number" id="${key}" data-key="${key}" placeholder="Enter ${label}">
                    `;
                }
                checksSection.appendChild(inputDiv);
            });
        }

        // Trigger JSON generation after mode change
        generateJSON();
    });

    // Add event listeners to inputs
    container.addEventListener("input", generateJSON);

    // Add event listener for adding new image URL input
    const addButton = document.getElementById("addImageUrlButton");
    addButton.addEventListener("click", () => {
        const inputDiv = document.createElement("div");
        inputDiv.classList.add("image-input-wrapper");
        inputDiv.innerHTML = `
            <input type="text" class="image-name" placeholder="Enter Image Name">
            <input type="text" class="image-url" placeholder="Enter Image URL">
            <button class="remove-image-url">Remove</button>
        `;
        imageUrlsSection.appendChild(inputDiv);
        generateJSON();
    });

    // Add event listener for removing the last image URL input (individual buttons will handle removal)
    container.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-image-url")) {
            const inputDiv = event.target.closest(".image-input-wrapper");
            if (inputDiv) {
                inputDiv.remove();
                generateJSON();
            }
        }
    });

    // Add to clipboard functionality
    const clipboardButton = document.getElementById("copyToClipboardButton");
    clipboardButton.addEventListener("click", () => {
        const textToCopy = jsonOutput.value;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert("JSON copied to clipboard!");
            })
            .catch(err => {
                alert("Failed to copy text: " + err);
            });
    });

    // Initial JSON generation
    generateJSON();

    const imageNames = ["canvas1", "canvas2", "glass1", "glass2", "glass3", "metal1", "metal2", "metal3", "metal4"];

    function replaceImage() {
        const randomImage = imageNames[Math.floor(Math.random() * imageNames.length)];

        // Get the image element
        const imgElement = document.querySelector("img[alt='Logo']");

        if (imgElement) {
            imgElement.src = `Data/images/${randomImage}.png`;
        }
    }

    replaceImage();
});