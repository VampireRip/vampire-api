#!/bin/bash
cd "$(dirname "$0")"

systemctl stop nginx
usermod -l www-data nginx | /bin/true
groupmod -n www-data nginx | /bin/true
mkdir -p /etc/nginx/sites-enabled
cp configuration/nginx.conf configuration/ssl.conf /etc/nginx
cp configuration/api.vampire.rip configuration/vampire.rip configuration/default /etc/nginx/sites-enabled

nginx -t && systemctl start nginx
