# Boodskap IoT Platform Dashboard

### Getting Started
This plugin requires node `>= 6.0.0` and npm `>= 1.4.15` (latest stable is recommended).

```shell
> git clone https://github.com/BoodskapPlatform/platform-dashboard.git
```

Once the repository has been cloned:
```shell
> cd platform-dashboard/
```

### NPM Module Installation

```shell
> npm install
```

## Configuration

### Properties
In `dashboard.properties` file,
```shell
#default property

[server]
port=10000
basepath=
fullpath=http://boodskap.xyz

[boodskap]
web=http://boodskap.xyz/platform
api=http://boodskap.xyz/api
domainkey=

[mqtt]
host=boodskap.xyz
port=80
ssl=false

[google]
analytics.id=
map.key=


```
To change the UI port, update the server property

#### Note
If you are downloading the platform (or) running in our own dedicated server.You may have to change the `boodskap` and `mqtt` property

### Build Properties
Once all the changes done in property file. Execute a command
```shell
> npm run-script build
```
or
```shell
> node build.js
```
#### Output

```shell
***************************************
Boodskap IoT Platform
***************************************
1] Setting server properties success
2] Setting web properties success
Thu Jan 10 2019 14:09:22 GMT+0530 (IST) | Boodskap UI Build Success
Now execute > npm start
```

### How to start the UI node server?

```shell
> npm start
```
or
```shell
> node server.js
```
#### Output

```shell
************************************************************************************
Thu Jan 10 2019 14:11:51 GMT+0530 (IST) | Boodskap IoT Platform Dashboard Portal Listening on 10000
************************************************************************************
```
Open the Browser with this URL: http://boodskap.xyz
