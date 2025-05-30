import cors from "cors"
import express from "express"
import data from "./data.json"
import listEndpoints from "express-list-endpoints"

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

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

//Show all messages
//Filter liked messages, /messages?liked, 
//Filter messages from today /messages?messagesfromtoday
app.get("/messages", (req, res) => {
  const showLiked = req.query.hasOwnProperty("liked");
  const showMessagesFromToday = req.query.hasOwnProperty("messagesfromtoday")
  const today = new Date()
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  let filteredMessages = data   
  
    if (showLiked){
      filteredMessages = filteredMessages.filter(message => message.hearts >0) 
    } 

    if (showMessagesFromToday){
      filteredMessages = filteredMessages.filter(message => {
        const createdAt = new Date(message.createdAt)
        const messageData = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())

        return messageData.getTime() === todayDate.getTime()
      })
    }  

  if (filteredMessages.length === 0) {
    return res.status(404).json({ error: 'There are no messages to show' });
  }

  res.json(filteredMessages);
});

//Show all messages !!Is this not relevant? Should maybe be a qury param instead?!!
// app.get("/messages", (req, res) => {
//   res.json(data.map((item) => item.message))   
// })

//Show a single message id 
app.get("/messages/:id", (req, res) => {

  // be aware! The id that comes from the param is of type string. and in our json it is of type number. You have to turn them into the same type before you can compare them. trun a string to a number by adding + 👇
  const messageID = data.find((message) => message._id === req.params.id)

  // tiny error handling if we get an id that doesnt exist in our data
  if (!messageID) {
    return res.status(404).json({ error: 'message not found' })
  }
 
  res.json(messageID)
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
        <h3>GET /messages</h3>
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
        <h3>GET /messages?liked</h3>                
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
        <h3>GET /messages?messagesfromtoday</h3>                
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
        <h3>GET /messages/:id</h3>
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
