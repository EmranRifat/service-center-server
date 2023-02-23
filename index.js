const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
require('dotenv').config();
const app = express()
const port =process.env.PORT|| 5000;

// middleware
app.use(cors());
app.use(express.json());

// user:servicedb
// pass:DVeNnkCy5ESAYBtK


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2yfam2s.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){

    try{
        const serviceCollection=client.db("serviceCenter").collection("services");
        const orderCollection=client.db("serviceCenter").collection('orders')

       
        app.get('/services',async(req,res)=>{
            const query={}
            const cursor=serviceCollection.find(query);
            const services=await cursor.toArray();
            res.send(services);
          });


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id:new ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });


        
        // order Api

        app.post('/orders',async(req,res)=>{
          const order=req.body;
          const result=await orderCollection.insertOne(order);
          res.send(result);


        });

        app.get("/orders",async(req,res)=>{
          const query={};
          if(req.query.email){
              query={
                  email:req.query.email
              }
          }

          let cursor= orderCollection.find(query);
          const orders=await cursor.toArray();
          res.send(orders);

        })











    }





finally{

}

}
run().catch(error=>console.error(error));

app.get('/', (req, res) => {
  res.send('Service Center server is running ...')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})