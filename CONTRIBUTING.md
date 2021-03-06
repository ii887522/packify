## Table of Contents
- [Coding Style](https://github.com/ii887522/packify/blob/master/CONTRIBUTING.md#coding-style)
- [Prerequisites](https://github.com/ii887522/packify/blob/master/CONTRIBUTING.md#prerequisites)
- [Build custom-node docker image](https://github.com/ii887522/packify/blob/master/CONTRIBUTING.md#build-custom-node-docker-image)
- [Install dependencies, build and test project](https://github.com/ii887522/packify/blob/master/CONTRIBUTING.md#install-dependencies-build-and-test-project)
- [Deploy project](https://github.com/ii887522/packify/blob/master/CONTRIBUTING.md#deploy-project)

## Coding Style
This project follows [Javascript Standard Style](https://standardjs.com/). Please familiarize yourself with the rules provided in the coding style and
make sure all the proposed code changes in your commits are conforming to the style before making a merge request. You can also make use of
StandardJS - Javascript Standard Style which is a [Visual Studio Code](https://code.visualstudio.com/) plugin and `test` command under the
[Install dependencies, build and test project](https://github.com/ii887522/packify/blob/master/CONTRIBUTING.md#install-dependencies-build-and-test-project) section to support you.

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) using Linux containers
- [Visual Studio Code](https://code.visualstudio.com/)
  - Docker
  - EditorConfig for VS Code
  - Markdown All in One
  - Remote - WSL
  - StandardJS - Javascript Standard Style
  - YAML

## Build custom-node docker image

### For Windows:
```sh
cd custom-node
build
cd ..
```

### For Linux:
```sh
cd custom-node
sh build.sh
cd ..
```
<br />

## Install dependencies, build and test project

### For Windows:
```sh
test
```

### For Linux:
``` sh
sh test.sh
```
<br />

## Deploy project

### For Windows:
```sh
deploy
```

### For Linux:
```sh
sh deploy.sh
```
