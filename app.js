import express from "express";
import axios from "axios"; 
import dotenv from 'dotenv';

//Load environment variables from the .env file
dotenv.config();
// Create an express app and set the port number
const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Use the public folder for static files for css
app.use(express.static("public"));

// Define your OpenWeatherMap API key and URL

const apiKey = process.env.OPENWEATHER_API_KEY;
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

app.get("/", async (req, res) => {
  let city = req.query.city || "London";
  let weatherData = null;
  let errorMessage = null;

  //Check for missing API key
  if (!apiKey) {
    return res.render("index", {
      weatherData: null,
      city,
      errorMessage: "API key is missing. Please set it in the .env file"
    });
  }

   try {
        const response = await axios.get(`${apiURL}${city}&appid=${apiKey}`);
        weatherData = response.data;
    } catch (error) {
      //Hnalde specific errors
      if (error.response){
        if (error.repsonse.status === 404){
          errorMessage = `City ${city} not found. Pease check the name.`;
        }
      }else if (error.repsonse.status ===401){
        errorMessage = "Invalid API key.";
      }else {
        errorMessage = "Network error or server unreachable.";
      }
     console.log("API Error:", error.repsonse?.data || error.message);
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