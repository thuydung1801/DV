import React from 'react'
import { UilSearch } from '@iconscout/react-unicons'
import { UilLocationPoint } from '@iconscout/react-unicons'
import { useState } from 'react';
import { toast } from 'react-toastify';

function Inputs({setQuery, units, setUnits}) {
  const [city, setCity] = useState("");

  const handleUnitsChange = (e) =>{
    const selectedUnit = e.currentTarget.name;
    if(units !== selectedUnit) setUnits(selectedUnit);
  };

  const handleSearchClick = () => {
    if(city !== "") setQuery({city: city})
  };

  const handleLocationClick = () =>{
    if(navigator.geolocation){

      toast.info('Fetching users location.')
      navigator.geolocation.getCurrentPosition((position) => {

        toast.success("Location fetched.!")
        let lat = position.coords.latitude
        let lon = position.coords.longitude
         
        setQuery({
          lat,
          lon,
        
        });
      });
    }
  };

  // const handleLocationClick = () =>{
  //   if(navigator.geolocation){
  
  //     toast.info('Fetching users location.')
  //     navigator.geolocation.getCurrentPosition((position) => {
  
  //       toast.success("Location fetched.!")
  //       let lat = position.coords.latitude
  //       let lon = position.coords.longitude
  //       // let  exclude= "current,minutely,alerts"
  //       // let units = "metric"
        
  //       // Call weather API
  //       fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=1fa9ff4126d95b8db54f3897a208e91c`)
  //         .then(response => response.json())
  //         .then(data => {
  //           console.log(data);
  //           // do something with the weather data, such as update state or display it to the user
  //         })
  //         .catch(error => console.error(error));
  
  //     });
  //   }
  // };
  
  return (
    <div className='flex flex-row justify-center my-6'>
        
        <div className='flex flex-row w-3/4 items-center justify-center space-x-4'>
            <input 
            value={city}
            onChange={(e) => setCity(e.currentTarget.value)}
                type="text" 
                placeholder=' Search for city...'
                className='text-xl font-lightp-2 w-full shadow-xl focus:outline-none capitalize placeholder:lowercase'/>
                <UilSearch
                  size={25} className="text-white cursor-pointer transition ease-out hover:scale-125"
                  onClick={handleSearchClick}
                  />
                <UilLocationPoint size={25} className="text-white cursor-pointer transition ease-out hover:scale-125"
                  onClick = {handleLocationClick}
                />
        </div>
        <div className='flex flex-row w-1/4 items-center justify-center'>
            <button name='metric' className='text-xl text-white font-light
              transition ease-out 
              hover:scale-125'
              onClick={handleUnitsChange}
              >°C</button>
            <p className='text-xl text-white mx-1'>|</p>
            <button name='imperial' className='text-xl text-white font-light
              transition ease-out 
              hover:scale-125'
              onClick={handleUnitsChange}
              >°F</button>
        </div>
        
    </div>
  );
}

export default Inputs