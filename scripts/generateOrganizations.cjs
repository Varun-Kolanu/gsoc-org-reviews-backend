const fs = require('fs');
const response = require('../assets/response.json');

async function generateOrgs() {
    try {
        const orgs = response.map(org => {
            return {
                name: org.name,
                image_url: org.image_url,
                image_background_color: org.image_background_color
            }
        })
        fs.writeFileSync('../assets/organizations.json', JSON.stringify(orgs, null, 2));
        console.log('JSON file has been saved!');
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
}

generateOrgs();