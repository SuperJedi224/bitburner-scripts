//Bitburner stock trader, requires TIX and 4S API access
/** @param {NS} ns */
export async function main(ns) {
  
  while(true){
    if(ns.getServerMoneyAvailable("home")>500_000_000){
      buyAStock(ns.stock,ns.getServerMoneyAvailable("home")/2.5)
    }
    sellStocks(ns.stock);
    await ns.stock.nextUpdate();
  }
}

/** @param {Stock} stk */
/** @param {Integer} bdgt */
export function buyAStock(stk,bdgt){
  var sym=0,val=0;
  for(var s of stk.getSymbols()){
    if(stk.getPosition(s)[0]>0)continue;
    if(stk.getForecast(s)>0.6){
      var sv=stk.getForecast(s)*Math.sqrt(1+stk.getVolatility(s));
      if(sv>val){
        sym=s;val=sv;
      }
    }
  }
  if(sym){
    var ct=Math.min(
      stk.getMaxShares(sym),
      Math.floor(bdgt/stk.getAskPrice(sym))
      );
    stk.buyStock(sym,ct)
    console.log("Buying "+ct+" "+sym)
    return true;
  }
  return false;
}

/** @param {Stock} stk */
export function sellStocks(stk){
  for(var s of stk.getSymbols()){
    var posit=stk.getPosition(s);
    if(posit[0]==0)continue;
    if(stk.getForecast(s)<0.57){
      if(stk.getForecast(s)<0.54||stk.getBidPrice(s)>1.01*posit[1]){
        stk.sellStock(s,posit[0]);
        console.log("Selling "+posit[0]+" "+s);
      }
    }
  }
}
