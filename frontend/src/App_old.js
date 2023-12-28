import React, {useEffect, useState} from 'react';
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



  const [picture, setPicture] = useState({});
  const [mlres, setMlres] = useState({});
  const uploadPicture = (event) => {
    setPicture({
      // picturePreview: window.URL.createObjectURL(new Blob(e.target.files[0], {type: "application/zip"})),
      picturePreview: window.URL.createObjectURL(event.target.files[0]),
      pictureAsFile: event.target.files[0],
    })
  }

  var uploadedImage;
  const setImageAction = async(e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('file', picture.pictureAsFile);
    console.log(picture.pictureAsFile);
    for(var key of formData.entries()){
      console.log(key[0] + ", " + key[1]);
    }
    const data = await fetch('/predict/image',{
      method: "post",
      // headers: {"Content-Type": "multipart/form-data"},
      // body: JSON.stringify(formData),
      body: formData,
    });
    uploadedImage = await data.json();
    if(uploadedImage){
      console.log("Successfully uploaded image");
      console.log(uploadedImage)
      setMlres(uploadedImage);
    } else {
      console.log("Again something got messed up");
    }
  }
  const pred = () => {
    if(JSON.stringify(mlres)){
      return(<>{JSON.stringify(mlres) && <div>{JSON.stringify(mlres)}</div>}</>);
    }
  }
  return (
    <div className="App">
      <h1>{message}</h1>
      <form onSubmit={setImageAction}>
        <input type="file" name="image" onChange={uploadPicture}/>
        <br/>
        <br/>
        <button type='submit' name = "upload">Upload</button>
      </form>
      {JSON.stringify(mlres) && <div>{JSON.stringify(mlres)}</div>}
      {/* {pred} */}
    </div>
  );
}

export default App;
