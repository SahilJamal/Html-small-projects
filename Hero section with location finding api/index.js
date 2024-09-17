document.addEventListener("DOMContentLoaded", () => {
  const locationIcon = document.getElementById("location-icon");
  const locationText = document.getElementById("location-text");

  // When SVG is clicked, get the user's location
  locationIcon.addEventListener("click", () => {
    // Check if Geolocation is supported
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Use Nominatim API to get location name
          const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

          fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
              if (data && data.display_name) {
                const formattedAddress = data.display_name;
                locationText.innerHTML = formattedAddress; // Update the location text
              } else {
                locationText.innerHTML = "Location not found.";
              }
            })
            .catch((error) => {
              console.error("Error fetching location:", error);
              locationText.innerHTML = "Unable to retrieve location.";
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          locationText.innerHTML = "Unable to retrieve location.";
        }
      );
    } else {
      locationText.innerHTML = "Geolocation is not supported by this browser.";
    }
  });

  const searchInput = document.getElementById("search-input");
  const placeholder = document.querySelector(".placeholder");

  if (!searchInput || !placeholder) {
    console.error("Required elements are missing.");
  } else {
    const placeholders = [
      "Treasures",
      "Essentials",
      "Delights",
      "Finds",
      "Discoveries",
      "Bargains",
      "Wonders",
      "Goodies",
      "Trendy",
      "Favorites",
      "Satisfaction",
      "Value",
      "Curiosities",
      "Whimsy",
      "Charming",
      "Everyday",
      "Convenience",
      "Selection",
      "Joyful",
      "Explore",
    ];

    let index = 0;
    let intervalId; // Variable to hold the interval ID

    function changePlaceholder() {
      const currentPlaceholder = document.querySelector(".placeholder");
      if (!currentPlaceholder) {
        console.error("Current placeholder is missing.");
        return;
      }

      const nextPlaceholder = document.createElement("span");
      nextPlaceholder.className = "placeholder next";
      nextPlaceholder.textContent =
        placeholders[(index + 1) % placeholders.length];

      // Insert the new placeholder after the current one fades out
      const parent = searchInput.parentNode;
      if (parent) {
        parent.insertBefore(nextPlaceholder, searchInput);

        // Start the fade-in effect for the new placeholder
        nextPlaceholder.style.opacity = "0"; // Start with opacity 0
        setTimeout(() => {
          nextPlaceholder.style.opacity = "1"; // Fade in
        }, 50); // Slight delay to ensure the next placeholder is displayed

        // Move the current placeholder up and remove it
        currentPlaceholder.classList.add("up"); // Move current placeholder up
        setTimeout(() => {
          currentPlaceholder.remove(); // Remove the current placeholder after the animation
        }, 300); // Match the duration of the transition

        // Update the index
        index = (index + 1) % placeholders.length;
      } else {
        console.error("Parent node is missing.");
      }
    }

    // Function to start the placeholder animation
    function startPlaceholderAnimation() {
      intervalId = setInterval(changePlaceholder, 4000); // Change every 4 seconds
    }

    // Event listener to stop animation and clear placeholder text on focus
    searchInput.addEventListener("focus", () => {
      clearInterval(intervalId); // Stop the animation
      placeholder.textContent = ""; // Clear the placeholder text

      // Remove the existing placeholder span
      const currentPlaceholder = document.querySelector(".placeholder");
      if (currentPlaceholder) {
        currentPlaceholder.remove(); // Remove the current placeholder on focus
      }
    });

    // Event listener to restart animation on input blur
    searchInput.addEventListener("blur", () => {
      // Check if the input field is empty
      if (searchInput.value.trim() === "") {
        // Restore the current placeholder text
        const currentPlaceholder = document.createElement("span");
        currentPlaceholder.className = "placeholder";
        currentPlaceholder.textContent = placeholders[index];
        const parent = searchInput.parentNode;
        if (parent) {
          parent.insertBefore(currentPlaceholder, searchInput); // Add the placeholder back
        }
        startPlaceholderAnimation(); // Restart the animation
      }
    });

    // Initial setup
    placeholder.textContent = placeholders[index];

    // Start the animation
    startPlaceholderAnimation();
  }
});
