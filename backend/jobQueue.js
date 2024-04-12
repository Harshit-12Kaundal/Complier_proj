const Queue =require("bull");

const jobQueue =new Queue('job-queue');
const NUM_WORKERS = 5;
const Job=require('./models/job')
const{ executeCpp } =require('./executeCpp'); 
const { executePy } = require('./executePy');

jobQueue.process(NUM_WORKERS , async({data})=>{
    console.log(data);
    const {id:jobId}=data;
    const job=await Job.findById(jobId);


    if(job==undefined){
        throw Error('Job not found');
    }

    console.log("Fetched job" , job);

    try {
        job["startedAt"]= new Date();
        if(job.language === "cpp"){
            output =await executeCpp(job.filepath);
        }
        else{
            output= await executePy(job.filepath);
        }
        job["completedAt"]=new Date();
        job["status"]="success";
        job["output"]=output;

        await job.save();

        // console.log(job);
        // return res.json({filepath, output});
    }
    catch(err){
        job["completedAt"]=new Date();
        job["status"]="error";
        job["output"]=JSON.stringify(err);
        job.save();
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(err.response.data);
            // res.status(500).json({message: 'Server responded with an error', error: err.response.data});
        } else if (err.request) {
            // The request was made but no response was received
            console.log(err.request);
            // res.status(500).json({message: 'No response received from the server', error: err.request});
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', err.message);
            // res.status(500).json({message: 'An error occurred setting up the request', error: err.message});
        }
    }
    return true;
});

jobQueue.on('failed',(error)=>{
    console.log(error.data.id ,'failed' , error.failedReason);
});

const addJobToQueue = async (jobId) =>{
    await jobQueue.add({ id: jobId });
}


module.exports = {
    addJobToQueue,
};