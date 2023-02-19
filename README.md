# SimpleAPIGateway
Simple API gateway server. The purpose of this server is to provide the country name associated with an IP address. The server will expose one endpoint to the user, and will rely on vendors that provide free API for IP location.

##### Here are the terminal commands you need to run the project locally:
1) Install the dependencies of the project:
```terminal
npm install
```

2) Start the project:
```terminal
npm start
```

3) For JWT Athentication, Setup the header with key:**token** and value: **eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGh1c2hhYW50aCBCYWxhIn0.qPB4HDs7OSA0Fh_kcHP-PY-D24xl5e5eykupQnx21gE**

![image](https://user-images.githubusercontent.com/10079196/219933491-32565880-146d-4201-a75e-9e675e75a40f.png)

4) Setup up the Query Params with key:**ip** and value:**37.19.213.55** (Any IP)
![image](https://user-images.githubusercontent.com/10079196/219933571-233922b5-2519-4790-874e-9cafc3e74f3a.png)

url: http://localhost:8080/ip/
