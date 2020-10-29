import React from 'react'
import "./Map.css";
import {Map as LeafletMap, TileLayer } from "react-leaflet";
import { showDataOnMap } from './util';

function map({ countries, casesType, center, zoom }) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>

                <TileLayer 
                    url="http://{s}.tile.Openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />         
                {showDataOnMap(countries, casesType)}                
            </LeafletMap>            
        </div>
    );
}

export default map
