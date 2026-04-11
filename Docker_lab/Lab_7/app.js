const http = require("http");

const server = http.createServer((req, res) => {
    res.write("Hello from Backend Container");
    res.end();
});

server.listen(5000, () => {
    console.log("Backend running on port 5000");
});