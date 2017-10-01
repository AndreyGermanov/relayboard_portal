# relayboard_portal
Portal, used to remotely monitor and control relay board servers.

![Screenshot](https://raw.githubusercontent.com/AndreyGermanov/relayboard_mobile_client/master/assets/img/screenshot.png)


Install notes for Debian.

Run the following commands under root one by one:

apt-get update

apt-get install nodejs nodejs-legacy npm

npm i -g n

n stable

ln -sf /usr/local/n/versions/node/8.4.0/bin/node /usr/bin/node

ln -sf /usr/local/n/versions/node/8.4.0/bin/npm /usr/bin/npm

npm i -g gulp node-gyp

apt-get install curl

curl https://install.meteor.com/ | sh

cd /opt

git clone https://github.com/AndreyGermanov/relayboard_portal.git

npm i --save babel-runtime





