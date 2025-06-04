import cors from "cors"
import express from "express"
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

// Start defining your routes here
// Endpoints with listEndpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app)
  res.json({
    message: "Welcomen to the Happy Thoughts API",
    endpoints: endpoints
  })

})


//Show all messages first version
// Show the data in data.json
// app.get("/messages", (req, res) => {
//   res.json(data)
// })

//Show all thoughts
//Filter liked thoughts, thoughts?liked, 
//Filter thoughts from today thoughts?thoughtsfromtoday
app.get("/thoughts", (req, res) => {
  const showLiked = req.query.hasOwnProperty("liked");
  const showThoughtsFromToday = req.query.hasOwnProperty("thoughtsfromtoday")
  const today = new Date()
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const { hearts, createdAt } = req.query

  let filteredThoughts = data   
  
    if (showLiked){
      filteredThoughts = filteredThoughts.filter(thought => thought.hearts >0) 
    } 

    if (showThoughtsFromToday){
      filteredThoughts = filteredThoughts.filter(thought => {
        const createdAt = new Date(thought.createdAt)
        const thoughtsDate = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())

        return thoughtsDate.getTime() === todayDate.getTime()
      })
    }  

  if (filteredThoughts.length === 0) {
    return res.status(404).json({ error: 'There are no thoughts to show' });
  }

  res.json(filteredThoughts);
});

//Show all messages !!Is this not relevant? Should maybe be a qury param instead?!!
// app.get("/messages", (req, res) => {
//   res.json(data.map((item) => item.message))   
// })

//Show a single thought id 
app.get("/thoughts/:id", (req, res) => {

  // be aware! The id that comes from the param is of type string. and in our json it is of type number. You have to turn them into the same type before you can compare them. trun a string to a number by adding + 👇
  const thoughtID = data.find((thought) => thought._id === req.params.id)

  // tiny error handling if we get an id that doesnt exist in our data
  if (!thoughtID) {
    return res.status(404).json({ error: 'thought not found' })
  }
 
  res.json(thoughtID)
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
