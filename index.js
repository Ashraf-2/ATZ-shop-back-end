const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middlewear
app.use(cors());
app.use(express.json());

//AcA01JVzLn4vKUlJ -pass
//e-commarce-xm10

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bx5otjq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const eCommerceCollection = client.db("eCommerceDB");
    const productCL = eCommerceCollection.collection('products');
    const BrandCL = eCommerceCollection.collection('Brands');
    const userCL = eCommerceCollection.collection('users');
    const CartCL = eCommerceCollection.collection('cart');

    //brand
    app.get('/brands', async (req, res) => {
      const cursor = BrandCL.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    

    //products related CRUD operations
    app.get('/products', async (req, res) => {
      const cursor = productCL.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCL.findOne(query);  //cl modiefed
      res.send(result);
    })

    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCL.insertOne(newProduct);
      res.send(result);
    })

    app.put('/products/:id',async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedProduct = req.body;

      const product1 = {
        $set: {
          prod_name:updatedProduct.prod_name,
          rating:updatedProduct.rating,
          price:updatedProduct.price,
          description:updatedProduct.description,
          photo_url:updatedProduct.photo_url, 
          brand_name:updatedProduct.brand_name, 
          prod_type:updatedProduct.prod_type
        }
      }

      const result  = await productCL.updateOne(filter,product1,options)
      res.send(result);
    })

    //cartings related crud operations
    app.get('/cart', async (req, res) => {
      const cursor = CartCL.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/cart', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await CartCL.insertOne(newProduct);
      res.send(result);
    })





    //users related CRUD operations


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("e-commarce server in running");
})

app.listen(port, () => {
  console.log(`e-commarce server in running on ${port}`);
})