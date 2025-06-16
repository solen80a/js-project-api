import bcrypt from "bcrypt"
import cors from "cors"
import dotenv from "dotenv"
import express, { response } from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"

import data from "./data.json"
import { authenticateUser } from "./middleware/authMiddleware"
import { Thought } from "./models/thought"
import { User } from "./models/user"
import { postUser } from "./utils/postUser"

dotenv.config()

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

//GET
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
      .sort({ createdAt: "desc" })
      .populate("user", "_id") 

    if (filteredThoughts.length === 0){
      return res.status(404).json({ error: "There are no thoughts to show" })       
    } 
    res.status(200).json(filteredThoughts)   

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
    res.status(500).json({ error: "Failed to fetch thoughts"})
  }
 
})

//POST
app.post("/thoughts", authenticateUser, async(req, res) => {
  const { message } = req.body

  try {
    const newThought = await new Thought({ 
      message,
      user: req.user._id 
    }).save()

    res.status(201).json({ response: newThought })

  } catch (error) {    
    res.status(500).json({ error: "Thought could not be created"})
  }
})

app.post("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    const newThoughtLike = await Thought.findByIdAndUpdate(
      id,
      { $inc: { hearts: 1 } },
      { new: true } // return the updated document
    );

    if (!newThoughtLike) {
      return res.status(404).json({ error: "Thought not found, could not update" });
    }
    res.status(200).json({ 
      message: `Thought with message: ${newThoughtLike.message}, was liked.`,
      hearts: newThoughtLike.hearts,
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch thoughts" });
  }
});


//DELETE
app.delete("/thoughts/:id", authenticateUser, async(req, res) => {
  const { id } = req.params

  try{
    const thought = await Thought.findByIdAndDelete(id)

    if (!thought) {
      return res.status(404).json({ error: "Thought id was not found, could not deleted" })
    }

    if(!thought.user.equals(req.user._id)){
      return res.status(403).json({ error: "Not authorized to delete this thought" })
    }

    await thought.deleteOne()
    res.status(200).json({message: `Thought with message: ${thought.message}, was deleted`})
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch thoughts"})
  }
})

//PATCH
//Endpoint /thoughts/:id, json body {"newThoughtMessage": "edited message"}
app.patch("/thoughts/:id", authenticateUser, async(req, res) => {
  const { id } = req.params
  const { newThoughtMessage } = req.body

  try{
    const thought = await Thought.findByIdAndUpdate(id, { message: newThoughtMessage }, { new: true , runValidators: true })

    if(!thought){
      return res.status(404).json({ error: "Thought id was not found, could not update" })
    }

    if(!thought.user.equals(req.user._id)) {
      return res.status(403).json({ error: "Not authorized to edit this thought" })
    }
    res.status(200).json({ message: `Thought was updated to: ${newThoughtMessage}`})

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch thoughts"})
  }
})

app.get("/users", async (req, res) => {
  const { email } = req.params  

  try {
    const user = await User.find(email)

    if (!user) {
      return res.status(404).json({
        success: false,
        response: null,
        message: "No users found"
      })
    }

    res.status(200).json({
      success: true,
      response: user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to fetch users"
    })
  }
})

app.post("/users", postUser)

app.get("/secrets", authenticateUser)

//Signin endpoint
app.post("/sessions", async (req, res) => {
  const user = await User.findOne({email: req.body.email})

  if(user && bcrypt.compareSync(req.body.password, user.password)){
    res.json({userId: user._id, accessToken: user.accessToken})
  } else {
    res.json({notFound: true})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
