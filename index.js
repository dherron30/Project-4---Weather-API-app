import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const host = "0.0.0.0"; // Required for Render

//  Middleware
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//In-memory data store
let posts = [
    {
        id: 1,
        title:"From Phonics to Ferries: Living and Teaching in Hong Kong",
        content: 
          "During my TEFL experience in Hong Kong, I had the opportunity to teach children aged 3 to 12, focusing on phonics, grammar, and Cambridge English preparation. It was incredibly rewarding to see my students grow in confidence and ability. Outside the classroom, I made the most of living in such a vibrant city—exploring bustling markets, sampling delicious street food, and discovering hidden beaches and nearby islands on weekends. Evenings were often spent enjoying dinner with colleagues, trying everything from dim sum to fresh seafood, and soaking up the energy of Hong Kongs nightlife. It was an unforgettable mix of professional growth and cultural adventure.",
        author: "Danielle Herron",
        date: "11/08/2025",

    },
    {
         id: 2,
        title:"Teaching, Temples, and Tranquility: A Hanoi Experience",
        content: 
         "During my TEFL experience in Hanoi, Vietnam, I had the chance to collaborate closely with colleagues, fostering a supportive environment where we shared ideas and embraced creativity—especially in developing game-based learning activities to keep students engaged. The pandemic introduced hybrid teaching, which pushed me to adapt and innovate even further. Before COVID, I built strong relationships with both students and fellow teachers, creating a positive classroom atmosphere and a sense of community at work. I also took my professional development seriously, attending monthly in-person workshops and participating in regular webinars to strengthen my pedagogy.Outside of work, life in Hanoi was vibrant and fulfilling—I often went out for dinners with colleagues and friends, explored the city's rich café culture, and stayed active through yoga and gym sessions. I even took up painting classes as a creative outlet. I also started to learn Vietnamese in my free time which helped me gain a deeper understading of the vibrant culture and empathy of the struggles faced learning a language. One of the most memorable experiences was a peaceful yoga retreat by a serene lake about three hours outside of Hanoi. The food there was incredible—fresh, nourishing meals made with ingredients grown right on the land. I still dream about the handmade bao bun I had there—it was honestly one of the most delicious things I have ever eaten.",
        author: "Danielle Herron",
        date: "11/08/2025",

    },
    {
         id: 3,
        title:"Sunsets, Grammar, and Game-Based Learning — Teaching English in Madrid",
        content: 
         "There is something about Madrid in the early morning—the soft golden light pouring onto terracotta rooftops, the cafés just opening their shutters, and the quiet hum of the city stretching itself awake. It’s in that calm I usually found myself sipping a cortado before heading to class, mentally switching gears between lesson plans for six-year-olds and IELTS prep for adults.Teaching in Madrid has been a beautifully chaotic balance of structure and creativity. My week was a mosaic of age groups—from playful kids just learning the ropes of English, to sharp, motivated teens, and adults working toward their IELTS goals. Each group came with its own rhythm, challenges, and moments of magic.With the younger learners, the classroom was alive with color, laughter, and movement. Game-based learning was at the heart of our sessions—whether it was scavenger hunts to practice prepositions, or card games that made grammar drills fun. For teens, it was about building real-world communication skills, weaving in grammar naturally through debates, role-plays, and project-based learning. Adults brought a different energy—focused, inquisitive, and goal-oriented. Preparing them for the IELTS exam meant fine-tuning their grammar, sharpening their writing, and helping them find confidence in their speaking skills.But teaching in Madrid was not just about the classroom. It was about life happening all around it—impromptu tapas after work with fellow teachers, sharing laughs and lesson ideas over patatas bravas and vermouth. It was the sound of Spanish guitar in the metro, the weekend escapes to nearby towns, and the long walks through Retiro Park as I mapped out the next week’s lesson flow in my mind.Madrid offered more than a job—it offered rhythm, warmth, and inspiration. Teaching here was more than just a profession; it was an experience stitched together by connection, culture, and the joy of watching language unlock confidence in students of all ages. ",
        author: "Joe Blogs",
        date: "08/08/2025",

    },
    {
         id: 4,
        title:"From Games to Growth – Teaching and Living in Shanghai",
        content: 
         "Teaching in Shanghai has been one of the most rewarding chapters of my life. In the classroom, I focused on teaching grammar and vocabulary through game-based learning—turning traditional lessons into fun, interactive experiences. Watching my students laugh, engage, and gradually grow more confident in their English abilities was incredibly fulfilling. It wasn’t just about learning words; it was about watching them come alive with curiosity and self-assurance.Outside of the classroom, I decided to take Mandarin classes, which gave me a whole new perspective. Struggling with tones and characters gave me deep empathy for my students—I understood firsthand how intimidating language learning could be. That experience reshaped how I taught, with more patience, creativity, and encouragement.Life in Shanghai was vibrant and full. I joined a run club that kept me active and helped me meet locals and expats alike. Evenings were often spent out with colleagues, sharing hot pot or dumplings and swapping teaching stories. On weekends, I explored the countryside, famous landmarks, and bustling local markets—each corner of China offering something entirely new.From the classroom to the city streets, Shanghai pushed me to grow, connect, and see the world—and language—through fresh eyes.",
        author: "Maria Lexie Gomez",
        date: "01/08/2022",
    },
];

let lastId = posts.length;

// New root for root
app.get("/", (req, res) => {
  res.redirect("/posts");
  // or: res.json({ message: "Welcome to API", endpoints: ["/posts", "/posts/:id"] });
});

app.get("/health", (req, res) => {
  res.status(200).send("API is healthy 🚀");
});

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the TEFL Experience API!",
    endpoints: ["/posts", "/posts/:id", "/posts (POST)", "/posts/:id (PATCH/DELETE)"],
  });
});


// GET all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// GET specific post
app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// POST new
app.post("/posts", (req, res) => {
  const newId = ++lastId;
  const post = {
    id: newId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date().toISOString().split("T")[0],

  };
  posts.push(post);
  res.status(201).json(post);
});

//PATCH a post when you just want to update one section e.g.title
app.patch("/posts/:id", (req, res) => {
    const post = posts.find((p) => p.id === parseInt(req.params.id));
    if(! post) return res.status(404).json({message: "Post not found"});

    if(req.body.title) post.title = req.body.title;
    if(req.body.content) post.content = req.body.content;
    if (req.body.author) post.author = req.body.author;

    res.json(post);
});

//DELETE a specific post by providing the post id.
app.delete("/posts/:id", (req,res) =>{
    const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
    if(index === -1) 
        return res.status(404).json({message: "Post not found"});

    posts.splice(index, 1);
    res.json({message: "Success: Post has been deleted!"});
});

// Listen on the port Render provides and host 0.0.0.0

app.listen(port, host, () => {
  console.log(`API server running on port ${port}`);

});





