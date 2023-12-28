import React, {useEffect, useState} from 'react';
import { ArrowBigRight } from 'lucide-react';
import { Link, animateScroll as scroll } from 'react-scroll';
import './App.css';

const App = () => {
  const [message, setMessage] = useState("");
  
  const getConnectMessage = async() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    };
    const response = await fetch('/api', requestOptions);
    const data = await response.json();
    if(!response.ok){
      console.log("Something Messed Up!");
    } else {
      setMessage(data.message);
    }
  };
  useEffect(() => {
    getConnectMessage();
  }, []);

  const backgroundImageUrl = process.env.PUBLIC_URL + '/KS_Background.jpg';

  const containerStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };


  const [picture, setPicture] = useState({});
  const [mlres, setMlres] = useState({});
  const [click, setClick] = useState(false);
  const handleClick = () => {
    setClick(true);
    setImageAction();
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPicture({
      picturePreview: URL.createObjectURL(file),
      pictureAsFile: file,
    });
    console.log("File has been set");
  };

  var uploadedImage;
  const setImageAction = async(e) => {
    // e.preventDefault();
    const formData = new FormData();
    formData.append('file', picture.pictureAsFile);
    console.log(picture.pictureAsFile);
    for(var key of formData.entries()){
      console.log(key[0] + ", " + key[1]);
    }
    const data = await fetch('/predict/image', {
      method: "post",
      body: formData,
    });
    
    const response = await data.json();  // Store the result
    uploadedImage = response;  // Use the stored result
    if (uploadedImage) {
      console.log("Successfully uploaded image");
      console.log(uploadedImage)
      setMlres(uploadedImage);
    } else {
      console.log("Something got messed up");
    }

  }
  return (
    <div className="App flex-col" style={containerStyle}>
      <nav className="px-10 fixed top-0 left-0 w-full p-4 bg-[#2B5168] text-white flex justify-between items-center drop-shadow-[0_15px_15px_#ff0000b8]">
        <a href="/" className="font-bold text-2xl cursor-pointer">
          Kidney Stone Detection
        </a>
        <ul className="flex space-x-4">
          <li>
            <p className="font-bold text-[18px]">
              Precaution & Treatment Guidelines
            </p>
          </li>
        </ul>
      </nav>
      <div className='flex space-x-32 items-center'>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <label htmlFor="fileInput" style={{ width: '400px', height: '400px', border: '2px solid #ccc', display: 'inline-block', cursor: 'pointer', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              {!picture.picturePreview && <span className='text-[24px] font-serif'>Select CT Scan</span>}
              {picture.picturePreview && <img src={picture.picturePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px'}} />}
            </label>

            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button type='submit' name = "upload" onClick={handleClick} disabled= {!picture.picturePreview} className ={!picture.picturePreview ? 'rounded-[10px] px-16 py-3 text-[20px] font-bold mt-5 bg-gray-300': 'rounded-[10px] px-16 py-3 text-[20px] font-bold mt-5 bg-[#ff0000b8] hover:bg-[#ff0000eb]'} >Upload [.jpg/.jpeg/.png format]</button>
          </div>
          {click ? <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <ArrowBigRight style={{ width: '100px', height: '100px' }}/>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: '4.2rem'}}>
              <div style={{ width: '400px', height: '400px', border: '5px solid #ccc', display: 'inline-block', cursor: 'pointer', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFAFA', cursor: 'default'}}>
                <div className='h-full text-[20px] font-serif flex justify-center items-center w-full border-b-4 flex-col'><span className = 'top-0 relative h-full flex justify-center items-center font-bold text-[25px]'>Results*</span> <span className = 'top-0 relative h-full m-2 text-[24px] font-medium'>Kidney stone(s) {mlres.Message == 1 ? <span className = "text-[red] font-bold">found</span>: <span className = "text-[green] font-bold">not-found</span>} </span></div>
                <div className='h-full text-[20px] font-serif flex justify-center items-center flex-col'><span className = 'top-0 relative h-full flex justify-center items-center font-bold text-[25px]'>Probability of Kidney Stone</span> <span className = 'top-0 relative h-full text-[26px] font-medium'>{mlres.Probability}%</span></div>
              </div>
            </div>
          </div> : <div></div>}
        </div>
        <div className="max-w-xl mx-auto bg-white p-8 rounded-md shadow-md">
          <h2 className="text-[18px] font-bold mb-4">Treatment Guidelines</h2>
          <ul className="list-disc pl-4 mb-6 text-justify font-serif text-[14px]">
            <li><span className='text-[15px] font-bold'>Stay Hydrated:</span> Drink plenty of water.</li>
            <li><span className='text-[15px] font-bold'>Medical Intervention:</span> Consult with a healthcare professional.</li>
            <li><span className='text-[15px] font-bold'>Pain Management:</span> Use prescribed medications for pain relief.</li>
            <li><span className='text-[15px] font-bold'>Dietary Changes:</span> Adjust your diet under professional guidance.</li>
            <li><span className='text-[15px] font-bold'>Follow-up Care:</span> Regularly follow up with your healthcare provider.</li>
          </ul>

          <h2 className="text-[18px] font-bold mb-4">Precaution Guidelines</h2>
          <ul className="list-disc pl-4 text-justify font-serif text-[14px]">
            <li><span className='text-[15px] font-bold'>Stay Hydrated:</span> Drink an ample amount of water.</li>
            <li><span className='text-[15px] font-bold'>Balanced Diet:</span> Adopt a diet with adequate calcium and limits on certain foods.</li>
            <li><span className='text-[15px] font-bold'>Limit Animal Proteins:</span> Reduce consumption of red meat.</li>
            <li><span className='text-[15px] font-bold'>Control Sodium Intake:</span> Monitor and control salt intake.</li>
            <li><span className='text-[15px] font-bold'>Regular Check-ups:</span> Schedule regular check-ups with your healthcare provider.</li>
          </ul>
        </div>
      </div>
        <footer className='fixed bottom-0 w-full p-4 text-white flex justify-between items-center'><p className="absolute right-[34px]">*The results may be prone to inaccuracies</p></footer>
    </div>
  );
}

export default App;
