docker run --rm --name packify_installer -w /packify -v %CD%:/packify packify-custom-node ncu -u && npm install
