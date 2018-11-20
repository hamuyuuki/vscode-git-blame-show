FROM node:11.1

RUN npm install -g yo generator-code

WORKDIR /vscode-git-blame-show