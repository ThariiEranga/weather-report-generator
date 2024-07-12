const axios = require('axios');
const { googleMapsApiKey } = require('./API-config');

const getCityFromCoordinates = async (latitude, longitude, retries = 1, delay = 1000) => {
    let attempt = 0;
    console.log(googleMapsApiKey)
    while (attempt < retries) {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`);
            const results = response.data.results;

            if (results.length === 0) {
                throw new Error('No results found for the given coordinates.');
            }

            const addressComponents = results[0].address_components;
            const cityComponent = addressComponents.find(component => component.types.includes('locality'));

            if (!cityComponent) {
                throw new Error('No city found for the given coordinates.');
            }

            return cityComponent.long_name;
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed: ${error.message}`);
            attempt++;
            if (attempt < retries) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw new Error('Max retries reached. Unable to get city from coordinates.');
            }
        }
    }
};

module.exports = { getCityFromCoordinates };