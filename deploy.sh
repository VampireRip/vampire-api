#!/bin/bash

## use utf8 by default
tee -a ~/.bashrc <<< "export LC_ALL=en_US.utf8"
tee -a ~/.bashrc <<< "export LANG=en_US.utf8"

## . match hidden files by default
tee -a ~/.bashrc <<< "shopt -s dotglob"

source ~/.bashrc

awk -F= '/^NAME/{print $2}' /etc/os-release | grep -qi ubuntu;UBUNTU=$?

if (( $UBUNTU == 0)); then
  apt-get update
  apt-get install -y build-essential
else
  yum update
  yum groupinstall -y 'Development Tools'
fi

HOSTNAME="info.vampire.rip"

# set hostname
sudo hostname $HOSTNAME
tee /etc/hostname <<< $HOSTNAME
# if [ -f "/etc/cloud/cloud.cfg" ];
#   sed -i 's/#\?\(preserve_hostname\s*\).*$/\1 true/' /etc/cloud/cloud.cfg

## get a random port number [6000, 7000)
PORT=$RANDOM;let "PORT %= 1000"; PORT=$(($PORT+6000))

## remove ufw on ubuntu and install firewalld
systemctl stop iptables
systemctl mask iptables
if (( $UBUNTU == 0)); then
  systemctl stop iptables
  systemctl mask iptables
  apt-get remove -y ufw
  apt-get install -y firewalld
else
  yum install -y firewalld
  yum install -y policycoreutils-python
  semanage port -a -t ssh_port_t -p tcp $PORT
fi
systemctl stop firewalld
systemctl disable firewalld

echo "the ssh port is $PORT"

## pre-open it
cp /usr/lib/firewalld/services/ssh.xml /etc/firewalld/services/ssh.xml
sed -i "s/\\(port=\"\\)[[:digit:]]\\+/\\1$PORT/" /etc/firewalld/services/ssh.xml

## edit ssh configuration
sed -i "s/#\\?\\(Port\\s*\\).*$/\\1 $PORT/" /etc/ssh/sshd_config
sed -i 's/#\?\(ClientAliveInterval\s*\).*$/\1 120/' /etc/ssh/sshd_config
sed -i 's/#\?\(ClientAliveCountMax\s*\).*$/\1 30/' /etc/ssh/sshd_config
sed -i 's/#\?\(PasswordAuthentication\s*\).*$/\1 no/' /etc/ssh/sshd_config
sed -i 's/#\?\(PermitRootLogin\s*\).*$/\1 yes/' /etc/ssh/sshd_config

## assign ssh public key (vampire's public key)
mkdir -p /root/.ssh
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDEmRWB4Kf3iM8IsikHBd81u4E3/0p3J7LOxPtHt6XG8yWzTwOp8SzKHMf8sj+ABeAIRZIFDf4FCKghf5Pqa6BUgxyKcvmwpSC7kMQ79kUq0jnV7WvtoH9d4XpmuPhjJG9nPWuseRQMXF/HEYU5bMZipCoFrk9C8Mtwr1iJ1K3AQ67URtAZLZR2j2wYcxQrg2ZKhQSLxv5/DhLv9bnMYwEKesm/4r0+vuERcf5xxqNsLnRH/M0I0vDluWfshSQICgVAY2l3rFAzlhJM5CzOT6H8KDU47nwlIWk/ubOBBXJy5Pv4oIp0dSQINfFCxlaqSClTNGUkOfVEwfvPb5U3QyTFsILOBgR0WgZzsngTHPkvu5IgbUUmU7lYMEuLH36bN1w4P+WB+ivfrFqynUAyRqDL20qPBzn2vX/t42oNcEFlf5UgFfZr17JbPHydEYNvpUYlsamV5BZ0ASqMJq9XW8C23UNt/aSNCGIi9Sgs7TJXjfbr8suZ5i5OyxGtTvFq3GRJl+oF9PQrorbSxBqtRSQr3iut+xKvHq8kd15mzmzVZ5Dx6bcDUnsbeIgAtxoF1yieaGUq/jDBcA5EEyzKQ1Om061CGE5xmbOjDgKz2uITUOzbNv45oQbW9p3OmDg+23PuKiOnR7Nb3Ho+bKXpVHwS+dEok7JYq1kn0Blq36sqqw== sunrisefox@vampire.rip" | tee /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys

systemctl restart sshd

## install docker
curl -fsSL get.docker.com | CHANNEL=test sh

## install node
if (( $UBUNTU == 0)); then
  apt-get install -y curl
  curl -sL https://deb.nodesource.com/setup_12.x | bash -
  apt-get install -y nodejs
else
  curl -sL https://rpm.nodesource.com/setup_12.x | bash -
  yum install -y nodejs
fi

## enable bbr
if (( $UBUNTU != 0)); then
  rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
  yum install -y https://www.elrepo.org/elrepo-release-7.0-4.el7.elrepo.noarch.rpm
  yum --enablerepo=elrepo-kernel -y install kernel-ml
  grub2-set-default 0
  grub2-mkconfig -o /boot/grub2/grub.cfg
fi
echo "net.core.default_qdisc=fq" >> /etc/sysctl.d/01network.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.d/01network.conf
sysctl --system

## install nginx
if (( $UBUNTU == 0)); then
  apt-get install -y nginx
else
  yum install -y epel-release
  yum install -y nginx
fi

systemctl start nginx
systemctl enable nginx

## vampire default page
mkdir -p /var/www/html

## pm2
npm i pm2 -g
pm2 startup

## clone vampire-api and run init
git clone https://github.com/vampire-rip/vampire-api /var/www/api.vampire.rip
cd /var/www/api.vampire.rip
npm i
# npm run init

## todo: vampire init
## edit nginx files

## finalize
echo "ssh port moved to $PORT"
systemctl enable firewalld
systemctl start firewalld
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

if (( $UBUNTU == 0)); then
  apt-get install -y curl
  curl -sL https://deb.nodesource.com/setup_12.x | bash -
  apt-get install -y nodejs
else
  yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
  yum install -y certbot
  yum install -y python2-certbot-dns-cloudflare
fi
