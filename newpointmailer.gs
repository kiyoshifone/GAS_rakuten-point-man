function RPoint() {
  var threads = GmailApp.search('point@emagazine.rakuten.co.jp',0,1);
  if (threads.length !== 0){
    for(var i=0;i<threads.length;i++){
      var mb = [];
      var pb = threads[i].getMessages()[0].getPlainBody();
      var st = pb.indexOf('ございます。');
      var en = pb.indexOf('ポイント付与ルール');
      var A = pb.slice(st,st+1000).split('\n');
      for(var j=0;j<A.length;j++){
        if ( A[j].match( /\d{4}.\d{1,2}.\d{1,2}.時点/ ) ){
          mb.push(A[j].slice(0,A[j].indexOf('時点')));
        } else if (A[j].indexOf('ポイント数合計') !== -1){
          mb.push(A[j].slice(-2)+' '+A[j+1].slice(0,-5));
          mb.push(A[j+4].slice(0,4).slice(-2)+' '+A[j+5].slice(0,-5));
          mb.push(A[j+9].slice(2,5)+' '+A[j+12].slice(0,-5));
        } else if (A[j].indexOf('月のランク') !== -1){
          mb.push(A[j].slice(0,A[j].indexOf('月')+1)+' '+A[j+1].trim());
        }
      }
    }
    GmailApp.sendEmail(
      addrs,
      '[GAS]_楽天ポイントお知らせ',
      'html error',
      {
        from:     addrs,
        htmlBody: mb,
        name:     '機械仕掛けのyourname'
      }
    );
    Logger.log(mb);
    Logger.log("mail sent.");
    GmailApp.moveThreadsToTrash(threads);
    GmailApp.markThreadsRead(threads);
  } else {
    Logger.log("no new point mail.")
  }
}
