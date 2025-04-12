const express=require('express');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const app=express();
app.use(express.json());


mongoose.connect("mongodb+srv://<username>:<password>@cluster0.tptqxsf.mongodb.net/ECommercedb?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("connected to databse")
})
.catch((err)=>{
    console.log("error",err)
});
    


const productSchema=new mongoose.Schema({
    pname:{type:String, required:true},
    pdescription:{type:String},
    price:{type:Number,required:true},
    pcategory:{type:String},
    pstock:{type:Number,default:0}
});

const Product=mongoose.model('Product',productSchema);


const userSchema=new mongoose.Schema({
    uname:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true}
});

const User=mongoose.model('User',userSchema);



//Register user
app.post('/api/register',(req,res)=>{
    const u=new User(req.body)
    u.save()
   .then(()=>res.status(200).json({message:"User Registered",u}))
   .catch(()=>{res.status(400).json({error:message})});
});


//login
app.post('/api/login',(req,res)=>{
    const {email,password}=req.body;
    User.findOne({email})
    .then((user)=>{
        if(user.password!== password){
            return res.status(401).json({message:"Invalid password"});
        }
        const token=jwt.sign({id:user._id},"secret_key");
        res.status(200).json({message:"Valid User",token});
    });
})




//adding products
app.post('/api/products',(req,res)=>{
   const p1=new Product(req.body)
   p1.save()
   .then(()=>res.status(200).json({message:"product added",p1}))
   .catch(()=>{res.status(400).json({error:message})});
});

//get
app.get('/api/products',(req,res)=>{
    Product.find()
    .then((products)=>{
        res.status(200).json({message:"Products",products})
    })
    .catch(()=>{res.status(404).json({error:message})})
});

//get product by id
app.get('/api/products/:id',(req,res)=>{
    Product.findById(req.params.id)
    .then((products)=>{
        res.status(200).json({products})
    })
    .catch(()=>{
        res.status(400).json({error:message})
    });
});

//update product by id
app.put('/api/products/:id',(req,res)=>{
        Product.findByIdAndUpdate(req.params.id,req.body)
        .then(()=>{
            res.status(200).json({message:"product updated",products})
        })
        .catch((err)=>{
            res.status(400).json({error:message})
        })
})

//delete product
app.delete('/api/products/:id',(req,res)=>{
    Product.findByIdAndDelete(req.params.id)
        .then(()=>{
            res.status(200).json({message:"product deleted"})
        })
        .catch((err)=>{
            res.status(400).json({error:message})
        })
})

app.listen(2000,()=>{
    console.log("Server started");
})
