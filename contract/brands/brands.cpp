#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>

using namespace eosio;
using namespace std;

class brands : public contract
{
  using contract::contract;

public:
  const uint64_t expirationPeriod = 43200; // 12 hours
  const float inflationFactor = 0.4;
  const account_name devAccount = N(estrectopolo);

  struct [[eosio::table]] LastBuyer
  {
    uint64_t id;
    account_name account;
    uint64_t purchasedAt;
    uint64_t primary_key() const { return id; }
    EOSLIB_SERIALIZE(LastBuyer, (id)(account)(purchasedAt));
  };
  typedef multi_index<N(lastbuyer), LastBuyer> lastBuyerIndex;

  struct [[eosio::table]] Game
  {
    uint64_t id;
    uint64_t expiresAt;
    account_name lastBuyer;
    asset pot;
    asset invested;
    uint64_t primary_key() const { return id; }
    EOSLIB_SERIALIZE(Game, (id)(expiresAt)(lastBuyer)(pot)(invested));
  };
  typedef multi_index<N(game), Game> gameIndex;

  struct [[eosio::table]] Account
  {
    account_name account;
    asset balance;
    uint64_t primary_key() const { return account; }
    EOSLIB_SERIALIZE(Account, (account)(balance));
  };
  typedef multi_index<N(account), Account> accountIndex;

  struct [[eosio::table]] Brand
  {
    uint64_t id;
    string name;
    string image;
    asset price;
    account_name creator;
    account_name owner;
    uint64_t createdAt;
    uint64_t purchasedAt;
    uint64_t expiresAt;
    uint64_t purchasedTimes;
    uint64_t primary_key() const { return id; }
    EOSLIB_SERIALIZE(Brand, (id)(name)(image)(price)(creator)(owner)(createdAt)(purchasedAt)(expiresAt)(purchasedTimes));
  };
  typedef multi_index<N(brand), Brand> brandIndex;

  [[eosio::action]] void create(account_name creator, string name, string image) {
    eosio_assert(!hasGameExpired(), "Game is over");
    require_auth(creator);
    eosio_assert((name.length() <= 30 && image.length() <= 300), "Brand name or image are to big.");
    asset initialPrice = asset(1000, S(4, EOS)); //0.1 EOS
    debit(creator, initialPrice);
    brandIndex brands(_self, _self);
    brands.emplace(_self, [&](auto &brand) {
      brand.id = brands.available_primary_key();
      brand.price = asset(initialPrice.amount + initialPrice.amount * inflationFactor, S(4, EOS));
      brand.creator = creator;
      brand.owner = creator;
      brand.createdAt = now();
      brand.purchasedAt = now();
      brand.expiresAt = 0; // deprecated
      brand.name = name;
      brand.image = image;
      brand.purchasedTimes = 1;
    });
    // update invested and game expiration
    gameIndex games(_self, _self);
    auto gameItr = games.find(0);
    eosio_assert(gameItr != games.end(), "Game has not started");
    games.modify(gameItr, _self, [&](auto &game) {
      game.invested += initialPrice;
      game.lastBuyer = creator;
      game.expiresAt = now() + expirationPeriod;
    });
    deposit(devAccount, initialPrice);
  }

      [[eosio::action]] void buy(uint64_t id, account_name buyer)
  {
    eosio_assert(!hasGameExpired(), "Game is over");
    require_auth(buyer);
    /*#######################################*/
    /* ####### financial application ########*/
    /*#######################################*/
    brandIndex brands(_self, _self);
    auto brandItr = brands.find(id);
    eosio_assert(brandItr != brands.end(), "Brand does not exists");
    auto brand = brands.get(id);
    // debit inflated brand price to buyer
    debit(buyer, brand.price);
    uint64_t inflation = brand.price.amount * inflationFactor;
    // deposit to owner old price + profit
    deposit(brand.owner, asset((brand.price.amount - inflation) + (inflation * 0.6), S(4, EOS)));
    // update pot, invested, expiration time, and last buyer
    uint64_t gameProfit = inflation * 0.4;
    gameIndex games(_self, _self);
    auto gameItr = games.find(0);
    eosio_assert(gameItr != games.end(), "Game has not started");
    games.modify(gameItr, _self, [&](auto &game) {
      game.pot.amount += gameProfit * 0.4;
      game.invested += brand.price;
      game.expiresAt = now() + expirationPeriod;
      game.lastBuyer = buyer;
    });
    // apply dividends
    applyDividends(buyer, asset(gameProfit * 0.15, S(4, EOS)));
    // deposit profit to dev
    deposit(devAccount, asset(gameProfit * 0.25, S(4, EOS)));
    // deposit profit to creator
    deposit(brand.creator, asset(gameProfit * 0.20, S(4, EOS)));
    //update brand information
    uint64_t newInflation = brand.price.amount * inflationFactor;
    brands.modify(brandItr, _self, [&](auto &brand) {
      brand.price.amount += newInflation;
      brand.owner = buyer;
      brand.purchasedAt = now();
      brand.purchasedTimes += 1;
    });
  }

  [[eosio::action]] void withdraw(account_name to) {
    require_auth(to);
    accountIndex accounts(_self, _self);
    auto account = accounts.get(to);
    debit(account.account, account.balance);
    action(
        permission_level{_self, N(active)},
        N(eosio.token), N(transfer),
        make_tuple(_self, account.account, account.balance, std::string("EOS Brands - Withdraw")))
        .send();
  }

      [[eosio::action]] void startgame(asset pot)
  {
    require_auth(_self);
    //delete all accounts
    accountIndex accounts(_self, _self);
    auto accountItr = accounts.begin();
    while (accountItr != accounts.end())
    {
      accountItr = accounts.erase(accountItr);
    }
    //delete all brands
    brandIndex brands(_self, _self);
    auto brandItr = brands.begin();
    while (brandItr != brands.end())
    {
      brandItr = brands.erase(brandItr);
    }

    //delete all last buyers
    lastBuyerIndex lastBuyers(_self, _self);
    auto lastBuyerItr = lastBuyers.begin();
    while (lastBuyerItr != lastBuyers.end())
    {
      lastBuyerItr = lastBuyers.erase(lastBuyerItr);
    }

    // initialize game table
    gameIndex games(_self, _self);
    auto gameItr = games.find(0);
    if (gameItr != games.end())
    {
      games.erase(gameItr);
    }
    games.emplace(_self, [&](auto &game) {
      game.id = 0;
      game.expiresAt = now() + expirationPeriod;
      game.pot = pot;
      game.invested = asset(0, S(4, EOS));
    });
  }

  /*####################################################
  ################## Auxiliary methods #################
  #####################################################*/

  bool hasGameExpired()
  {
    gameIndex games(_self, _self);
    auto gameItr = games.find(0);
    eosio_assert(gameItr != games.end(), "Could not check game expiration time. Game has not started");
    auto game = games.get(0);
    return now() > game.expiresAt;
  }

  void applyDividends(account_name buyer, asset total)
  {
    uint64_t totalBuyers = 0;
    uint64_t maxBuyers = 40;
    asset dividend = asset(total.amount / maxBuyers, S(4,EOS));
    uint64_t oldestBuyerId;
    uint64_t oldestBuyerTime = now();
    lastBuyerIndex lastBuyers(_self, _self);
    for (auto &lastBuyer : lastBuyers)
    {
      if (lastBuyer.purchasedAt < oldestBuyerTime)
      {
        oldestBuyerTime = lastBuyer.purchasedAt;
        oldestBuyerId = lastBuyer.id;
      }
      deposit(lastBuyer.account, dividend);
      totalBuyers++;
    }

    if (totalBuyers >= maxBuyers)
    {
      auto lastBuyerItr = lastBuyers.find(oldestBuyerId);
      lastBuyers.erase(lastBuyerItr);
    }

    lastBuyers.emplace(_self, [&](auto &lastBuyer) {
      lastBuyer.id = lastBuyers.available_primary_key();
      lastBuyer.account = buyer;
      lastBuyer.purchasedAt = now();
    });
  }

  void onTransfer(account_name from, account_name to, eosio::asset quantity, std::string memo)
  {
    if (from == _self || to != _self)
    {
      return;
    }
    eosio_assert(quantity.symbol == string_to_symbol(4, "EOS"), "Only EOS is accepted.");
    eosio_assert(quantity.is_valid(), "Invalid token transfer.");
    eosio_assert(quantity.amount > 0, "Quantity must be positive.");
    deposit(from, quantity);
  }

  void debit(account_name from, asset quantity)
  {
    accountIndex accounts(_self, _self);
    auto accountItr = accounts.find(from);
    eosio_assert(accountItr != accounts.end(), "Debit: Account was not found.");
    auto account = accounts.get(from);
    eosio_assert(account.balance >= quantity, "Debit: Insufficient balance");
    accounts.modify(accountItr, _self, [&](auto &account) {
      account.balance -= quantity;
    });
  }

  void deposit(account_name to, asset quantity)
  {
    accountIndex accounts(_self, _self);
    auto accountItr = accounts.find(to);
    if (accountItr != accounts.end())
    {
      accounts.modify(accountItr, _self, [&](auto &account) {
        account.balance += quantity;
      });
    }
    else
    {
      accounts.emplace(_self, [&](auto &account) {
        account.account = to;
        account.balance = quantity;
      });
    }
  }

  // Catches any action apply
  void apply(account_name contract, action_name act)
  {
    if (contract == N(eosio.token) && act == N(transfer))
    {
      struct transfer_t
      {
        account_name from;
        account_name to;
        eosio::asset quantity;
        std::string memo;
      } t = eosio::unpack_action_data<transfer_t>();
      onTransfer(t.from, t.to, t.quantity, t.memo);
      return;
    }
    if (contract != _self)
      return;
    // needed for EOSIO_API macro
    auto &thiscontract = *this;
    switch (act)
    {
      // first argument is name of CPP class, not contract
      EOSIO_API(brands, (create)(buy)(withdraw)(startgame))
    };
  }
};

extern "C"
{
  void apply(uint64_t receiver, uint64_t code, uint64_t action)
  {
    auto self = receiver;
    brands b(receiver);
    b.apply(code, action);
    eosio_exit(0);
  }
}\
