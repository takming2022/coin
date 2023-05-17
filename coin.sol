pragma solidity ^0.4.7;

contract coin{
    enum State{
        Started,
        Locked
    }
    State public state = State.Started;
    struct Guess {
        address addr;
        uint256 guess;
    }

    uint256 arraysize = 1000;
    uint256 constant maxguess = 1000000;
    uint256 bettingprice = 0.01 ether;
    uint256 statusprice = 0.01 ether;
    Guess[1000] guesses;
    uint256 numguesses = 0;
    bytes32 curhash = "";

    uint256 stasticsarrayitems = 20;
    uint256[20] statistics;

    uint256 _gameindex = 1;
    struct Winner {
        address addr;
    }
    Winner[1000] winnners;
    uint256 numwinners = 0;

    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    address developer = 0x0;
    event SentPrizeToWinner(
        address winner,
        uint256 money,
        uint256 guess,
        uint256 gameindex,
        uint256 lotterynumber,
        uint256 timestamp
    );
    event SentDeveloperFee(uint256 amount, uint256 balance);

    function bet_various_v2() {
        if (developer == address(0)) {
            developer = msg.sender;
        }
    }

    function setBettingCondition(uint256 _contenders, uint256 _bettingprice) {
        if (msg.sender != developer) return;
        arraysize = _contenders;
        if (arraysize > 1000) arraysize = 1000;
        bettingprice = _bettingprice;
    }

    function getMaxContenders()   returns (uint256) {
        return arraysize;
    }

    function getBettingPrice() constant returns (uint256) {
        return bettingprice;
    }

    function getDeveloperAddresss()
        constant
        returns (uint256[] memory, address[] memory)
    {
        uint256[] memory amounts = new uint256[](numguesses);
        address[] memory guesss = new address[](numguesses);
        for (uint256 i = 0; i < numguesses; i++) {
            amounts[i] = guesses[i].guess;
            guesss[i] = guesses[i].addr;
        }
        return (amounts, guesss);
    }

    function findWinners(uint256 value) returns (uint256) {
        numwinners = 0;
        uint256 lastdiff = maxguess;
        uint256 i = 0;
        int256 diff = 0;
        uint256 guess = 0;
        for (i = 0; i < numguesses; i++) {
            diff = (int256)((int256)(value) - (int256)(guesses[i].guess));
            if (diff < 0) diff = diff * -1;
            if (lastdiff > (uint256)(diff)) {
                guess = guesses[i].guess;
                lastdiff = (uint256)(diff);
            }
        }

        for (i = 0; i < numguesses; i++) {
            diff = (int256)((int256)(value) - (int256)(guesses[i].guess));
            if (diff < 0) diff = diff * -1;
            if (lastdiff == uint256(diff)) {
                winnners[numwinners++].addr = guesses[i].addr;
            }
        }
        return guess;
    }

    function getDeveloperAddress() constant returns (address) {
        return developer;
    }

    function getDeveloperFee() constant returns (uint256) {
        uint256 developerfee = this.balance / 100;
        return developerfee;
    }

    function getBalance() constant returns (uint256) {
        return this.balance;
    }

    function getLotteryMoney() constant returns (uint256) {
        uint256 developerfee = getDeveloperFee();
        uint256 prize = (this.balance - developerfee) /
            (numwinners < 1 ? 1 : numwinners);
        return prize;
    }

    function getBettingStastics() payable returns (uint256[20]) {
        require(msg.value == statusprice); // 0.01 eth
        return statistics;
    }

    function getBettingStatus()
        constant
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            (uint256)(state),
            numguesses,
            getLotteryMoney(),
            this.balance,
            bettingprice
        );
    }

    function setStatusPrice(uint256 value) {
        if (msg.sender != developer) return;
        statusprice = value;
    }

    function finish() {
        if (msg.sender != developer) return;
        _finish();
    }

    function _finish() private {
        state = State.Locked;

        uint256 lotterynumber = (uint256(curhash) + block.timestamp) %
            (maxguess + 1);
        // now that we know the random number was safely generate, let's do something with the random number..
        var guess = findWinners(lotterynumber);
        uint256 prize = getLotteryMoney();
        uint256 remain = this.balance - (prize * numwinners);
        for (uint256 i = 0; i < numwinners; i++) {
            address winner = winnners[i].addr;
            winner.transfer(prize);
            SentPrizeToWinner(
                winner,
                prize,
                guess,
                _gameindex,
                lotterynumber,
                block.timestamp
            );
        }
        // give delveoper the money left behind
        SentDeveloperFee(remain, this.balance);
        developer.transfer(remain);

        numguesses = 0;
        for (i = 0; i < stasticsarrayitems; i++) {
            statistics[i] = 0;
        }
        _gameindex++;
        state = State.Started;
    }

    function addguess(uint256 guess) payable inState(State.Started) {
        require(msg.value == bettingprice);

        uint256 divideby = maxguess / stasticsarrayitems;
        curhash = sha256(
            block.timestamp,
            block.coinbase,
            block.difficulty,
            curhash
        );
        if ((uint256)(numguesses + 1) <= arraysize) {
            guesses[numguesses++] = Guess(msg.sender, guess);
            uint256 statindex = guess / divideby;
            if (statindex >= stasticsarrayitems)
                statindex = stasticsarrayitems - 1;
            statistics[statindex]++;
            if ((uint256)(numguesses) >= arraysize) {
                _finish();
            }
        }
    }
}