import React, { useEffect, useState } from "react";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import "./App.css";
import Table from "./Table";
import InfoBox from "./InfoBox";
import Map from "./Map";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";



function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries,setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() =>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data =>{
      setCountryInfo(data);
    });
  }, []);
 // https://disease.sh/v3/covid-19/countries

 useEffect(() =>{
    //the code inside here will run once
    //when the component loads and not again after
    const getCountriesData = async () =>{
       fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({          
         name: country.country,
         value: country.countryInfo.iso2,  
        }));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };

    getCountriesData();
 }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;  
    setCountry(countryCode);

    const url = 
      countryCode === 'worldwide' 
        ? "https://disease.sh/v3/covid-19/all" 
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data =>{
      setCountryInfo(countryCode);     
      setCountryInfo(data);

      countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        countryCode === "worldwide" ? setMapZoom(3) : setMapZoom(4);

      //setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      //setMapZoom(4);
    })

  }; 
  
  console.log('COUNTRY CODE >>>>>', countryInfo);

  return (
    <div className="app">
      <div className="app__left">
       <div className="app__header">
        <h1> Covid-19 Tracker </h1>
         <FormControl className="app__dropdown">
          
          <Select 
          variable="outlined" 
          onChange={onCountryChange} 
          value={country}
          >

           {/* loop through all the countries and show the dropdown list of the country  */}
           <MenuItem value="worldwide">Worldwide</MenuItem>
           {
            countries.map(country => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))
          }

         {/* <MenuItem value="worldwide">worldwide</MenuItem>  
          <MenuItem value="worldwide">option 2</MenuItem>  
          <MenuItem value="worldwide">option 3</MenuItem>  
          <MenuItem value="worldwide">option 4</MenuItem> */} 
        </Select>
      </FormControl>  
      </div>             
           
      <div className="app__stats">
        <InfoBox 
        isRed 
        active={casesType === "cases"}
        onClick={(e) => setCasesType('cases')} 
        title="Coronavirus Cases"
        cases ={prettyPrintStat(countryInfo.todayCases)} 
        total={prettyPrintStat(countryInfo.cases)}
        />
        <InfoBox 
        active={casesType === "recovered"}
        onClick={(e) => setCasesType('recovered')}
        title="Recovered" 
        cases ={prettyPrintStat(countryInfo.todayRecovered)} 
        total={prettyPrintStat(countryInfo.recovered)}
        />
        <InfoBox
        isRed
        active={casesType === "deaths"} 
        onClick={(e) => setCasesType('deaths')}
        title="Deaths" 
        cases ={prettyPrintStat(countryInfo.todayDeaths)} 
        total={prettyPrintStat(countryInfo.deaths)}
        />               
      </div>  
      


      {/* Map */ }
      <Map 
      casesType={casesType}
      countries={mapCountries}
      center={mapCenter}
      zoom={mapZoom}
      />    
       </div>      
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>        
        {/* Table */}
          <Table countries={tableData} />
        <h3>Worldwide new {casesType}</h3>  
        {/* Graph */ }
        <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>  
    </div>
  );
}

export default App;
