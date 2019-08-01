#!/bin/bash
cd "$(dirname "$0")"

systemctl stop nginx
usermod -l www-data nginx | /bin/true
groupmod -n www-data nginx | /bin/true
mkdir -p /etc/nginx/sites-enabled
yes | cp -f configuration/nginx.conf configuration/ssl.conf /etc/nginx
yes | cp -f configuration/sites-enabled/* /etc/nginx/sites-enabled

chmod +x ./cert/generate.sh
./cert/generate.sh

yes | cp -f public/* /var/www/html/

nginx -t && systemctl start nginx
setsebool httpd_can_network_connect on -P | /bin/true
