import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputFilePath = path.join(__dirname, '../assets/organizations.json');

export function tryCatch(func) {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    };
}

export function userIsFromIITBhu(email) {
    const domain = email.split("@")[1].trim();
    return domain === "itbhu.ac.in" || domain === "iitbhu.ac.in";
}

export function getOrganizations() {
    try {
        const data = fs.readFileSync(inputFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading JSON from ${filePath}:`, err.message);
        return null;
    }
}