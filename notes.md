W1:
[x] Your API should have at least three (for now) routes. Try to push yourself to do more, though!
  [x] The endpoint "/" should return documentation of your API using e.g. Express List Endpoints
  [x] A minimum of one endpoint to return a collection of results (an array of elements).
  [x] A minimum of one endpoint to return a single result (single element).
[x] Your API should be RESTful
[x] You should follow the guidelines on how to write clean code.

W2:
[X] Your API should use Mongoose models to model your data and use these models to fetch data from the database.
[x] Your API should validate user input and return appropriate errors if the input is invalid.
[x] You should implement error handling for all your routes, with proper response statuses.
[] Your frontend should be updated with the possibility to Update and Delete a thought.
  [] Update
  [x] Delete
[] Deployed backend API with deployed DB
[x] Posibility to: 
  [x] POST 
  [x] PATCH 
  [x] DELETE
[x] Frontend posibility to POST (to your API)

W3:
[] Signup and Login existing Happy Thoughts
[] Your API should have routes to register and log in
[] Your endpoints to Create, Update and Delete should be authenticated
[] Your frontend should have a registration form which POSTs to the API to create a new user.
[] Your frontend should have a login form to authenticate the user.
[] Your passwords in the database should be encrypted with bcrypt.
[] You should implement error handling. Your API should let the user know if something went wrong. Be as specific as possible to help the user, e.g. by validating the user input when creating a new user, and return "That email address already exists". Include correct status codes. Error messages should also be shown on the frontend.
[] The validation should ensure unique email addresses and/or usernames, depending on how you'd like to structure your User model.


Requirements:
[] Your API must have at least the following routes. Try to push yourself to do more, though! Endpoints for:
  [] Documentation of your API using e.g. Express List Endpoints
  [] Reading thoughts
  [] Reading a single thought
  [] Liking a thought
  [] Creating a thought (authenticated)
  [] Updating a thought (authenticated)
  [] Deleting a thought (authenticated)
  [] Signing up
  [] Logging in 
[] Your API should be RESTful
[] You should follow the guidelines on how to write clean code
[] Your API should use Mongoose models to model your data and use these models to fetch data from the database.
[] Your API should validate user input and return appropriate errors if the input is invalid.
[] The validation should ensure unique email addresses and/or usernames depending on how you'd like to structure your User model.
[] You should implement error handling for all your routes, with proper response statuses.
[] Your frontend should be updated with the possibility to Update and Delete a thought, as well as signing up and logging in and some error handling if something goes wrong.
[] Your passwords in the database should be encrypted with bcrypt.
[] Your API should be deployed to Render or similar.
[] Everything in your backend should be reflected in your frontend.

Stretch goal options:
[] Allow anonymous (not-logged-in) users to post thoughts
[] As a logged-in user, you should be able to see a list of the thoughts that you've liked.
[] Give the thoughts a category or tags. So you could organise them. For example, 'Food thoughts', 'Project thoughts', 'Home thoughts', etc.
[] Add filtering and sorting options to the endpoint which returns all thoughts. Examples:
  [] Sorting on date or number of likes
  [] Filtering to only see thoughts with more than x hearts, thoughts newer than x date or thoughts in a specific category (if you implemented categories)
[] Implement pagination in your backend & frontend so you can click through pages of thoughts. The frontend could request a specific page and show only that page. The backend would     take the request for that page and return only the thoughts for that page.
[] You could also experiment with implementing infinite scrolling on the frontend rather than having a list of page numbers. This idea is similar to paging and involves frontend & backend changes.
[] When registering, display error messages from the API in the frontend, next to the field which has the error. For example, if the email address is invalid, show an error message next to the email input.
[] In the frontend, store the token in localStorage and send it in headers to persist the logged-in state for the user.
[] Validate the email address format using a regular expression.