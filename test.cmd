docker run --rm --name packify_tester -w /packify -v %CD%:/packify packify-custom-node ncu -u && npm install && npx tsc && npm test
