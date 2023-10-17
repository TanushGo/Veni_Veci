import { useState } from 'react'
import './App.css'
import Gallery from './components/Gallery';
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;



function App() {

  
  const [banList, setBanList] = useState([])
  const [currentArt, setCurrentArt] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [prevImages, setPrevImages] = useState([]);
  
  const discoverForm = () => {
    let discovered =false;
    
    makeQuery();
    console.log("ran")
    console.log(currentImage)
      
    
    
  }

  const addBanItem = (art, key) =>
  {
    setBanList([...banList, art[key]]);
    console.log(banList);
  }

  const makeQuery = () => {
    let query = `https://api.harvardartmuseums.org/object?apikey=${ACCESS_KEY}&size=1&sort=random&hasimage=1`;
    callAPI(query).catch(console.error);
  }

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
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
    }
    else{
      setCurrentImage();
    }
  }

  const buttons = banList.map((d)=>{
    return <button className='banned-buttons' key={d}>{d}</button>;
  })




  return (
    <div className="whole-page">
      <h1>Discover Art! 🎨</h1>
      
      <button onClick={discoverForm}>🔀 Discover!</button>
      {currentArt ? (<div className='art-descrip'><h3>{currentArt.title}</h3>
      {currentArt.technique ? (<button className='attribute-buttons' onClick={() =>{addBanItem(currentArt,"technique")}}>{currentArt.technique}</button> ): (<div>
        </div>)}
      {currentArt.century ? (<button className='attribute-buttons' onClick={() =>{addBanItem(currentArt,"century")}}>{currentArt.century}</button> ): (<div>
      </div>)} 
      {currentArt.culture ? (<button className='attribute-buttons' onClick={() =>{addBanItem(currentArt,"culture")}}>{currentArt.culture}</button> ): (<div>
      </div>)}
      {currentArt.classification ? (<button className='attribute-buttons' onClick={() =>{addBanItem(currentArt,"classification")}}>{currentArt.classification}</button> ): (<div>
      </div>)} 
      </div>) : (<div> </div>)}
      
     
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

      <div className ="ban-list">
        <h2>Banned items</h2>
        {buttons}
      </div>

      <br></br>

    </div>
  );
}

export default App