import React, { useEffect, useRef, ReactElement } from "react";
import ReactDOM from "react-dom";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

const render = (status: Status): any => {
  return <h1>{status}</h1>;
};

function MyMapComponent({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}) {
  const ref: any = useRef();

  useEffect(() => {
    new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });
  });

  return <div ref={ref} id="map" />;
}


function MyStreetViewComponent({
  position,
  heading,
  pitch,
}: {
  position: google.maps.LatLngLiteral;
  heading: number;
  pitch: number;
}) {
  const ref: any = useRef();

  useEffect(() => {
    new window.google.maps.StreetViewPanorama(ref.current, {
      position: position,
      pov: {
        heading: heading,
        pitch: pitch,
      }
    });
  });

  return <div ref={ref} id="pano" />;
}

function MyMapStreetComponent({
  fenway,
}: {
  fenway: google.maps.LatLngLiteral;
}) {
  const refMap: any = useRef();
  const refPano: any = useRef();

  useEffect(() => {
    const map = new window.google.maps.Map(refMap.current, {
      center: fenway,
      zoom: 14
    });
    const panorama = new window.google.maps.StreetViewPanorama(refPano.current, {
      position: fenway,
      pov: {
        heading: 34,
        pitch: 10,
      }
    });
    map.setStreetView(panorama);
  });

  return (
    <div id="mapsContainer">
      <div ref={refMap} id="map" />
      <div ref={refPano} id="pano" />
    </div>
  );
}

export function RenderMap() {
  const center = { lat: -34.397, lng: 150.644 };
  const zoom = 4;
  return (
    <Wrapper apiKey="AIzaSyDaopI6hRGw8i5DlhA5lAiCIuZ-qoBH3AE" render={render}>
      <MyMapComponent center={center} zoom={zoom} />
    </Wrapper>
  );
}

export function RenderStreetView() {
  const position = { lat: 42.345573, lng: -71.098326 };
  const heading = 34;
  const pitch = 10;
  return (
    <Wrapper apiKey="AIzaSyDaopI6hRGw8i5DlhA5lAiCIuZ-qoBH3AE" render={render}>
      <MyStreetViewComponent position={position} heading={heading} pitch={pitch} />
    </Wrapper>
  );
}

export function RenderMapStreet() {
  const fenway = { lat: -34.397, lng: 150.644 };
  return (
    <Wrapper apiKey="AIzaSyDaopI6hRGw8i5DlhA5lAiCIuZ-qoBH3AE" render={render}>
      <MyMapStreetComponent fenway={fenway}/>
    </Wrapper>
  );
}