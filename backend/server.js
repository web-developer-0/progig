require('dotenv').config({ path: __dirname + '/db_connect.env' });

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const PORT = 5000;

async function startServer() {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');

    await client.connect();
    console.log('✅ MongoDB Atlas connected');

    // Optionally ping the server to verify the connection
    await client.db("progig").command({ ping: 1 });
    console.log("✅ Ping to MongoDB Atlas successful");

    // Make DB available to routes
    app.locals.db = client.db("progig");

    app.get('/', (req, res) => {
      res.send('Backend is live 🚀');
    });

    // Start listening only after DB is ready
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1); // Let Render retry
  }
}

startServer();

/*
MongoClient.connect(uri)
  .then((client) => {
    db = client.db("progig");
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error");
  });
*/


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

app.post("/UpdateGig", async (req, res) => {
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

    res.json({ message: "success" });
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

app.post("/OrderedGigs", async (req, res) => {
  const { username } = req.body;

  const orderedGigsData = await db
    .collection("orderedGigs")
    .find({ gig_creator: username })
    .toArray();

  const gigIds = orderedGigsData.map((item) => new ObjectId(item.gig_id));

  const gigsData = await db
    .collection("gigs")
    .find({ _id: { $in: gigIds } }, { projection: { duration: 1, _id: 1 } })
    .toArray();

  const enrichedData = orderedGigsData.map((orderedGig) => {
    const gig = gigsData.find((g) => g._id.equals(orderedGig.gig_id));
    return {
      ...orderedGig,
      duration: gig ? gig.duration : null,
    };
  });

  res.json(enrichedData);
});

app.post("/GetOrderedGigRequirements", async (req, res) => {
  const { gig_Id } = req.body;

  const data = await db
    .collection("orderedGigs")
    .find({ _id: new ObjectId(gig_Id) })
    .toArray();

  res.json(data);
});

app.get("/downloadFile", (req, res) => {
  const filePath = req.query.filePath;

  if (!filePath) {
    return res.status(400).json({ error: "No file path provided" });
  }

  const fullPath = path.join(__dirname, filePath);

  res.download(fullPath, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(500).json({ error: "File could not be downloaded" });
    }
  });
});

const projectStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/projects");
  },
  filename: function (req, file, cb) {
    const { username, email, gig_title, gig_ordered_by } = req.body;
    const safeUsername = username.replace(/[^a-zA-Z0-9]/g, "_");
    const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
    const safeTitle = gig_title.replace(/[^a-zA-Z0-9]/g, "_");
    const safeOrderBy = gig_ordered_by.replace(/[^a-zA-Z0-9]/g, "_");
    const ext = path.extname(file.originalname);
    cb(null, `${safeUsername}_${safeEmail}_${safeTitle}_${safeOrderBy}${ext}`);
  },
});

const uploadProject = multer({ storage: projectStorage });

app.post("/StoreProject", uploadProject.single("zipfile"), async (req, res) => {
  const {
    username,
    email,
    gig_title,
    gig_category,
    orderedGigId,
    project_description,
  } = req.body;
  const projectPath = req.file ? `uploads/projects/${req.file.filename}` : null;

  try {
    const result = await db.collection("CompletedProjects").insertOne({
      username,
      email,
      gig_title,
      gig_category,
      orderedGigId,
      project_description,
      zipfile: projectPath,
      createdAt: new Date(),
    });

    if (result) {
      res.json({ message: "success" });
    }
  } catch (error) {
    console.error("Error saving gig:", error);
    res.status(500).json({ message: "error" });
  }
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

  if (result.length > 0) {
    res.json({ message: true });
  } else {
    const data = await db
      .collection("cartGigs")
      .insertOne({ username, email, gigId: gig_id });

    if (data) {
      res.json({ message: true });
    }
  }
});

app.post("/RemoveCartGigs", async (req, res) => {
  const { username, email, gig_id } = req.body;

  const data = await db
    .collection("cartGigs")
    .deleteOne({ username, email, gigId: gig_id });

  if (data.deletedCount > 0) {
    res.json({ message: true });
  }
});

app.post("/getCartGigs", async (req, res) => {
  const { username, email } = req.body;

  try {
    const cartItems = await db
      .collection("cartGigs")
      .find({ username, email })
      .toArray();

    const gigIds = cartItems.map((item) => item.gigId);

    const gigs = await db
      .collection("gigs")
      .find({ _id: { $in: gigIds.map((id) => new ObjectId(id)) } })
      .toArray();

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

app.post(
  "/OrderCartGigs",
  orderUpload.single("users_zipFile"),
  async (req, res) => {
    try {
      const {
        username,
        email,
        gig_id,
        gig_title,
        gig_creator,
        users_description,
      } = req.body;
      const filePath = req.file
        ? `/uploads/zipfiles/${req.file.filename}`
        : null;

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
  }
);

app.post("/GetOrderedDetails", async (req, res) => {
  const { username, email } = req.body;

  const data = await db
    .collection("orderedGigs")
    .find({ username, email })
    .toArray();

  res.json(data);
});

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

app.post("/loginAdmin", async (req, res) => {
  const { userName, password } = req.body;

  const user = await db.collection("Admin").findOne({ username: userName });

  if (user == null) {
    return res.json({ message: "UNF" });
  } else {
    if (user.username == userName && user.password == password) {
      return res.json({
        message: "true",
        userName: user.username,
      });
    } else {
      return res.json({ message: "false" });
    }
  }
});

app.post("/signUp", async (req, res) => {
  const { name, email, userName, password } = req.body;

  const user = await db.collection("Buyer").findOne({ email });

  if (user == null) {
    const user1 = await db.collection("Buyer").findOne({ userName });

    if (user1 == null) {
      const insert = await db.collection("Buyer").insertOne({
        name: name,
        email: email,
        username: userName,
        password: password,
      });

      if (insert) {
        return res.json({ message: "true" });
      }
    } else if (user1.username == userName) {
      return res.json({ message: "userName exist" });
    }
  } else if (user.email == email) {
    return res.json({ message: "user exist" });
  }
});

app.post("/BuyerDetails", async (req, res) => {
  const email = req.body.email;

  const det = await db.collection("Buyer").findOne({ email });

  if (det.email == email) {
    const data = await db.collection("gigs").find({ email }).toArray();

    const data1 = await db.collection("orderedGigs").find({ email }).toArray();

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

app.post("/admin/UsersList", async (req, res) => {
  const result = await db
    .collection("Buyer")
    .aggregate([
      {
        $lookup: {
          from: "gigs", 
          localField: "username", 
          foreignField: "username",
          as: "user_gigs",
        },
      },
      {
        $project: {
          _id: 0, 
          username: 1,
          email: 1, 
          name: 1, 
          gigCount: { $size: "$user_gigs" },
        },
      },
    ])
    .toArray();


  res.json(result);
});

app.post("/admin/GigsList", async(req,res)=>{
  const result = await db.collection("gigs").find({}).toArray();
  res.json(result);

})

app.post("/admin/GetCounts", async(req,res)=>{
  const [gigCount, userCount] = await Promise.all(
    [
      db.collection("gigs").countDocuments(),
      db.collection("Buyer").countDocuments()
    ]
  )

  res.json({gigCount: gigCount, userCount: userCount});
})
