## 简介    
本项目为 Dapp Learning 项目实战产品  

## 操作流程  
- 安装依赖  
```shell
cd Dapp-Learning-WaterMargin
yarn
```

- 配置环境变量  
```shell
cd packages/hardhat
cp .env.example .env

## 修改 .env 内容，在其中填入 private_key, Infura ipfs 的 PROJECT_ID 和 PROJECT_SECRET
PRIVATE_KEY=xxxxxxxxxxxxxxxx
PROJECT_ID=yyyy
PROJECT_SECRET=ZZZZ
```

- 上传图片到 IPFS 
```shell
cd Dapp-Learning-WaterMargin
yarn upload
```

- 设置 MerkleList  
因为 DappLearningCollectible 使用了 Merkle 空投方式, 在部署前需要设置空投的地址, 以便后续进行测试使用.  
修改 packages/hardhat/scripts/addressList.json 文件, 在其中设置需要空投的地址

- 部署合约  
目前主合约为 DappLearningCollectible, 拍卖合约使用 AuctionFixedPrice.  
执行部署命令后, 合约自动部署在 matic 测试网路上, 并发布 ABI 到 react-app/src/contracts 下面. 如果需要部署到其他的测试网路, 需要需改 hardhat/hardhat.config.js 中的 defaultNetwork.  packages/hardhat/test/MerkleDrop.test.js 为 Merkle 空投的测试脚本
```shell
cd Dapp-Learning-WaterMargin
yarn deploy 
```

- 替换 WETH 地址和 addressList.json
当前竞拍的所使用的标的资产是 ERC20, 为了方便, 同时能适配其他的网络, 需要进行 WETH 地址的替换.  
执行如下 replace 命令, 即可替换 react-app/src/contracts/WETH.address.js 中 WETH  的地址, 以及 react-app/src/utils/addressList.json 文件
```shell
cd Dapp-Learning-WaterMargin
yarn replace 
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

- 获取 graph URL  
graph 部署成功后, 可以得到如下的信息.  
```shell
Subgraph endpoints:
Queries (HTTP):     https://api.studio.thegraph.com/query/1542/dapp-learning-test/v0.1.0
Subscriptions (WS): https://api.studio.thegraph.com/query/1542/dapp-learning-test/v0.1.0
```

- 复制环境变量文件  
```shell
cd react
cp .env.example .env

## 然后在其中配置 REACT_APP_PROVIDER 和 REACT_APP_GRAPHQL, 其中 REACT_APP_GRAPHQL 值为上一步 graph 部署成功后显示的值
REACT_APP_PROVIDER
REACT_APP_GRAPHQL
```

- 启动 react   
```
yarn start
```

- Mint NFT 
只有在 packages/hardhat/scripts/addressList.json 文件中的账户地址才能进行 Mint 操作.


- 拍卖  
查看 Auction 合约中的 createTokenAuction 方法, 即拍卖方法, 可以发现其中调用了 IERC721(_nft).safeTransferFrom(owner, address(this), _tokenId), 即用户在执行拍卖前需要对 Auction 合约进行  NFT 的 approve 授权
```
function createTokenAuction(
        address _nft,
        uint256 _tokenId,
        address _tokenAddress,
        uint256 _price,
        uint256 _duration
    ) external {
        require(msg.sender != address(0));
        require(_nft != address(0));
        require(_price > 0);
        require(_duration > 0);
        auctionDetails memory _auction = auctionDetails({
        seller: msg.sender,
        price: _price,
        duration: _duration,
        tokenAddress: _tokenAddress,
        isActive: true
        });
        address owner = msg.sender;
        IERC721(_nft).safeTransferFrom(owner, address(this), _tokenId);
        tokenToAuction[_nft][_tokenId] = _auction;

        emit StartAuction(owner, _tokenId, _price, _duration);
    }
```

- 购买  
同理在 purchaseNFTToken 接口, 即购买接口中, 会调用 IERC20(auction.tokenAddress).transferFrom(msg.sender,seller,price) , 即用户需要对 Auction 合约进行 ERC20 的 approve 授权, 这里是调用 WETH 的 approve 对 Auction 合约进行授权 
```
function purchaseNFTToken(address _nft, uint256 _tokenId) external {
        auctionDetails storage auction = tokenToAuction[_nft][_tokenId];
        require(auction.duration > block.timestamp, "Deadline already passed");
        //require(auction.seller == msg.sender);
        require(auction.isActive);
        auction.isActive = false;
        address seller = auction.seller;
        uint price = auction.price;
        require(IERC20(auction.tokenAddress).transferFrom(msg.sender,seller,price), "erc 20 transfer failed!");

        IERC721(_nft).safeTransferFrom(address(this),msg.sender , _tokenId);

        emit AuctionEnd(seller, msg.sender, _tokenId, price, auction.duration);
    }
```

## deploy address

polygon mainnet

- Auction 0x9089F4F3a19bdF13816e7c940d9376De32CFE2Fd
- NFT 0xFD5f96fcFB68E80AcfEDd89841d9A354B93f53af
- WEH 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270