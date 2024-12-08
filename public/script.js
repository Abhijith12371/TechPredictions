const GEMINI_API_KEY = "AIzaSyAGIPnMhy9VFh069KCggV-iT4axekv9ZzU"; // Replace with your Gemini API key

const fetchPredictions = async (topic) => {
  const url = "https://generativeai.googleapis.com/v1beta2/models/gemini-1.5-flash:generateText";
  
  const requestBody = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    prompt: `Provide detailed statistics and predictions for ${topic}.`,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GEMINI_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch predictions");
  }

  const data = await response.json();
  return data.candidates[0].output;
};

document.getElementById("fetch-predictions").addEventListener("click", async () => {
  const techInput = document.getElementById("tech-input").value.trim();
  const predictionsContainer = document.getElementById("predictions-container");
  const resultsSection = document.getElementById("results");

  if (!techInput) {
    alert("Please enter a technology!");
    return;
  }

  try {
    predictionsContainer.textContent = "Loading predictions...";
    resultsSection.classList.remove("hidden");

    const predictions = await fetchPredictions(techInput);
    predictionsContainer.textContent = predictions;
  } catch (error) {
    predictionsContainer.textContent = "An error occurred while fetching predictions.";
    console.error(error);
  }
});
