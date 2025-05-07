const { MongoClient, Int32, ObjectId } = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");

const multer = require("multer");
const path = require("path");

const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const username = req.body.username || "user";
    const title = req.body.title || "gig";
    const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "_");
    const safeUsername = username.replace(/[^a-zA-Z0-9]/g, "_");
    const fileExt = path.extname(file.originalname);
    cb(null, `${safeUsername}_${safeTitle}_${Date.now()}${fileExt}`);
  },
});

const upload = multer({ storage: storage });

var db;
const uri = "mongodb://127.0.0.1:27017/";

MongoClient.connect(uri)
  .then((client) => {
    db = client.db("progig");
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error");
  });

app.post("/CreateGig", upload.single("image"), async (req, res) => {
  try {
    const { username, email, title, category, duration, price, description } =
      req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await db.collection("gigs").insertOne({
      username,
      email,
      title,
      category,
      duration,
      price: parseInt(price),
      description,
      image: imagePath,
      createdAt: new Date(),
    });

    res.json({ message: "success" });
  } catch (error) {
    console.error("Error saving gig:", error);
    res.status(500).json({ message: "error" });
  }
});

app.post('/UpdateGig', async(req, res) => {

  try {
    const { username, email, title, category, duration, price, description } =
      req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await db.collection("gigs").updateOne({
      username,
      email,
      title,
      category,
      duration,
      price: parseInt(price),
      description,
      image: imagePath,
      updatedAt: new Date(),
    });

    res.json({ message: "success"});
  } catch (error) {
    console.error("Error saving gig:", error);
    res.status(500).json({ message: "error" });
  }

});

app.post("/yourGigs", async (req, res) => {
  const { username, email } = req.body;

  const result = await db
    .collection("gigs")
    .find({ username, email })
    .toArray();

  res.json(result);
});

app.post("/allGigs", async (req, res) => {
  const result = await db.collection("gigs").find().toArray();

  res.json(result);
});

app.post("/GigDetails", async (req, res) => {
  const { gig_id } = req.body;

  const data = await db
    .collection("gigs")
    .find({ _id: new ObjectId(gig_id) })
    .toArray();

  res.json(data);
});

app.post("/AddToCart", async (req, res) => {
  const { username, gig_id, email } = req.body;

  const result = await db
    .collection("cartGigs")
    .find({ username, email, gig_id });

  if (result.length > 0 ) {

    res.json({message : true});
  } else {
    const data = await db
      .collection("cartGigs")
      .insertOne({ username, email, gigId : gig_id });

    if (data) {
      res.json({ message: true });
    }
  }
});

app.post("/RemoveCartGigs", async (req,res) => {

  const {username, email, gig_id} = req.body;

  const data = await db.collection("cartGigs").deleteOne({username, email, gigId : gig_id});

  if(data.deletedCount > 0){
    res.json({message : true});
  }

});

app.post("/getCartGigs", async (req, res) => {
  const { username, email } = req.body;

  try {
    const cartItems = await db.collection("cartGigs").find({ username, email }).toArray();

    const gigIds = cartItems.map(item => item.gigId); 

    const gigs = await db.collection("gigs").find({ _id: { $in: gigIds.map(id => new ObjectId(id)) } }).toArray();

    res.json(gigs);
  } catch (error) {
    console.error("Error fetching cart gigs:", error);
    res.status(500).json({ error: "Failed to fetch gigs" });
  }
});

const orderStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/zipfiles");
  },
  filename: function (req, file, cb) {
    const { username, email, gig_title, gig_creator } = req.body;
    const safeUsername = username.replace(/[^a-zA-Z0-9]/g, "_");
    const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
    const safeTitle = gig_title.replace(/[^a-zA-Z0-9]/g, "_");
    const safeCreator = gig_creator.replace(/[^a-zA-Z0-9]/g, "_");
    const ext = path.extname(file.originalname);
    cb(null, `${safeUsername}_${safeEmail}_${safeTitle}_${safeCreator}${ext}`);
  },
});

const orderUpload = multer({ storage: orderStorage });

app.post("/OrderCartGigs", orderUpload.single("users_zipFile"), async (req, res) => {
  try {
    const { username, email, gig_id, gig_title, gig_creator, users_description } = req.body;
    const filePath = req.file ? `/uploads/zipfiles/${req.file.filename}` : null;

    const result = await db.collection("orderedGigs").insertOne({
      username,
      email,
      gig_id,
      gig_title,
      gig_creator,
      users_description,
      filePath,
      orderedAt: new Date(),
    });

    res.json({ message: true });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: false });
  }
});

app.post("/GetOrderedDetails", async(req, res) => {

  const {username, email} = req.body;

  const data = await db.collection("orderedGigs").find({username, email}).toArray();

  res.json(data);

})


app.post("/loginUser", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.collection("Buyer").findOne({ email });

  if (user == null) {
    return res.json({ message: "UNF" });
  } else {
    if (user.email == email && user.password == password) {
      return res.json({
        message: "true",
        userName: user.username,
        email: user.email,
      });
    } else {
      return res.json({ message: "false" });
    }
  }
});

app.post("/signUp", async (req, res) => {
  const { name, email, userName, password } = req.body;

  const user = await db.collection("Buyer").findOne({ email });

  if (user  == null) {

    const user1 = await db.collection("Buyer").findOne({userName});

    if (user1 == null){

      const insert = await db.collection("Buyer").insertOne({
        name: name,
        email: email,
        username: userName,
        password: password,
      });
  
      if (insert) {
        return res.json({ message: "true" });
      }

    }else if(user1.username == userName){
      return res.json({ message: "userName exist" });
    }
    

  } else if(user.email == email) {

     return res.json({ message: "user exist" });

  }
});

app.post("/BuyerDetails", async (req, res) => {
  const email = req.body.email;

  const det = await db.collection("Buyer").findOne({ email });

  if (det.email == email) {
    const data = await db.collection("gigs").find({ email }).toArray();

    const data1 = await db.collection("orderedGigs").find({email}).toArray();

    return res.json({
      message: true,
      name: det.name,
      username: det.username,
      email: det.email,
      totalGigsBuyed: data1.length,
      totalAmountSpend: 0,
      totalGigsCreated: data.length,
      totalAmountEarned: 0,
    });
  } else {
    res.json({ message: false });
  }
});

app.listen(5000, () => {
  console.log("Server running on Port 5000");
});
