# BackEnd heroku link: https://unc-eats-back.herokuapp.com/

## Method 

POST | DELETE | GET

### example: 
used a get method to see current locations that were added to the app
this can be seen on the landing page or in the start page when a user signs in 

The front end looks like this: 
fetch('https://unc-eats-back.herokuapp.com/resturant/all') 

It then connects to the corresponding backend route: 

router.get('/all',cors(),(req, res) => {
   console.log('all resturants'); //this is just testing if the get method works
   Resturant
   .find()
   ### success result: locations are rendered
   ### error message: 500 Internal server error
   
### The start page includes a DELETE method to delete locations listed 

fetch('https://unc-eats-back.herokuapp.com/resturant/one/' + event.currentTarget.value +'/' +  localStorage.getItem('token'), {
            method: 'Delete',
            headers: {
                'Content-Type':'application/json'
                
the backend route looks for the particular location that is selected and will use the delete method

success result will delete the location

error: will not delete 

### POST method. When the resturant form is submitted a new location is created
front end: fetch('https://unc-eats-back.herokuapp.com/resturant/new/'
backend: router.post('/new/:token', cors(),(req, res) => {  
Sucess: new location is created 
error message: const message = `Missing ${field} in request body`
            console.error(message);
            return res.status(400).send(message);
### POST method when a new user register, they are saved in the DB

frontend: fetch('https://unc-eats-back.herokuapp.com/user/new')
backend:router.post('/new', cors(corsOptions), (req, res) 
  success: a new user will be created
  error: an error message will appear if a required field is missing
  const message = `Missing ${field} in request body` it will be error 400

  
  const message = `Missing ${field} in request body`
  
### POST method. when a registered user signs in they are taken to the start page
frontend: fetch('https://unc-eats-back.herokuapp.com/user/login',
backend: router.post('/login',cors(),(req,res
  success: user will be able to sign in and be directed to the start page
  error: if the user information does not exist in the database, a 400 error message will appear stating that the user does exist.
