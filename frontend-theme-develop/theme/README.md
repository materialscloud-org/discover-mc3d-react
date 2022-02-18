## Usage

To use materials cloud global theme extended from 
bootstap theme (bootstrap-sass: ~3.3.3) you need to add:

```html
<link rel="stylesheet" href="mcloud_theme.min.css" />
```



## Developers Guide

### Install packages

#### Ubuntu 14.04

Install nodejs and npm:

```bash
sudo apt-get install nodejs npm
```

> **Note:** If you get errors like **"E: Unable to correct problems, you have held broken packages**", install the packages from source distribution. 

Install ruby gems for SaSS
```bash
sudo gem install sass bundler
```

Install bower
```bash
sudo npm install --global bower
```

#### OSX

Download and Install node and npm from OSX [installer](https://nodejs.org/en/download/)

Update npm
```bash
sudo npm install -g npm
```

Install bower:
```bash
sudo npm install -g bower
```

Install ruby gems for SaSS
```bash
sudo gem install sass bundler
```


### Building

```bash
git clone git@github.com:materialscloud-org/frontend-theme.git
cd frontend-theme
sudo bundle install
npm install && bower install
```


#### Start the server to watch and compile sass file(s) into css file with command:

```bash
sass --watch sass/theme.scss:mcloud_theme.css
```

#### You can minify updated mcloud_theme.css file using command:

```bash
minify mcloud_theme.css > mcloud_theme.min.css
```