const fs=require("fs");
const path= require("path");
const { v4:uuid }=require("uuid");
const dirCodes =path.join(__dirname,"codes");

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes,{recursive:true});
};

const generateFile =async(format ,content) => {
    const jobid=uuid();
    const filename=`${jobid}.${format}`
    const filepath =path.join(dirCodes,filename);
    await fs.writeFileSync(filepath,content);
    return filepath
};

module.exports = {
    generateFile,
}