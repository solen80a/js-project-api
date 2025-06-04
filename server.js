import cors from "cors"
import express, { response } from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"

import data from "./data.json"

//To connect to the DB
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts"
mongoose.connect(mongoUrl)


// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

const thoughtSchema = new mongoose.Schema({
  message: String,
  hearts: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Thought = mongoose.model("Thought", thoughtSchema)

//RESET_DB=true npm run dev. DElete when not needed anymore.
// if(process.env.RESET_DB){
//   const seedDatabase = async () => {
//     await Thought.deleteMany({})
//     data.forEach(thought => {
//       new Thought(thought).save()
//     })
//   }
//   seedDatabase()
// }

// Start defining your routes here
// Endpoints with listEndpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app)
  res.json({
    message: "Welcomen to the Happy Thoughts API",
    endpoints: endpoints
  })

})

//Endpoint to show all thoughts
//Filter liked thoughts, thoughts?liked, 
//Filter thoughts from today thoughts?thoughtsfromtoday
app.get("/thoughts", async(req, res) => {

  const today = new Date()
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const { liked, thoughtsfromtoday } = req.query

  const query = {}  

  if (liked !== undefined){
    query.hearts = { $gt: 0 } //greater than 0    
  }

  if (thoughtsfromtoday !== undefined){  
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(todayDate.getDate() + 1);

    query.createdAt = {
      $gte: todayDate, //greater than or equal to todayDate
      $lt: tomorrowDate, //less than tomorrowDate
    };
  }
    
  try{
    const filteredThoughts = await Thought.find(query) 

    if (filteredThoughts.length === 0){
      return res.status(404).json({ error: "There are no thoughts to show" })       
    } 
    res.status(200).json({ response: filteredThoughts })   

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch thoughts"})
  }    
});

//Endpoint to show a single thought id 
app.get("/thoughts/:id", async (req, res) => {
  const { id } = req.params
  try{
    const thought = await Thought.findById(id)

    if (!thought){
      return res.status(404).json({ error: "There is no thought with that id" })
    }
    res.status(200).json({ response: thought})

  } catch (error) {
    res.status(500).json({ error: "Thoughts not found"})
  }
 
})


//Nicer documentation including queries
app.get("/documentation", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Happy Thoughts API</title>
             <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #f0f8ff;
         
        }
        h1 {
          color: #2c3e50;
        }
        code {
          background: #eee;
          padding: 2px 4px;
          border-radius: 4px;
        }
        section {
          margin-bottom: 20px;        
        }
      </style>
      </head>
      <body>
        <h1>Welcome to Happy Thoughts API</h1>
        
        <p>This is the documentation of Happy thoughts API.</p>
        <section>
        <h2>Endpoints:</h2>
        <h3>GET /thoughts</h3>
        <p>Returns a list of all happy thoughts.</p>
        <h4>Response:</h4>
        <pre><code>
        [
          {
             "_id": "682c6f0e951f7a0017130022",
            "message": "Cute monkeys🐒",
            "hearts": 2,
            "createdAt": "2025-05-20T12:01:18.308Z",
            "__v": 0
          },
          ...
        ]
        </code></pre>
        <h3>GET /thoughts?liked</h3>                
        <p>Returns a list of all happy thoughts with likes, >0.</p>
        <h4>Response:</h4>
        <pre><code>
        [
          {
             "_id": "682c6f0e951f7a0017130022",
            "message": "Cute monkeys🐒",
            "hearts": 2,
            "createdAt": "2025-05-20T12:01:18.308Z",
            "__v": 0
          },
          ...
        ]
        </code></pre>
        <h3>GET /thoughts?messagesfromtoday</h3>                
        <p>Returns a list of all happy thoughts from today .</p>
        <h4>Response:</h4>
        <pre><code>
        [
          {
             "_id": "682c6f0e951f7a0017130022",
            "message": "Cute monkeys🐒",
            "hearts": 2,
            "createdAt": "2025-05-20T12:01:18.308Z",
            "__v": 0
          },
          ...
        ]
        </code></pre> 
        <h3>GET /thoughts/:id</h3>
        <p>Returns a specific happy thought by id.</p>
        <h4>Response:</h4>
        <pre><code>
        [
          {
             "_id": "682c6f0e951f7a0017130022",
            "message": "Cute monkeys🐒",
            "hearts": 2,
            "createdAt": "2025-05-20T12:01:18.308Z",
            "__v": 0
          }
        ]        
        </section>
        
      </body>
    </html>
    `)
  
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
