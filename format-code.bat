cd .\Back-End
echo "Starting BE formatting"
npm run format && START /wait npm run lint && npm run build

echo "Starting FE formatting"
cd ..\Front-End
npm run format

echo "Uploading formatted code"
cd ..\
git config --global user.name "${{ env.CI_COMMIT_AUTHOR }}"
git config --global user.email "vinzy@electems.com"
git commit -a -m "${{ env.CI_COMMIT_MESSAGE }}"
git push
