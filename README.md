# relayboard_portal
Portal, used to remotely monitor and control relay board servers.

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
apt-get install nginx
echo 'deb http://ftp.debian.org/debian jessie-backports main' >> /etc/apt/sources.list
apt-get update
apt-get install certbot -t jessie-backports


