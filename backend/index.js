const express =require('express')
const cors= require('cors');
const mongoose = require('mongoose');

const {generateFile}= require('./GenerateFile');

const {addJobToQueue}= require('./jobQueue');
const Job=require('./models/job.js')

mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch((err) => {
    console.log('Error occurred:', err.message);
  });



const app =express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/status', async(req, res) => {
    const jobId=req.query.id;
    console.log('status requested:',jobId);
    if(jobId == undefined){
        return res.status(400)
        .json({success:false ,error:"missing id query param"});
    }
    try {
        const job=await Job.findById(jobId);
        if(job === undefined){
            res.status(404).json({success:false ,error:"Invalid job id"});
        }

        res.status(200).json({success:true,job});
    } catch (error) {
        return res.status(404).json({success:false ,error:JSON.stringify(error)}); 
    }

});

app.post('/run', async(req, res) => {
    const {language="cpp", code} = req.body;
    console.log(language ,code.length);
    if(code === undefined){
        return res.status(400).json({success:false, message:"Empty code body"});
    }

    let job;

    try{
        const filepath = await generateFile(language, code);

        job= await new Job({language:language, filepath}).save();
        const jobId=job["_id"];
        addJobToQueue(jobId);
        // console.log(addJobToQueue(jobId));
        console.log(job);
        res.status(201).json({success:true, jobId});
        let output;
    }catch(error){
        return res.status(500).json({success:false ,err:JSON.stringify(error)});
    }

});


app.listen(5000, ()=>{ 
    console.log('listening on port 5000');
});