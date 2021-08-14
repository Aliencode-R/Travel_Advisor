import React, {useState, useEffect} from 'react';
import {CssBaseline, Grid} from '@material-ui/core'
import { getPlacesData } from './api';

import Header from './Components/Header/Header';
import List from './Components/List/List';
import Map from './Components/Map/Map';
import PlaceDetails from './Components/PlaceDetails/PlaceDetails';

const App = () => {
  const [places, setPlaces] = useState([]);
  const [childClicked, setChildClicked] = useState(null)

  const [filteredPlaces, setFilteredPlaces] = useState([])

  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');


  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
      setCoordinates({lat: latitude, lng: longitude})
    })

  }, [])

  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating > rating)
    setFilteredPlaces(filteredPlaces)
  }, [rating])

  useEffect(()=>{
    console.log(bounds);
    if(bounds?.sw && bounds?.ne) {
      setLoading(true);
      getPlacesData(type, bounds?.sw, bounds?.ne).then( (data) => {
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
        setFilteredPlaces([])
        setLoading(false);
      })
    }
  }, [type , bounds])

  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{width: '100%'}}>
        <Grid item xs={12} md={4}>
          <List 
            places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            loading={loading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map 
            setCoordinates={setCoordinates} 
            setBounds={setBounds} 
            coordinates={coordinates} 
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
          />
        </Grid>

      </Grid>
    </>
  )
}

export default App;