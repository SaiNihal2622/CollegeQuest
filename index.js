import nodemailer from "nodemailer";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = 'mongodb://0.0.0.0:27017/employee';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const conn = mongoose.connection;

conn.once('open', () => {
    console.log("Connected to database");
});

conn.on('error', (error) => {
    console.error('Error:', error.message);
    process.exit();
});

const loginSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String, // Add email to the schema
});

const LoginModel = mongoose.model('Login', loginSchema);

const app = express();
const port = 3000;

var email1;


app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/home.html");
});
app.get("/samplelogin.html", (req, res) => {
  res.sendFile(__dirname + "/samplelogin.html");
});

app.get("/samplesignup.html", (req, res) => {
  res.sendFile(__dirname + "/samplesignup.html");
});

app.post("/submit", async (req, res) => {
  const uname = req.body['Username'];
  const upassword = req.body['password'];

  try {
    const user = await LoginModel.findOne({ name: uname, password: upassword }).exec();

    if (user) {
      email1=user.email;
      console.log(email1);
      res.sendFile(__dirname + "/student_details.html");
      
    } else {
      res.sendFile(__dirname + "/samplelogin.html");
    }
  } catch (err) {
    console.error("Error querying data:", err.message);
    res.sendFile(__dirname + "/error.html");
  }
});

app.post("/create", async (req, res) => {
  console.log(req.body);
  const uemail = req.body['email'];
  email1=req.body['email'];
  const uname = req.body['Username'];
  const upassword = req.body['password'];

  try {
    const data2 = [{
      email: uemail,
      name: uname,
      password: upassword
    }];

    await LoginModel.insertMany(data2);
    console.log("Data inserted successfully");
    res.sendFile(__dirname + "/student_details.html");
  } catch (error) {
    console.error("Error inserting data:", error.message);
    res.sendFile(__dirname + "/error.html");
  }
});



// Handle form submission

const colleges = new mongoose.Schema({
  instcode: String,
  instname: String,
  place: String,
  dist: String,
  coed: String,
  type: String,
  yearofest: Number,
  branch: String,
  bname: String,
  ocboys: Number,
  ocgirls: Number,
  bcaboys: Number,
  bcagirls: Number,
  bcbboys: Number,
  bcbgirls: Number,
  bccboys: Number,
  bccgirls: Number,
  bcdboys: Number,
  bcdgirls: Number,
  bceboys: Number,
  bcegirls: Number,
  scboys: Number,
  scgirls: Number,
  stboys: Number,
  stgirls: Number,
  ewsgen: Number,
  ewsgirls: Number,
  tutionfee: Number,
  affli: String
});

// const CollegeModel = mongoose.model('colleges', colleges);


// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const CollegeModel = mongoose.model('colleges', colleges);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.post("/colleges", async (req, res) => {
  const { gender, category, rank } = req.body;
  const rankFieldData = `${category.toLowerCase()}${gender.toLowerCase()}`;

  try {
    // Retrieve all documents from the collection
    const result = await CollegeModel.find();

    // Filter the documents based on the user-specified category and threshold
    const filteredData = result.filter(item => item[rankFieldData] > rank);

    // Sort the filtered data in ascending order based on the 'rankFieldData' property
    const sortedData = filteredData.sort((a, b) => a[rankFieldData] - b[rankFieldData]);

    // Log the filtered and sorted data
    console.log(sortedData);

    // Render the "tables" view and pass the data to it
    res.render("tables", { colleges: sortedData, rankField: rankFieldData });

  } catch (error) {
    console.error("Error querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});



app.get('/pricing.html', (req, res) => {
  res.sendFile(path.join(__dirname,'pricing.html'));
});

// Handle POST request from the form
app.post('/slot', (req, res) => {
  const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"s786shoeb@gmail.com",
        pass:"uxzzvlybgtfbgqlm"
    }
});
const info={
    from:"s786shoeb@gmail.com",
    to:["mufeezrahman15@gmail.com",email1],
    subject:"Mail from College Quest",
    // text:`Date:${req.body.date}  ${req.body.month} \n Time : ${req.body.time}`
    html:`<h1>Hello,</h1><h3>Date: ${req.body.date} ${req.body.month} </h3> <h3> Time : ${req.body.time}</h3>
    <a href="https://meet.google.com/irm-yzex-owh">GoogleMeet</a>`
}


transporter.sendMail(info,(err,result)=>{
    if(err)
    {
        console.log("Error in sending Mail",err);
    }
    else{
        console.log("Email sent successfully",info);
    }
});
res.sendFile(__dirname + "/slotsuccess.html");
});


app.post('/submitMentorshipForm', (req, res) => {
  const formData = req.body;
  console.log('Received mentorship form data:', formData);

  // Perform any processing or store data as needed

  res.json({ message: 'Mentorship form data received successfully' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

