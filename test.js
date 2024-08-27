const readline = require('readline');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error('API_KEY environment variable is not set.');
    process.exit(1);
}

async function multiplyAndPrint() {
    rl.question('Enter the first number: ', (a) => {
        rl.question('Enter the second number: ', (b) => {
            const num1 = parseFloat(a);
            const num2 = parseFloat(b);

            if (isNaN(num1) || isNaN(num2)) {
                console.log('Invalid input. Please enter numbers only.');
                rl.close();
                return;
            }

            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/multiply',
                method: 'POST',
                headers: {'x-api-key': apiKey, 'Content-Type': 'application/json'},
            };

            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        if (res.statusCode === 200) {
                            console.log(`Result of ${num1} * ${num2}: ${result.result}`);
                        } else {
                            console.error(`Error: ${result.error}`);
                        }
                    } catch (error) {
                        console.error('Error parsing response:', error);
                    } finally {
                        rl.question('Do you want to perform another multiplication? (yes/no): ', (answer) => {
                            if (answer.toLowerCase() !== 'yes') {
                                rl.close();
                            } else {
                                multiplyAndPrint();
                            }
                        });
                    }
                });
            });

            req.on('error', (error) => console.error('Error making request:', error));
            req.write(JSON.stringify({a: num1, b: num2}));
            req.end();
        });
    });
}

multiplyAndPrint();
