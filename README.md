## 简介    
本项目为 Dapp Learning 项目实战产品  

## 操作流程  
- 安装依赖  
```shell
cd Dapp-Learning-WaterMargin
yarn
```

- 上传图片到 IPFS 
```shell
cd Dapp-Learning-WaterMargin
yarn upload
```

- 配置私钥  
```shell
cd packages/hardhat
cp .env.example .env

## 修改 .env 内容，在其中填入 private_key
PRIVATE_KEY=xxxxxxxxxxxxxxxx
```

- 设置 MerkleList  
因为 DappLearningCollectible 使用了 Merkle 空投方式, 在部署前需要设置空投的地址, 一遍后续进行测试使用.
修改 packages/hardhat/scripts/addressList.json 文件, 在其中设置需要空投的地址 ( 即测试地址 )

- 部署合约  
目前主合约为 DappLearningCollectible, 拍卖合约使用 AuctionFixedPrice.  
执行部署命令后, 合约自动部署在 rinkeby 测试网路上, 并发布 ABI 到 react-app/src/contracts 下面. 如果需要部署到其他的测试网路, 需要需改 hardhat/hardhat.config.js 中的 defaultNetwork.  packages/hardhat/test/MerkleDrop.test.js 为 Merkle 空投的测试脚本
```shell
cd Dapp-Learning-WaterMargin
yarn deploy 
```

- 部署 subgraph  
通过 thegraph 部署的 subgrpah 只能部署在主网 和 rinkeby 网络, 如果需要使用其他的网络, 则需要自己搭建 graph 服务. 下面讲解下如何通过 thegraph 部署 subgraph
    - 创建 subgraph   
    在 thegraph 官网上创建一个 subgraph, 假设 subgraph 名字为 DappLearningCollectible

    - 安装 graph-cli 
    ```shell
    yarn global add @graphprotocol/graph-cli
    ```

    - 初始化 subgraph
    ```shell
    graph init --studio DappLearningCollectible

    ## 在选择网络的时候选择 rinkeby
    ```

    - subgraph 认证  
    ```shell
    ## 根据官网上 subgraph 操作的具体提示进行修改
    graph auth  --studio fc72b2●●●●●●●●476024
    ```

    - 复制并修改配置文件  
    复制 dapp-learning-test/src/mapping.ts , dapp-learning-test/schema.graphql , dapp-learning-test/subgraph.yaml 到对应的目录下, 同时修改如下配置 
    ```shell
    ## subgraph.yaml 中的 address 和 startBlock
    source:
      address: "0xe1f5CCe0e39E6F3Fec75D29BCb32821A98d8b432"
      abi: DappLearningCollectible
      startBlock: 9737148

    ## mappting.ts 中的 auctionAddr
    const auctionAddr = Address.fromHexString(
        "0xAE8FF5372fE7beb7eBC515ebe19670afd9045bf0"
    );
    ```

    - 编译文件 
    ```shell
    cd DappLearningCollectible
    graph codegen && graph build
    ```

    - 部署文件 
    ```shell
    graph deploy --studio DappLearningCollectible
    ```
