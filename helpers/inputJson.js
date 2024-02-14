function jsonStringify(inputJson) {
    try {
        // Convert the JSON object to a string
        const jsonString = JSON.stringify(inputJson);
        return jsonString;
    } catch (error) {
        // Handle any errors that occur during the stringification process
        console.error('Error converting JSON to string:', error);
        return null;
    }
}

module.exports = jsonStringify;

// Example usage:
// const jsonObject = { name: 'John', age: 30, city: 'New York' };
// const jsonString = jsonStringify(jsonObject);
// console.log(jsonString);
