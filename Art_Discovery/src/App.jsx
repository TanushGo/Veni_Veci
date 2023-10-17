import { useState } from 'react'
import './App.css'
import Gallery from './components/Gallery';
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;



function App() {

  
  const [banList, setBanList] = useState({
    century:[],
    classification:[],	
    culture:[],	
    technique :[],
  })
  const [currentArt, setCurrentArt] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [prevImages, setPrevImages] = useState([]);
  
  const discoverForm = () => {
    let discovered =false;
    while (discovered !=true){
      makeQuery();
      console.log("ran")
      console.log(currentImage)
      
        discovered = true
    
      
    }
    
    
  }

  const makeQuery = () => {
    let query = `https://api.harvardartmuseums.org/object?apikey=${ACCESS_KEY}&size=1&sort=random&hasimage=1`;
    callAPI(query).catch(console.error);
  }

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
    console.log(json);
    setCurrentArt(json.records[0])
    imageQuery(json.records[0].id)
    
  }

  const imageQuery = (imageId) => {
    let query = `https://api.harvardartmuseums.org/image?apikey=${ACCESS_KEY}&id=${imageId}`;
    callImageAPI(query).catch(console.error);
  }

  const callImageAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
    console.log(json);
    if (json.records.length!=0)
    {
      setCurrentImage(json.records[0].baseimageurl);
      setPrevImages((images) => [...images, json.records[0].baseimageurl]);
      console.log("correct")
      discovered = true;
    }
    else{
      setCurrentImage();
    }
  }



  return (
    <div className="whole-page">
      <h1>Discover Art! 🎨</h1>
      
      <button onClick={discoverForm}>🔀 Discover!</button>
      {currentArt ? (<div className= "art-descrip"><h3>{currentArt.title}</h3> 
      <button className='attribute-buttons'>{currentArt.technique}</button>
      <button className='attribute-buttons'>{currentArt.century}</button> 
      <button className='attribute-buttons'>{currentArt.classification}</button> 
      <button className='attribute-buttons'>{currentArt.culture}</button>  
      </div>) : 
      (<div>

      </div>)} 
      {currentImage ? (
        <img
          className="screenshot"
          src={currentImage}
          alt="Screenshot returned"
          height="500"
          width ="700"
        />
      ) : (
        <div> </div>
      )}
      
      <br></br>

      <div className="container">
        <Gallery images={prevImages} />
      </div>

      <br></br>

    </div>
  );
}

export default App