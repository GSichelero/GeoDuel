import React, { useEffect, useRef, useState, ReactElement } from "react";
import ReactDOM from "react-dom";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import { Link } from "react-router-dom";

const search = window.location.search;
const params = new URLSearchParams(search); 
const roomName = String(params.get('room'));
const playerName = String(params.get('player'));

const iconsBig = [];
const iconsSmall = [];

const colors = ['grn', 'purple', 'blu', 'ylw', 'wht'];
const shapes = ['circle', 'diamond', 'stars', 'square', 'blank'];

for (let j = 0; j < shapes.length; j++) {
    for (let i = 0; i < colors.length; i++) {
        if (colors[i] == 'purple' && shapes[j] == 'blank') {
            iconsBig.push(`http://maps.google.com/mapfiles/kml/paddle/go.png`);
            iconsSmall.push(`http://maps.google.com/mapfiles/kml/paddle/go-lv.png`);
            iconsBig.push(`http://maps.google.com/mapfiles/kml/paddle/stop.png`);
            iconsSmall.push(`http://maps.google.com/mapfiles/kml/paddle/stop-lv.png`);
            iconsBig.push(`http://maps.google.com/mapfiles/kml/paddle/pause.png`);
            iconsSmall.push(`http://maps.google.com/mapfiles/kml/paddle/pause-lv.png`);
        } else {   
            iconsBig.push(`http://maps.google.com/mapfiles/kml/paddle/${colors[i]}-${shapes[j]}.png`);
            iconsSmall.push(`http://maps.google.com/mapfiles/kml/paddle/${colors[i]}-${shapes[j]}-lv.png`);
        }
    }
}

for (let i = 1; i <= 10; i++) {
    iconsBig.push(`http://maps.google.com/mapfiles/kml/paddle/${i}.png`);
    iconsSmall.push(`http://maps.google.com/mapfiles/kml/paddle/${i}-lv.png`);
}

function shuffle(obj1, obj2) {
    let index = obj1.length;
    let rnd, tmp1, tmp2;
  
    while (index) {
      rnd = Math.floor(Math.random() * index);
      index -= 1;
      tmp1 = obj1[index];
      tmp2 = obj2[index];
      obj1[index] = obj1[rnd];
      obj2[index] = obj2[rnd];
      obj1[rnd] = tmp1;
      obj2[rnd] = tmp2;
    }
}
  
// shuffle(iconsBig, iconsSmall);

const render = (status: Status): any => {
  return <h1>{status}</h1>;
};


let updated = false;
let map;
let marker;
let correctPosition: google.maps.LatLng;
function MyMapComponentEndGame({
  fenway,
  docData
}: {
  fenway: google.maps.LatLngLiteral;
  docData: any;
}) {
  const refMap: any = useRef();

  useEffect(() => {
    if (!updated) {
        map = new window.google.maps.Map(refMap.current, {
            center: fenway,
            zoom: 2,
            panControl: false,
            zoomControl: true,
            fullscreenControl: false,
            streetViewControl: false
        });

        let icon_index = 0;
        let player_number = 1;
        Object.keys(docData['docData']['playersInfo']).sort().forEach(function(player_name) {
            let key = docData['docData']['playersInfo'][player_name];
            for( let i=0; i< Object.keys(key).length; i++ ) {
                let round = key[Object.keys(key).sort()[i]];
                let geoPoint: any = Object.values(round['picking']);
                let lat = geoPoint[0];
                let lng = geoPoint[1];
                let latLngPosition = { lat: parseFloat(lat), lng: parseFloat(lng) };
                let random = Math.floor(Math.random() * iconsBig.length);

                marker = new google.maps.Marker({
                    position: latLngPosition,
                    title:player_name,
                    label: {
                      text: player_name,
                      fontWeight: 'bold'
                    },
                    icon: {
                      url: iconsBig[icon_index],
                      labelOrigin: new window.google.maps.Point(8, -5),
                      scaledSize: new google.maps.Size(40, 40),
                    }
                });
                marker.setMap(map);

                
                Object.keys(docData['docData']['playersInfo']).sort().forEach(function(new_player_name) {
                    if (new_player_name != player_name) {
                        let key_new = docData['docData']['playersInfo'][new_player_name];
                        let guesser_round = key_new[Object.keys(key_new).sort()[i]];
                        let geoPoint: any = Object.values(guesser_round['guessings'][player_number]);
                        let lat = geoPoint[0];
                        let lng = geoPoint[1];
                        let latLngPosition = { lat: parseFloat(lat), lng: parseFloat(lng) };

                        marker = new google.maps.Marker({
                            position: latLngPosition,
                            title:new_player_name,
                            label: {
                              text: new_player_name,
                              fontWeight: 'bold'
                            },
                            icon: {
                              url: iconsSmall[icon_index],
                              labelOrigin: new window.google.maps.Point(8, -5)
                            }
                        });
                        marker.setMap(map);
                    }
                });
                icon_index++;
            }
            player_number++;
        });
        updated = true;
    }
  });

  let player_number = 1;

  function playAgain() {
    window.location.href = '/GeoDuel/play';
  }

  return (
    <div id="mapsContainer">
      <div ref={refMap} id="mapResult" />
      {
        Object.keys(docData['docData']['playersInfo']).sort().map(function(player_name) {
            var playerScore = 0;
            var playerDistance = 0;
            var guessingsCount = 0;
            let key = docData['docData']['playersInfo'][player_name];
            for( let i=0; i<Object.keys(key).length; i++ ) {
                let round = key[Object.keys(key).sort()[i]];
                for( let j=0; j<Object.keys(round).length; j++ ) {
                    if (key != docData['docData']['playersInfo'][Object.keys(docData['docData']['playersInfo']).sort()[j]]){
                        let geoPoint: any = Object.values(round['guessings'][`${j + 1}`]);
                        let lat = geoPoint[0];
                        let lng = geoPoint[1];
                        let selectedPosition = { lat: parseFloat(lat), lng: parseFloat(lng) };

                        let playerPicker = docData['docData']['playersInfo'][Object.keys(docData['docData']['playersInfo']).sort()[j]];
                        let pick: any = Object.values(playerPicker[Object.keys(playerPicker).sort()[i]]['picking']);
                        let latPick = pick[0];
                        let lngPick = pick[1];
                        let pickedPosition = { lat: parseFloat(latPick), lng: parseFloat(lngPick) };

                        let distanceFromCorrectPlace = window.google.maps.geometry.spherical.computeDistanceBetween(pickedPosition, selectedPosition);
                        let score = 10000 - ((Math.log(distanceFromCorrectPlace) / Math.log(2)) * 400);
                        if (score < 0) {
                            score = 0;
                        }
                        else if (score > 10000) {
                            score = 10000;
                        }
                        playerScore += score;
                        playerDistance += distanceFromCorrectPlace;
                        guessingsCount++;
                    }

                }
            }
            let meanDistance = playerDistance / guessingsCount;
            let meanScore = playerScore / guessingsCount;
            return (<h2>{player_name}: {Math.round(playerScore)} Points! ------ {Math.round(playerDistance / 1000)}Km of error in total! ------ Average score: {Math.round(meanScore)} ------ Average distance error: {Math.round(meanDistance / 1000)}Km ({Math.round(meanDistance)}m)</h2>)
        })
        }
        <button className="ready" onClick={playAgain!}>Play another Game!</button>
    </div>
  );
}

export function RenderMapEndGame(docData) {
  const fenway = { lat: +10.55542202732198, lng: -54.54408893196694 };
  return (
    <div>
    <Wrapper apiKey="AIzaSyDaopI6hRGw8i5DlhA5lAiCIuZ-qoBH3AE" render={render} libraries={["geometry"]}>
      <MyMapComponentEndGame fenway={fenway} docData={docData}/>
    </Wrapper>
    </div>
  );
}