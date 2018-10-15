
const Constants = {
  network: {
    blockchain: 'eos',
    protocol: 'https',
    host: 'nodes.get-scatter.com',
    port: 443,
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    code: 'eosbrandgame',
    currency: {
      EOS: {
        code: 'eosio.token',
        symbol: {
          name: 'EOS',
          precision: 4
        }
      }
    },
  }
};


/*
const Constants = {
  network: {
    blockchain: 'eos',
    protocol: 'http',
    host: '127.0.0.1',
    port: 8888,
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
    code: 'admin',
        currency: {
      EOS: {
        code: 'eosio.token',
        relation: 1,
        symbol: {
          name: 'EOS',
          precision: 4
        }
      }
    },
  },
};
*/

export { Constants };
