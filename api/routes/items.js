const router = require("express").Router();
const Item = require("../models/Item");
const User = require("../models/User")



    //read
    router.get('/', async (req,res)=> {
        try{
            const userId = req.query.userId;

            if (!userId) {
                return res.status(200).json([]);
            }
            const userItems= await Item.find({userId: userId}).sort({createdAt: -1});
            res.json(userItems);
        } catch(error){
            res.status(400).json('error:' + error)
        }
        })
    //create
    
    router.post('/newitem', async (req,res) =>{
        try {
            const newItem = new Item({
                title: req.body.title, 
                description: req.body.description, 
                completed: req.body.completed || false,
                userId: req.body.userId,
            })
            const savedItem= await newItem.save();
            res.json(savedItem)
        } catch(error){
            res.status(400).json('error:' + error)
        }
    })
    
    // delete
    
    router.delete('/delete/:id', async(req, res) => {
        try{
            const id= req.params.id;
            const item = await Item.findById(id);
            if (!item) {
                return res.status(404).json("Item is not found");
            }

            const userId = req.body.userId || req.query.userId;

            if(item.userId === userId) {
            const deletedItem = await Item.findByIdAndDelete(id);
            res.status(200).json("succesfully deleted")
        } else {
            res.status(401).json("you can only update your todo")
        }
        } catch(error){
            res.status(400).json('error:' + error)
        }
    })
    
    //update
    router.put('/update/:id', async(req, res) => {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json("Item is not found");
        }

        const userId = req.body.userId || req.query.userId;
        if(item.userId === userId) { 

        try{
            const id= req.params.id;
            const updatedItem = await Item.findByIdAndUpdate(id, {
                title: req.body.title,
                description: req.body.description,
                completed: req.body.completed
            },
            // { $set: req.body }, // A req.body-ban küldött összes mezőt (title, description, completed) frissíti
            {new: true}
        );
            if(!updatedItem) {
                return res.status(404).json("Item is not found")
            }
            res.json(updatedItem);
        } catch(error){
            res.status(400).json('error:' + error)
        } } else {
            res.status(401).json("you can only update your todo")
        }
    })

    module.exports = router;