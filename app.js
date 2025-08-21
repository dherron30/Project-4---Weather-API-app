import express from "express";
import axios from "axios";


// Create an express app and set the port number
const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Use the public folder for static files for css
app.use(express.static("public"));

// Define your OpenWeatherMap API key and URL

const apiKey = "301815d01a86a6b7ba2eb3f06b1a2447";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

app.get("/", async (req, res) => {
  let city = req.query.city || "London";
  let weatherData = null;
  let errorMessage = null;

  try {
    const response = await axios.get(`${apiURL}${city}&appid=${apiKey}`);
    weatherData = response.data;
  } catch (error) {
    errorMessage = "Couldn't fetch weather data. Please check the city name.";
    console.error(error.response?.data || error.message);
  }

  res.render("index", {
    weatherData,
    city,
    errorMessage
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});