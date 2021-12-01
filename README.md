## 简介    
本项目为 Dapp Learning 项目实战产品  

## 操作流程  
- 安装依赖  
```shell
yarn
```

- 上传图片到 IPFS 
```shell
yarn upload
```

- 配置私钥  
```shell
cd packages/hardhat
cp .env.example .env

## 修改 .env 内容，在其中填入 private_key
PRIVATE_KEY=xxxxxxxxxxxxxxxx
```

- 部署合约  
部署 DappLearningCollectible 合约, 并发布 ABI 到 react-app/src/contracts 下面.  
目前合约自动部署在 rinkeby 测试网路上, 如果需要部署到其他的测试网路, 需要需改 hardhat/hardhat.config.js 中的 defaultNetwork
```shell
yarn deploy 
```

- 部署 subgraph  
