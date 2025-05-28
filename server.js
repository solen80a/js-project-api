import cors from "cors"
import express from "express"
import data from "./data.json"

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Happy Thoughts API</title>
      </head>
      <body>
        <h1>Welcome to the Happy Thoughts API</h1>
        <p>This is the documentation page.</p>
        <h2>Endpoints:</h2>
        <h3></h3>
        <p>/messages</p>
        <p>/messages&liked</p>
        <p>/messages</p>
      </body>
    </html>
    `)
  
})

//Show all messages first version
// Show the data in data.json
// app.get("/messages", (req, res) => {
//   res.json(data)
// })

//Show all messages
//Filter liked messages, /messages&liked
app.get("/messages", (req, res) => {
  const showLiked = req.query.hasOwnProperty("liked");

  const filteredMessages = showLiked
    ? data.filter(item => Number(item.hearts) > 0)
    : data;

  if (filteredMessages.length === 0) {
    return res.status(404).json({ error: 'There are no liked messages to show' });
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



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
