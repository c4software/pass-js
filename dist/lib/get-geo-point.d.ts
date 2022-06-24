/**
 * Returns normalized geo point object from geoJSON, {lat, lng} or {lattitude,longutude,altitude}
 *
 * @param {number[] | { lat: number, lng: number, alt?: number } | { longitude: number, latitude: number, altitude?: number }} point
 * @returns {{ longitude: number, latitude: number, altitude?: number }}
 * @throws on unknown point format
 */
export declare function getGeoPoint(point: readonly number[] | {
    lat: number;
    lng: number;
    alt?: number;
} | {
    longitude: number;
    latitude: number;
} & ({
    altitude?: number;
} | {
    elevation?: number;
})): {
    longitude: number;
    latitude: number;
    altitude?: number;
};
