class Block {
    constructor(timestamp, lastHash, hash, data){
        this.timestamp = timestamp,
        this.lastHash = lastHash,
        this.hash = hash,
        this.data = data
    }

    toString(){
        return `Block -
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash.substring(0,10)}
            Hash     : ${this.hash.substring(0,10)}
            Data     : ${this.data}`;
    }

    //static lets you use this method in other files that require this one without creating a new "Block" instance, all u do is call [ClassName].[MethodName]
    static genesis(){
        return new this('Genesis time', '-----', 'first-hash', [])
    }


}

module.exports = Block;