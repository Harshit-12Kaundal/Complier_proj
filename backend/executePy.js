const { exec }= require("child_process")
// const fs=require("fs");
// const path=require("path");

// const outputPath= path.join(__dirname,"outputs");

// if(!fs.existsSync(outputPath)){
//     fs.mkdirSync(outputPath,{recursive:true});
// }

const executePy =(filepath) =>{
    // const jobId=path.basename(filepath).split(".")[0];
    // const outPath=path.join(outputPath,`${jobId}.exe`);

    return new Promise((resolve, reject) =>{
        exec(`python ${filepath}`,
        (error,stdout,stderr)=>{
            error && reject({error,stderr});
            stderr && reject(stderr);
            resolve(stdout);
        });
    });

};


module.exports = {
    executePy,
};