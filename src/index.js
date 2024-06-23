const express = require('express');
const Error = require('./models/errorLog');
const PostOffice = require('./models/postOffice');
const connectDb = require('./utils/db');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const startPincode = process.env.StartPincode;

app.get('/start', async (req, res) => {
    try {
        await main();
        res.send("Process started successfully!");
    } catch (error) {
        res.status(500).send("Error starting the process");
    }
});

async function main() {
    try {
        await connectDb();
        console.log("Connection to database is successful");
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        let i = startPincode;
        let counter = 0;
        while (i <= 136200) {
            await getPostalData(i);
            i++;
            counter++;

            if (counter >= 180 && counter <= 185) {
                counter = 0;  // Reset the counter after hitting the delay range
                const randomDelay = Math.floor(Math.random() * 1000) + 15000;  // random delay between 15000ms and 16000ms
                console.log("Delayed request");
                await delay(randomDelay);
            }
        }
        console.log("Completed");
    } catch (error) {
        console.log('Something went wrong:', error);
        throw error;
    }
}

async function getPostalData(pincode) {
    try {
        const res = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        if (res.data && res.data[0].Status == 'Success') {
            const data = res.data[0].PostOffice;
            for (const el of data) {
                const existingData = await PostOffice.findOne({ name: el.Name, pincode: el.Pincode });
                if (!existingData) {
                    const postOffice = new PostOffice({
                        name: el.Name,
                        pincode: el.Pincode,
                        circle: el.Circle,
                        district: el.District,
                        division: el.Division,
                        region: el.Region,
                        state: el.State,
                        country: el.Country,
                    });
                    await postOffice.save();
                } else {
                    console.log('Already exists', pincode);
                }
            }
        } else {
            console.log("No data found for", pincode);
        }
    } catch (error) {
        const newError = new Error({
            date: new Date().toLocaleString('en-IN', { timeZone: 'IST' }),
            pincode: pincode,
            error: error
        });
        await newError.save();
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
