export const mapBounds = (map) => {
    const bounds = map?.getBounds().toJSON();
    // console.log("bounds after:", bounds);
    const { north, east, south, west } = bounds;
    return {
      northeast: { lat: north, lng: east },
      southwest: { lat: south, lng: west },
    };
  };
  