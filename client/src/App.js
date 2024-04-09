import './App.css';
import React ,{useState} from 'react';
import axios from 'axios';

function App() {

  const [code, setCode]=useState('');
  const [output,setOutput] = useState('');
  const [language,setLanguage] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    const payload ={
      language,
      code
    };
    try {
      const {data}=await axios.post("http://localhost:5000/run",payload);
      console.log(data);
      setOutput(data.output);
    } catch ({response}) {
      if(response){
        const errMsg= response.data.stderr;
        setOutput(errMsg);
      }
      else{
        setOutput("Error in Connecting to server")
      }
    }    
  };

  return (
    <div className="App">
        <h1>Online Code Compiler</h1>
        <div style={{padding:"1rem"}}>
          <label>Language</label>
            <select 
              value={language} 
              onChange={(e)=>
                {setLanguage(e.target.value);
                console.log(e.target.value);
              }}
            >
              <option value="cpp">C++</option>
              <option value="py">Python</option>
            </select>
        </div>
        <textarea rows="20" cols="75" value={code} onChange={(e)=>setCode(e.target.value)}></textarea>
        <br/>
        <button onClick={handleSubmit}>Submit</button>
        <p>{output}</p>
    </div>
  );
}

export default App;
