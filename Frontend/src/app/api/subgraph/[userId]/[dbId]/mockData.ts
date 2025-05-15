// Sample mock data based on the response format
export const mockSubgraphData = {
  factories: [
    {
      id: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
      poolCount: 1635,
      txCount: 831812,
      totalVolumeUSD: "5607013206.0652265101414241245"
    },
    {
      id: "0x1f98431c8ad98523631ae4a59f267346ea31f984",
      poolCount: 3876,
      txCount: 1031558,
      totalVolumeUSD: "11529498233.6622573030947532535"
    }
  ],
  bundles: [
    {
      id: "1",
      maticPriceUSD: "1.4123"
    }
  ],
  pools: [
    {
      id: "0x0000187a7730733b9487e4e52776d3e63273d0c7",
      token0: {
        id: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        symbol: "USDC",
        name: "USD Coin (PoS)"
      },
      token1: {
        id: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        symbol: "USDT",
        name: "Tether USD"
      },
      feeTier: 500,
      liquidity: "3861567696256575",
      sqrtPrice: "1000193470892667736",
      tick: 3,
      volumeUSD: "1146391092.5866243428668073233",
      txCount: "141168"
    },
    {
      id: "0x0000937f85894d3d2a36909ba033e470db9f9433",
      token0: {
        id: "0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4",
        symbol: "stMATIC",
        name: "Staked MATIC"
      },
      token1: {
        id: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        symbol: "WETH",
        name: "Wrapped Ether"
      },
      feeTier: 500,
      liquidity: "84530347647",
      sqrtPrice: "3632821513037164643",
      tick: 174713,
      volumeUSD: "4792773.8987494664751365245",
      txCount: "8954"
    }
  ],
  tokens: [
    {
      id: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      symbol: "WMATIC",
      name: "Wrapped Matic",
      decimals: "18",
      volume: "3271198620.8048206724723749013",
      txCount: "720503"
    },
    {
      id: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      symbol: "USDC",
      name: "USD Coin (PoS)",
      decimals: "6",
      volume: "4621907432.6004275233189870003",
      txCount: "757119"
    }
  ],
  swaps: [
    {
      id: "0x0000187a7730733b9487e4e52776d3e63273d0c7-163575",
      timestamp: "1699963178",
      token0: {
        id: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        symbol: "USDC"
      },
      token1: {
        id: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        symbol: "USDT"
      },
      amountUSD: "41773.1485645312"
    },
    {
      id: "0x0000187a7730733b9487e4e52776d3e63273d0c7-163577",
      timestamp: "1699963394",
      token0: {
        id: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        symbol: "USDC"
      },
      token1: {
        id: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        symbol: "USDT"
      },
      amountUSD: "340.0095595937"
    }
  ]
}; 