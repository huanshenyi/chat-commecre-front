# chat-commecre-front

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/huanshenyi/chat-commecre-front)

```
# プロジェクトルートで実行
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
export REPOSITORY_NAME=chat-commerce-app
export REGISTRY_NAME=$AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com
export COMMIT_HASH=$(git rev-parse --short HEAD)
docker buildx build --no-cache \
  --platform=linux/x86_64 \
  -t $COMMIT_HASH \
  -f Dockerfile .
docker tag $COMMIT_HASH \
  $REGISTRY_NAME/$REPOSITORY_NAME:$COMMIT_HASH

aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin $REGISTRY_NAME
docker push "$AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/$REPOSITORY_NAME:$COMMIT_HASH"
```
