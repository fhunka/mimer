export default function (server) {
  
  const dataCluster = server.plugins.elasticsearch.getCluster('data');
  
  var myVar = setInterval(myTimer, 15000);
  var count = 0;

  function myTimer() {
    getDocTotal("queries");
    
  }

  function getDocTotal(i, s) {
    console.log("Request" + i + " - " + s);
  }  
}