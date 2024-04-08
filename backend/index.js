const express =require('express')
const cors= require('cors');

const {generateFile}= require('./GenerateFile');
const{ executeCpp } =require('./executeCpp'); 
const { executePy } = require('./executePy');
const app =express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/', (req, res) => {
    return res.json({hello:"world!"})
});

app.post('/run', async(req, res) => {
    const {language="cpp", code} = req.body;
    console.log(language ,code.length);
    if(code === undefined){
        return res.status(400).json({success:false, message:"Empty code body"});
    }

    try{
        const filepath = await generateFile(language, code);
        let output;
        
        if(language === "cpp"){
            output =await executeCpp(filepath);
        }
        else{
            output= await executePy(filepath);
        }
        return res.json({filepath, output});
    }
    catch(err){
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(err.response.data);
            res.status(500).json({message: 'Server responded with an error', error: err.response.data});
        } else if (err.request) {
            // The request was made but no response was received
            console.log(err.request);
            res.status(500).json({message: 'No response received from the server', error: err.request});
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', err.message);
            res.status(500).json({message: 'An error occurred setting up the request', error: err.message});
        }
    }
});


app.listen(5000, ()=>{ 
    console.log('listening on port 5000');
});