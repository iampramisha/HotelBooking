"use client";

import React from "react";

interface RoomMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

const RoomMap: React.FC<RoomMapProps> = ({ latitude, longitude, address }) => {
  const delta = 0.01;
  const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;

  return (
    <div
      className="map-container w-full rounded-lg overflow-hidden"
      style={{ height: "300px" }}
    >
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`}
        title={`Map for ${address}`}
      ></iframe>
    </div>
  );
};

export default RoomMap;
