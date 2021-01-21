# Multiple Node Apps in Minikube

## Requirements

* Docker
* Minikube
* Node.js
* Yarn

## About the Applications

There are two applications in this directory: heroes and villains. Both are simple Node.js servers that have a couple endpoints. Some of these endpoints make requests to the other application to get information. Nothing fancy going on here, just wanted to setup a situation where there are two applications that talk to each other.

### Building the Applications

Both applications can be built and run the same way. None of these ways currently provide a nice dev environment as this repo is not really meant for developing these applications, it's more about the Kubernetes stuff.
* If you just want to run the code and don't care about anything else, run `yarn start`
* If you want to run the code via Docker, run `yarn start-docker`
* If you want to build the application image, run `yarn build-image`. The image that is build will have the same name as the directory the application is in (heroes and villains)

## Incorporating Kubernetes via Minikube

### Getting Started with Minikube
It's simple to get minikube running once it's installed, just run `minikube start`

### Setting Up the Kubernetes Objects
> All instructions are relative to root director of repo

1. Build the images
```bash
$ cd heroes && yarn build-image && cd ../
$ cd villains && yarn build-image && cd ../
```
2. Deploy the images to your account on docker hub (use your namespace and appropriate version numbers; will need to update *-deployment.yml files to match)
```bash
$ # tag the images created in step 1
$ docker tag heroes jasondippel/node-heroes-app:latest
$ docker tag villains jasondippel/node-villains-app:latest
$ # log in to docker with your docker id
$ docker login
$ # push the image to docker hub
$ docker push jasondippel/node-heroes-app:latest
$ docker push jasondippel/node-villains-app:latest
```
3. Create the villians and heroes deployments and corresponding services
```bash
$ kubectl create -f villains-deployment.yml
$ kubectl create -f heroes-deployment.yml
```
4. Expose external IP to heroes-sevice (required since we're running in Minikube)
```bash
$ # minikube has a built-in command for doing this
$ minikube service --url heroes-service
```
5. Should be able to curl heroes service now on url provided by command in step 4
```bash
$ # Your url is most likely different, this is just an example
$ curl http://127.0.0.1:52784/heroes
```

## APIs

### heroes

#### GET /heroes
Returns a list of the heroes and their current state

#### POST /assignment
Assigns a hero to a villain and marks them as busy. Also updates the villains service to reflect assignment.

Request Body:
```json
{
  "heroId": 1,
  "villainId": 1
}
```

#### POST /clear-assignment
Clears a heroes assignment and sets busy to false. Also updates the villains service to clear villain assignment.

Request Body:
```json
{
  "heroId": 1,
}
```

### villains

#### GET /villains
Returns a list of the villains and their current state

#### POST /assignment
Assigns a villain to a hero and marks them as busy

Request Body:
```json
{
  "heroId": 1,
  "villainId": 1
}
```

#### POST /clear-assignment
Clears a villains assignment and sets busy to false

Request Body:
```json
{
  "heroId": 1,
}
```
